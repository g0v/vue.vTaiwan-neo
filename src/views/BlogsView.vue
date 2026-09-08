<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content max-w-3xl">
      <div class="vt-page-intro">
        <p class="vt-section-label">{{ t('pageLabels.blog') }}</p>
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h1 class="vt-page-title">
            <span class="vt-title-underline">{{ t('medium.title') }}</span>
          </h1>
          <p class="text-vt-gray-700 m-0 font-sans text-xs">
            {{ t('medium.sourceDescription') }}
            <a :href="`https://medium.com/@${mediumUsername}`" target="_blank" rel="noopener noreferrer" class="text-democratic-red font-medium hover:underline">Medium/@{{ mediumUsername }}</a>
          </p>
        </div>
      </div>

      <div v-if="loading" class="vt-status-panel" role="status">
        <span class="border-vt-border border-t-democratic-red h-8 w-8 animate-spin rounded-full border-2" aria-hidden="true" />
        <p>{{ t('medium.loading') }}</p>
      </div>

      <div v-else-if="error" class="vt-status-panel" role="alert">
        <p class="text-democratic-red max-w-xl">{{ error }}</p>
        <button type="button" class="vt-btn vt-btn-primary" @click="loadArticles">{{ t('medium.retry') }}</button>
      </div>

      <div v-else-if="articles.length > 0">
        <article v-for="article in articles" :key="article.id" class="border-vt-border/80 border-b py-7 first:pt-0 last:border-b-0">
          <div class="vt-meta-row mb-3">
            <span v-for="category in article.categories?.slice(0, 3)" :key="category" class="vt-pill">#{{ category }}</span>
            <span v-if="article.pubDate">{{ formatDate(article.pubDate) }}</span>
            <span v-if="article.author">· {{ article.author }}</span>
          </div>
          <h2 class="m-0 text-2xl leading-snug tracking-[-0.01em]">
            <a :href="article.link" target="_blank" rel="noopener noreferrer" class="text-vt-gray-800 hover:text-democratic-red transition-colors">{{ article.title }}</a>
          </h2>
          <p class="text-vt-gray-700 mt-3 line-clamp-3 text-sm leading-7">{{ article.summary }}</p>
          <a :href="article.link" target="_blank" rel="noopener noreferrer" class="text-democratic-red mt-4 inline-flex items-center font-sans text-sm font-medium hover:underline">
            {{ t('medium.readMore') }} →
          </a>
        </article>
      </div>

      <div v-else class="vt-status-panel">
        <p>{{ t('medium.noArticles') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { firstSuccessThenFallback } from '@/utils/firstSuccessThenFallback'

const { locale, t } = useI18n()

useHead({
  title: t('medium.title') + ' | vTaiwan',
})

interface Article {
  id: string
  title: string
  link: string
  summary: string
  pubDate: string
  author: string
  categories: string[]
}

const articles = ref<Article[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const mediumUsername = ref('vtaiwan.tw') // 預設顯示 vtaiwan.tw 的文章

// 格式化日期
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (e) {
    return dateString
  }
}

// 取得文章摘要
const getSummary = (content: string) => {
  if (!content) return ''

  // 移除 HTML 標籤
  const textContent = content.replace(/<[^>]*>/g, '')

  // 如果超過150字，截取150字加省略號
  if (textContent.length > 150) {
    return textContent.substring(0, 150) + '...'
  }

  return textContent
}

const getElementTextByTagName = (element: Element, tagNames: string[]) => {
  for (const tagName of tagNames) {
    const text = element.getElementsByTagName(tagName)[0]?.textContent
    if (text) return text
  }

  return ''
}

// 解析 RSS XML
const parseRSS = (xmlText: string) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

    // 檢查是否有解析錯誤
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      const errorText = parserError.textContent || '未知錯誤'
      console.error('XML 解析錯誤:', errorText)
      throw new Error(`RSS 解析失敗: ${errorText}`)
    }

    // 嘗試獲取 RSS 2.0 格式的 items
    let items = xmlDoc.querySelectorAll('item')

    // 如果沒有找到 items，嘗試 Atom 格式
    if (items.length === 0) {
      items = xmlDoc.querySelectorAll('entry')
    }

    if (items.length === 0) {
      console.warn('RSS feed 中沒有找到文章項目')
      return []
    }

    const parsedArticles: Article[] = []

    items.forEach((item, index) => {
      try {
        // RSS 2.0 格式
        const title = getElementTextByTagName(item, ['title'])
        const link = getElementTextByTagName(item, ['link'])
        const summary = getSummary(getElementTextByTagName(item, ['content:encoded', 'content', 'description']))
        const pubDate = getElementTextByTagName(item, ['pubDate', 'published', 'updated'])
        const author = getElementTextByTagName(item, ['dc:creator', 'author', 'name'])
        const id = getElementTextByTagName(item, ['guid']) || link || `article-${index}`

        // 提取標籤
        const categories: string[] = []
        Array.from(item.getElementsByTagName('category')).forEach(cat => {
          const categoryText = cat.textContent || cat.getAttribute('term') || ''
          if (categoryText) {
            categories.push(categoryText)
          }
        })

        if (title && link) {
          parsedArticles.push({ id, title, link, summary, pubDate, author, categories })
        }
      } catch (itemError) {
        console.warn('解析文章項目時出錯:', itemError)
      }
    })

    return parsedArticles
  } catch (err) {
    console.error('RSS 解析錯誤:', err)
    throw err
  }
}

