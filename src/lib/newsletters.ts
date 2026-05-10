import { firstSuccessThenFallback } from '@/utils/firstSuccessThenFallback'

const NEWSLETTER_FEED_URL = 'https://vtaiwantw.substack.com/feed'

export interface NewsletterItem {
  id: string
  slug: string
  title: string
  link: string
  author: string
  pubDate: string
  excerpt: string
  description: string
  contentHtml: string
  coverImage: string
}

type RssResponse = string | { contents: string }

let newslettersPromise: Promise<NewsletterItem[]> | null = null

const decodeHtml = (value: string) => {
  if (!value) return ''

  const doc = new DOMParser().parseFromString(value, 'text/html')
  return doc.documentElement.textContent || ''
}

const stripHtml = (value: string) => {
  if (!value) return ''

  const doc = new DOMParser().parseFromString(value, 'text/html')
  return doc.body.textContent?.replace(/\s+/g, ' ').trim() || ''
}

const getExcerpt = (value: string, maxLength = 180) => {
  const plainText = stripHtml(value)

  if (plainText.length <= maxLength) {
    return plainText
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`
}

const getElementTextByTagName = (element: Element, tagNames: string[]) => {
  for (const tagName of tagNames) {
    const text = element.getElementsByTagName(tagName)[0]?.textContent
    if (text) return text.trim()
  }

  return ''
}

const getElementHtmlByTagName = (element: Element, tagNames: string[]) => {
  for (const tagName of tagNames) {
    const html = element.getElementsByTagName(tagName)[0]?.textContent
    if (html) return html.trim()
  }

  return ''
}

const getSlugFromLink = (link: string, fallbackId: string) => {
  try {
    const pathname = new URL(link).pathname
    const slug = pathname.split('/').filter(Boolean).pop()
    return slug || fallbackId
  } catch {
    return fallbackId
  }
}

const getCoverImage = (item: Element) => {
  return item.getElementsByTagName('enclosure')[0]?.getAttribute('url') || ''
}

/** 同一批 feed 內 slug 重複時，保留第一次出現，其餘加上 `-2`、`-3`… 直到不重複。 */
const ensureUniqueSlugs = (items: NewsletterItem[]): NewsletterItem[] => {
  const used = new Set<string>()

  return items.map(item => {
    let slug = item.slug

    if (!used.has(slug)) {
      used.add(slug)
      return item
    }

    let suffix = 2
    let candidate = `${item.slug}-${suffix}`
    while (used.has(candidate)) {
      suffix += 1
      candidate = `${item.slug}-${suffix}`
    }

    used.add(candidate)
    return { ...item, slug: candidate }
  })
}

const parseFeed = (xmlText: string) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
  const parserError = xmlDoc.querySelector('parsererror')

  if (parserError) {
    throw new Error(parserError.textContent || 'RSS 解析失敗')
  }

  const items = Array.from(xmlDoc.querySelectorAll('item'))

  const parsed = items
    .map((item, index) => {
      const link = getElementTextByTagName(item, ['link'])
      const id = getElementTextByTagName(item, ['guid']) || link || `newsletter-${index}`
      const contentHtml = getElementHtmlByTagName(item, ['content:encoded', 'content'])
      const description = decodeHtml(getElementTextByTagName(item, ['description']))

      if (!link) return null

      return {
        id,
        slug: getSlugFromLink(link, `newsletter-${index}`),
        title: decodeHtml(getElementTextByTagName(item, ['title'])) || `Newsletter ${index + 1}`,
        link,
        author: decodeHtml(getElementTextByTagName(item, ['dc:creator', 'author'])),
        pubDate: getElementTextByTagName(item, ['pubDate']),
        excerpt: getExcerpt(contentHtml || description),
        description,
        contentHtml,
        coverImage: getCoverImage(item),
      } satisfies NewsletterItem
    })
    .filter((item): item is NewsletterItem => Boolean(item))

  return ensureUniqueSlugs(parsed)
}

const normalizeFeedResponse = (response: RssResponse) => {
  const xmlText = typeof response === 'object' && response.contents ? response.contents : String(response)

  if (!xmlText || !xmlText.trim()) {
    throw new Error('RSS feed 回應為空')
  }

  if (!xmlText.includes('<rss') && !xmlText.includes('<?xml')) {
    throw new Error('RSS feed 格式不正確')
  }

  return xmlText
}

const fetchFeed = async () => {
  const rssUrl = encodeURIComponent(NEWSLETTER_FEED_URL)
  const proxies = [
    {
      url: `https://api.allorigins.win/get?url=${rssUrl}`,
      parser: async (response: Response) => {
        const data = await response.json()
        return data.contents || data
      },
    },
    {
      url: `https://corsproxy.io/?${rssUrl}`,
      parser: async (response: Response) => response.text(),
    },
    {
      url: `https://api.codetabs.com/v1/proxy/?quest=${rssUrl}`,
      parser: async (response: Response) => response.text(),
    },
  ]

  const controller = new AbortController()
  const requestFns = proxies.map(proxy => {
    return () =>
      fetch(proxy.url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml, application/json, */*',
        },
        mode: 'cors',
      }).then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return proxy.parser(response)
      })
  })

  const xmlText = await firstSuccessThenFallback<RssResponse, string>(requestFns, normalizeFeedResponse, controller)
  return parseFeed(xmlText)
}

export const getNewsletters = async (force = false) => {
  if (!newslettersPromise || force) {
    newslettersPromise = fetchFeed()
  }

  return newslettersPromise
}

export const getNewsletterBySlug = async (slug: string) => {
  const newsletters = await getNewsletters()
  return newsletters.find(item => item.slug === slug) || null
}

export const sanitizeNewsletterHtml = (html: string) => {
  if (!html) return ''

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const blockedSelectors = ['script', 'style', 'iframe', 'form', 'input', 'button', 'textarea', 'select']

  blockedSelectors.forEach(selector => {
    doc.querySelectorAll(selector).forEach(element => element.remove())
  })

  doc.querySelectorAll('*').forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim()

      if (name.startsWith('on')) {
        element.removeAttribute(attribute.name)
        return
      }

      if ((name === 'href' || name === 'src') && /^javascript:/i.test(value)) {
        element.removeAttribute(attribute.name)
      }
    })

    if (element.tagName === 'A') {
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noopener noreferrer')
    }
  })

  return doc.body.innerHTML
}

export { NEWSLETTER_FEED_URL }
