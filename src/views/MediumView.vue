<template>
  <div class="container mx-auto px-2 py-8">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 class="text-3xl font-bold md:w-1/2">{{ $t('medium.title') }}</h1>
      <p class="text-sm text-gray-500">
        {{ $t('medium.sourceDescription') }}
        <a
          :href="`https://medium.com/@${mediumUsername}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:text-blue-800 text-sm"
        >Medium/@{{ mediumUsername }}</a>
      </p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ $t('medium.loading') }}</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="loadArticles"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {{ $t('medium.retry') }}
      </button>
    </div>

    <div v-else-if="articles.length > 0" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="article in articles"
        :key="article.id || article.guid"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
      >
        <!-- 文章標題 -->
        <h2 class="text-xl font-bold mb-3">
          <a
            :href="article.link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-900 hover:text-blue-600 transition-colors"
          >
            {{ article.title }}
          </a>
        </h2>

        <!-- 作者和日期 -->
        <div class="flex items-center space-x-3 mb-4">
          <div v-if="article.author" class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">{{ article.author }}</span>
          </div>
          <div v-if="article.pubDate" class="text-sm text-gray-500">
            {{ formatDate(article.pubDate) }}
          </div>
        </div>

        <!-- 文章摘要 -->
        <div class="mb-4">
          <div class="prose prose-sm max-w-none text-gray-700" v-html="getSummary(article.content || article.description)"></div>
        </div>

        <!-- 標籤 -->
        <div v-if="article.categories && article.categories.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="category in article.categories"
            :key="category"
            class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            #{{ category }}
          </span>
        </div>

        <!-- 外部連結 -->
        <div class="mt-4">
          <a
            :href="article.link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {{ $t('medium.readMore') }} →
          </a>
        </div>
      </article>
    </div>

    <!-- 無文章時顯示 -->
    <div v-if="!loading && !error && articles.length === 0" class="text-center py-8">
      <p class="text-gray-600">{{ $t('medium.noArticles') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

const { locale, t } = useI18n()

useHead({
  title: t('medium.title') + ' | vTaiwan'
})

const articles = ref([])
const loading = ref(false)
const error = ref(null)
const mediumUsername = ref('vtaiwan.tw') // 預設顯示 vtaiwan.tw 的文章

// 格式化日期
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}

// 取得文章摘要
const getSummary = (content) => {
  if (!content) return ''

  // 移除 HTML 標籤
  const textContent = content.replace(/<[^>]*>/g, '')

  // 如果超過150字，截取150字加省略號
  if (textContent.length > 150) {
    return textContent.substring(0, 150) + '...'
  }

  return textContent
}

// 解析 RSS XML
const parseRSS = (xmlText) => {
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

    const parsedArticles = []

    items.forEach((item, index) => {
      try {
        // RSS 2.0 格式
        let title = item.querySelector('title')?.textContent || ''
        let link = item.querySelector('link')?.textContent || ''
        let description = item.querySelector('description')?.textContent || ''
        let content = item.querySelector('content\\:encoded')?.textContent || 
                     item.querySelector('content')?.textContent || 
                     description
        let pubDate = item.querySelector('pubDate')?.textContent || 
                     item.querySelector('published')?.textContent || 
                     item.querySelector('updated')?.textContent || ''
        let author = item.querySelector('dc\\:creator')?.textContent || 
                    item.querySelector('author')?.textContent || 
                    item.querySelector('name')?.textContent || ''
        let guid = item.querySelector('guid')?.textContent || link

        // Atom 格式處理
        if (!title && item.querySelector('title')) {
          title = item.querySelector('title').textContent || ''
        }
        if (!link && item.querySelector('link')) {
          const linkElement = item.querySelector('link')
          link = linkElement.getAttribute('href') || linkElement.textContent || ''
        }

        // 清理 HTML 標籤
        title = title.replace(/<[^>]*>/g, '').trim()
        description = description.replace(/<[^>]*>/g, '').trim()

        // 提取標籤
        const categories = []
        item.querySelectorAll('category').forEach((cat) => {
          const categoryText = cat.textContent || cat.getAttribute('term') || ''
          if (categoryText) {
            categories.push(categoryText)
          }
        })

        // 提取 Atom 格式的標籤
        item.querySelectorAll('category').forEach((cat) => {
          const term = cat.getAttribute('term')
          if (term) {
            categories.push(term)
          }
        })

        if (title && link) {
          parsedArticles.push({
            id: guid || `article-${index}`,
            guid: guid || link,
            title: title,
            link: link,
            description: description,
            content: content,
            pubDate: pubDate,
            author: author,
            categories: categories
          })
        }
      } catch (itemError) {
        console.warn('解析文章項目時出錯:', itemError)
      }
    })

    console.log(`解析完成，共 ${parsedArticles.length} 篇文章`)
    return parsedArticles
  } catch (err) {
    console.error('RSS 解析錯誤:', err)
    throw err
  }
}