type RssResponse = string | { contents: string }

const checkRSSFormat = (rssRes: RssResponse) => {
  // 如果是 JSON 格式（allorigins.win），提取 contents
  if (typeof rssRes === 'object' && rssRes.contents) {
    rssRes = rssRes.contents
  }

  // 確保是字符串
  if (typeof rssRes !== 'string') {
    rssRes = String(rssRes)
  }

  // 檢查是否獲取到有效的 XML
  if (!rssRes || rssRes.trim().length === 0) {
    throw new Error('RSS feed 回應為空')
  }

  // 檢查是否包含 RSS 標記
  if (!rssRes.includes('<rss') && !rssRes.includes('<feed') && !rssRes.includes('<?xml')) {
    throw new Error('RSS feed 格式不正確')
  }

  console.log(`✅ RSS feed 獲取成功，開始解析...`)
  return rssRes
}

// 使用 RSS feed 獲取文章（使用 CORS 代理）
const fetchRSS = async (username: string) => {
  // Medium RSS feed URL
  const rssUrl = encodeURIComponent(`https://medium.com/feed/@${username}`)

  // 使用多個 CORS 代理服務作為備選方案
  const proxyServices = [
    {
      name: 'Cloudflare Worker CORS Proxy',
      url: `https://vtaiwan-transcription-worker.bestian123.workers.dev/api/cors-proxy?url=${rssUrl}`,
      parser: async (response: Response) => response.text(),
    },
  ]

  const requestFns = []
  const controller = new AbortController()

  for (const proxy of proxyServices) {
    requestFns.push(() =>
      fetch(proxy.url, {
        signal: controller.signal,
        method: 'GET',
        headers: { Accept: 'application/rss+xml, application/xml, text/xml, application/json, */*' },
        mode: 'cors',
      }).then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        console.log(`✅ ${proxy.name} 服務請求成功`)
        return proxy.parser(res)
      })
    )
  }

  const xmlText = await firstSuccessThenFallback<RssResponse, string>(requestFns, checkRSSFormat, controller)

  const parsedArticles = parseRSS(xmlText)

  if (parsedArticles && parsedArticles.length > 0) {
    console.log(`✅ 成功解析 ${parsedArticles.length} 篇文章`)
    return parsedArticles
  }

  let lastError = null

  // 所有代理都失敗
  throw lastError || new Error('所有 CORS 代理服務都無法連接')
}

// 載入文章
const loadArticles = async () => {
  try {
    loading.value = true
    error.value = null
    articles.value = []

    const username = mediumUsername.value

    console.log('🔍 開始獲取 Medium 文章，用戶名:', username)

    // 只使用 RSS feed（最可靠的方式）
    try {
      const rssArticles = await fetchRSS(username)
      if (rssArticles && rssArticles.length > 0) {
        articles.value = rssArticles
        console.log('✅ 成功從 RSS feed 獲取', rssArticles.length, '篇文章')
        return
      } else {
        error.value = t('medium.noArticlesFound')
        console.warn('RSS feed 返回空結果')
      }
    } catch (rssError) {
      if (rssError instanceof Error) {
        console.error('RSS feed 獲取失敗:', rssError)

        // 提供更詳細的錯誤信息
        if (rssError.message.includes('CORS') || rssError.message.includes('Failed to fetch')) {
          error.value = t('medium.corsError') || '無法連接到 Medium RSS feed，可能是 CORS 限制。請檢查瀏覽器控制台獲取詳細信息。'
        } else if (rssError.message.includes('404') || rssError.message.includes('404')) {
          error.value = t('medium.userNotFound') || `找不到用戶名 "${username}" 的 Medium RSS feed，請確認用戶名是否正確。`
        } else {
          error.value = `${t('medium.fetchError')}: ${rssError.message}`
        }
      }
    }
  } catch (err) {
    console.error('❌ 獲取文章失敗:', err)
    error.value = t('medium.fetchError')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 自動載入預設的 Medium 用戶文章
  loadArticles()
})
</script>

<style scoped>
@reference '../style.css';
</style>
