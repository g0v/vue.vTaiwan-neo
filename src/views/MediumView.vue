<template>
  <div class="container mx-auto px-2 py-8">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 class="text-3xl font-bold md:w-1/2">{{ $t('medium.title') }}</h1>
      <p class="text-sm text-gray-500">
        {{ $t('medium.sourceDescription') }}
        <a
          v-if="mediumUsername"
          :href="`https://medium.com/@${mediumUsername}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:text-blue-800 text-sm"
        >Medium/@{{ mediumUsername }}</a>
      </p>
    </div>

    <!-- 配置區域 -->
    <div class="bg-gray-50 rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">{{ $t('medium.configTitle') }}</h2>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('medium.usernameLabel') }}
          </label>
          <input
            v-model="inputUsername"
            type="text"
            :placeholder="$t('medium.usernamePlaceholder')"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="loadArticles"
          />
          <p class="text-xs text-gray-500 mt-1">{{ $t('medium.usernameHint') }}</p>
          <div class="mt-2 p-3 bg-blue-50 rounded-md">
            <p class="text-xs text-blue-800 font-medium mb-1">{{ $t('medium.howToFind') }}</p>
            <ol class="text-xs text-blue-700 list-decimal list-inside space-y-1">
              <li>{{ $t('medium.step1') }}</li>
              <li>{{ $t('medium.step2') }}</li>
              <li>{{ $t('medium.step3') }}</li>
            </ol>
          </div>
        </div>
        <div class="flex items-end">
          <button
            @click="loadArticles"
            :disabled="loading || !inputUsername"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ $t('medium.loadArticles') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ $t('medium.loading') }}</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="loadArticles"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
      <p class="text-sm text-gray-500 mt-2">{{ $t('medium.configHint') }}</p>
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
const inputUsername = ref('')
const mediumUsername = ref('')

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
  
  // 使用 CORS 代理來避免跨域問題
  // 優先使用 allorigins.win，它是一個可靠的公共 CORS 代理
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`
  
  try {
    console.log('🔍 開始獲取 Medium RSS feed:', rssUrl)
    console.log('📡 使用代理:', proxyUrl)
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      mode: 'cors'
    })

    if (!response.ok) {
      console.error(`❌ RSS feed 回應狀態: ${response.status} ${response.statusText}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()
    
    // 檢查是否獲取到有效的 XML
    if (!xmlText || xmlText.trim().length === 0) {
      console.error('❌ RSS feed 回應為空')
      throw new Error('RSS feed 回應為空')
    }

    // 檢查是否包含 RSS 標記
    if (!xmlText.includes('<rss') && !xmlText.includes('<feed') && !xmlText.includes('<?xml')) {
      console.error('❌ RSS feed 格式不正確，回應內容:', xmlText.substring(0, 200))
      throw new Error('RSS feed 格式不正確，可能不是有效的 RSS feed')
    }

    console.log('✅ RSS feed 獲取成功，開始解析...')
    const parsedArticles = parseRSS(xmlText)
    
    if (parsedArticles && parsedArticles.length > 0) {
      console.log(`✅ 成功解析 ${parsedArticles.length} 篇文章`)
      return parsedArticles
    } else {
      console.warn('⚠️ RSS feed 解析後沒有文章')
      return []
    }
  } catch (err) {
    console.error('❌ RSS 獲取錯誤:', err)
    
    // 如果是 CORS 錯誤，提供更詳細的信息
    if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
      throw new Error('CORS 錯誤：無法連接到 Medium RSS feed。請檢查瀏覽器控制台。')
    }
    
    throw err
  }
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
  if (!inputUsername.value.trim()) {
    error.value = t('medium.usernameRequired')
    return
  }

  try {
    loading.value = true
    error.value = null
    articles.value = []

    // 從輸入中提取用戶名（支援 URL 或純用戶名）
    const extractedUsername = extractUsernameFromUrl(inputUsername.value)
    if (!extractedUsername) {
      error.value = t('medium.invalidUsername')
      loading.value = false
      return
    }
    
    const username = extractedUsername
    mediumUsername.value = username

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
  // 可以從 URL 參數或環境變數中讀取預設的 Medium 用戶名
  // 例如：const defaultUsername = import.meta.env.VITE_MEDIUM_USERNAME
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