// 使用 Medium JSON API 獲取文章
const fetchMediumJSON = async (username) => {
  try {
    // Medium 的非官方 JSON API
    const url = `https://medium.com/@${username}?format=json`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    // Medium 的 JSON 回應通常以 "])}while(1);</x>" 開頭，需要移除
    const jsonText = text.replace(/^[\s\S]*?\{/, '{').replace(/\}\s*$/, '}')
    
    try {
      const data = JSON.parse(jsonText)
      
      // 解析 Medium 的 JSON 結構
      // Medium 的 JSON 結構比較複雜，需要根據實際回應調整
      if (data.payload && data.payload.references) {
        const posts = []
        const postRefs = data.payload.references.Post || {}
        
        Object.values(postRefs).forEach((post) => {
          posts.push({
            id: post.id,
            title: post.title,
            link: `https://medium.com/@${username}/${post.uniqueSlug}`,
            description: post.virtuals?.subtitle || '',
            content: post.content?.bodyModel?.paragraphs?.map(p => p.text).join(' ') || '',
            pubDate: new Date(post.firstPublishedAt || post.createdAt).toISOString(),
            author: post.authorId ? (data.payload.references.User?.[post.authorId]?.name || username) : username,
            categories: post.virtuals?.tags?.map(tag => tag.name) || []
          })
        })

        // 按發布日期排序（最新的在前）
        posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        return posts
      }
    } catch (jsonError) {
      console.warn('JSON 解析失敗，嘗試使用 RSS feed:', jsonError)
      return null
    }

    return []
  } catch (err) {
    console.error('Medium JSON API 錯誤:', err)
    throw err
  }
}

// 使用 RSS feed 獲取文章（使用 CORS 代理）
const fetchRSS = async (username) => {
  // Medium RSS feed URL
  const rssUrl = `https://medium.com/feed/@${username}`
  
  // 使用多個 CORS 代理服務作為備選方案
  const proxyServices = [
    {
      name: 'allorigins.win',
      url: `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
      parser: async (response) => {
        const data = await response.json()
        return data.contents || data
      }
    },
    {
      name: 'corsproxy.io',
      url: `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`,
      parser: async (response) => {
        return await response.text()
      }
    },
    {
      name: 'api.codetabs.com',
      url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`,
      parser: async (response) => {
        return await response.text()
      }
    }
  ]
  
  let lastError = null
  
  // 嘗試每個代理服務
  for (const proxy of proxyServices) {
    try {
      console.log(`🔍 嘗試使用 ${proxy.name} 獲取 Medium RSS feed:`, rssUrl)
      
      const response = await fetch(proxy.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, application/json, */*',
        },
        mode: 'cors'
      })

      if (!response.ok) {
        console.warn(`⚠️ ${proxy.name} 回應狀態: ${response.status} ${response.statusText}`)
        lastError = new Error(`HTTP error! status: ${response.status}`)
        continue
      }

      let xmlText = await proxy.parser(response)
      
      // 如果是 JSON 格式（allorigins.win），提取 contents
      if (typeof xmlText === 'object' && xmlText.contents) {
        xmlText = xmlText.contents
      }
      
      // 確保是字符串
      if (typeof xmlText !== 'string') {
        xmlText = String(xmlText)
      }
      
      // 檢查是否獲取到有效的 XML
      if (!xmlText || xmlText.trim().length === 0) {
        console.warn(`⚠️ ${proxy.name} 回應為空`)
        lastError = new Error('RSS feed 回應為空')
        continue
      }

      // 檢查是否包含 RSS 標記
      if (!xmlText.includes('<rss') && !xmlText.includes('<feed') && !xmlText.includes('<?xml')) {
        console.warn(`⚠️ ${proxy.name} 格式不正確，回應內容:`, xmlText.substring(0, 200))
        lastError = new Error('RSS feed 格式不正確')
        continue
      }

      console.log(`✅ ${proxy.name} RSS feed 獲取成功，開始解析...`)
      const parsedArticles = parseRSS(xmlText)
      
      if (parsedArticles && parsedArticles.length > 0) {
        console.log(`✅ 成功使用 ${proxy.name} 解析 ${parsedArticles.length} 篇文章`)
        return parsedArticles
      } else {
        console.warn(`⚠️ ${proxy.name} RSS feed 解析後沒有文章`)
        lastError = new Error('RSS feed 解析後沒有文章')
      }
    } catch (err) {
      console.warn(`❌ ${proxy.name} 獲取失敗:`, err.message)
      lastError = err
      continue
    }
  }
  
  // 所有代理都失敗
  throw lastError || new Error('所有 CORS 代理服務都無法連接')
}

// 從 URL 中提取 Medium 用戶名
const extractUsernameFromUrl = (input) => {
  if (!input) return null
  
  // 移除前後空格
  const trimmed = input.trim()
  
  // 如果已經是純用戶名（不包含 URL），直接返回
  if (!trimmed.includes('medium.com') && !trimmed.includes('http')) {
    return trimmed.replace('@', '')
  }
  
  // 從 URL 中提取用戶名
  // 匹配格式：https://medium.com/@username 或 medium.com/@username
  const match = trimmed.match(/medium\.com\/@([^\/\s?]+)/)
  if (match && match[1]) {
    return match[1]
  }
  
  // 匹配格式：@username
  const atMatch = trimmed.match(/@([^\s\/]+)/)
  if (atMatch && atMatch[1]) {
    return atMatch[1]
  }
  
  return trimmed.replace('@', '')
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
.prose :deep(a) {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.prose :deep(p) {
  @apply mb-2;
}

.prose :deep(br) {
  @apply mb-2;
}
</style>

