<template>
  <div class="container mx-auto px-2 py-8">
    <div class="mb-8 flex flex-col items-center justify-between md:flex-row">
      <h1 class="text-3xl font-bold md:w-1/2">{{ $t('header.blogs') }}</h1>
      <!-- 加上文章來源：g0v.social中，vTaiwan標籤下的貼文-->
      <p class="text-sm text-gray-500">
        {{ $t('blog.sourceDescription') }}
        <a href="https://g0v.social/tags/vTaiwan" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 hover:text-blue-800">g0v.social/tags/vTaiwan</a>
      </p>
    </div>

    <!-- 語言切換 Tabs -->
    <div class="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
      <button
        @click="render_setting = 'all'"
        :class="['rounded-md px-4 py-2 text-sm font-medium transition-colors', render_setting === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
      >
        {{ $t('blog.allLanguages') }}
      </button>
      <button
        @click="render_setting = 'current'"
        :class="['rounded-md px-4 py-2 text-sm font-medium transition-colors', render_setting === 'current' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
      >
        {{ $t('blog.currentLanguage') }}
      </button>
    </div>

    <div v-if="loading" class="py-8 text-center">
      <p class="text-gray-600">{{ $t('blog.loading') }}</p>
    </div>

    <div v-else-if="error" class="py-8 text-center">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="post in filteredPosts" :key="post.id" class="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
        <!-- 貼文標頭 -->
        <div class="mb-4 flex items-center space-x-3">
          <img v-if="post.account.avatar" :src="post.account.avatar" :alt="post.account.display_name" class="h-12 w-12 rounded-full" />
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <span class="font-semibold text-gray-900">
                <a :href="post.account.url" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 hover:text-blue-800">{{ post.account.display_name }}</a>
              </span>
            </div>
            <div class="text-sm text-gray-500">
              <a :href="post.url" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 hover:text-blue-800">{{ formatDate(post.created_at) }}</a>
            </div>
          </div>
        </div>

        <!-- 貼文摘要 -->
        <div class="mb-4">
          <div class="prose prose-sm max-w-none" v-html="getSummary(post.content)"></div>
        </div>

        <!-- 互動統計 -->
        <div class="flex items-center space-x-6 text-sm text-gray-500">
          <div class="flex items-center space-x-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span>{{ post.replies_count }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <span>{{ post.reblogs_count }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            <span>{{ post.favourites_count }}</span>
          </div>
        </div>

        <!-- 標籤 -->
        <div v-if="post.tags && post.tags.length > 0" class="mt-4 flex flex-wrap gap-2">
          <span v-for="tag in post.tags" :key="tag.name" class="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-700"> #{{ tag.name }} </span>
        </div>

        <!-- 外部連結 -->
        <div class="mt-4">
          <a :href="post.url" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 hover:text-blue-800">
            {{ $t('blog.viewOriginal') }}
          </a>
        </div>
      </article>
    </div>

    <!-- 無貼文時顯示 -->
    <div v-if="!loading && !error && filteredPosts.length === 0" class="py-8 text-center">
      <p class="text-gray-600">{{ $t('blog.noPosts') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

const { locale } = useI18n()
const { t } = useI18n()

useHead({
  title: t('header.blogs') + ' | vTaiwan',
})

const posts = ref([])
const loading = ref(true)
const error = ref(null)
const render_setting = ref('all') // 預設為"所有語言"模式

// 根據語言過濾貼文
const filteredPosts = computed(() => {
  // 如果是"所有語言"模式，直接返回所有貼文
  if (render_setting.value === 'all') {
    console.log(`🔍 所有語言模式: 顯示全部 ${posts.value.length} 篇貼文`)
    return posts.value
  }

  // 如果是"當前語言"模式，按照原本的邏輯過濾
  const currentLang = locale.value
  const filtered = posts.value.filter(post => {
    // 如果貼文沒有language欄位，全部語言都顯示
    if (!post.language) {
      console.log(`✅ 貼文 ${post.id} 無語言設定，顯示在所有語言下`)
      return true
    }

    // 如果language是zh-TW 或 zh，只在中文時顯示
    if ((post.language === 'zh-TW' || post.language === 'zh') && currentLang === 'zh-TW') {
      console.log(`✅ 貼文 ${post.id} 中文貼文，在中文語言下顯示`)
      return true
    }

    // 如果language是en，只在英文時顯示
    if (post.language === 'en' && currentLang === 'en') {
      console.log(`✅ 貼文 ${post.id} 英文貼文，在英文語言下顯示`)
      return true
    }

    // 如果language是ja，只在日文時顯示
    if (post.language === 'ja' && currentLang === 'ja') {
      console.log(`✅ 貼文 ${post.id} 日文貼文，在日文語言下顯示`)
      return true
    }

    console.log(`❌ 貼文 ${post.id} 語言 ${post.language} 不匹配當前語言 ${currentLang}，不顯示`)
    return false
  })

  console.log(`🔍 當前語言模式: 原始 ${posts.value.length} 篇，過濾後 ${filtered.length} 篇`)
  return filtered
})

// 格式化日期
const formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 取得貼文摘要
const getSummary = content => {
  if (!content) return ''

  // 移除 HTML 標籤
  const textContent = content.replace(/<[^>]*>/g, '')

  // 如果超過50字，截取80字加省略號
  if (textContent.length > 80) {
    return textContent.substring(0, 80) + '...'
  }

  // 如果不超過50字，截取一半弱的字數加省略號
  const halfLength = Math.floor(textContent.length * 0.4) // 取40%作為"一半弱"
  return textContent.substring(0, halfLength) + '...'
}

// 取得 Mastodon 貼文
const fetchPosts = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('🔍 開始獲取 vTaiwan 標籤下的貼文...')
    const response = await fetch('https://g0v.social/api/v1/timelines/tag/vTaiwan?limit=20&local=true')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    posts.value = data
    // console.log('📥 獲取到的原始貼文數據:', data)
    // console.log('📊 貼文總數:', data.length)

    // 詳細記錄每篇貼文的信息
    data.forEach((post, index) => {
      /* console.log(`📝 貼文 ${index + 1}:`, {
        id: post.id,
        url: post.url,
        language: post.language,
        display_name: post.account?.display_name,
        created_at: post.created_at,
        content_length: post.content?.length || 0
      }) */
    })
  } catch (err) {
    console.error('❌ 獲取貼文失敗:', err)
    error.value = t('blog.fetchError')
  } finally {
    loading.value = false
  }
}

// 監聽語言變化
watch(
  () => locale.value,
  () => {
    console.log('Language changed to:', locale.value)
    console.log('Filtered posts:', filteredPosts.value)
  }
)

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.prose :deep(a) {
  @apply text-blue-600 underline hover:text-blue-800;
}

.prose :deep(p) {
  @apply mb-2;
}

.prose :deep(br) {
  @apply mb-2;
}
</style>
