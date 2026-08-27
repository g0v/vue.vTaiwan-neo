<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content-wide">
      <div class="vt-page-intro flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="vt-section-label">{{ $t('pageLabels.mastodon') }}</p>
          <h1 class="vt-page-title">
            <span class="vt-title-underline">{{ $t('header.mastodon') }}</span>
          </h1>
        </div>
        <p class="text-vt-gray-700 max-w-xl font-sans text-xs leading-6 md:text-right">
          {{ $t('blog.sourceDescription') }}
          <a href="https://g0v.social/tags/vTaiwan" target="_blank" rel="noopener noreferrer" class="text-democratic-red font-medium hover:underline">g0v.social/tags/vTaiwan</a>
        </p>
      </div>

      <div class="bg-vt-gray-800/4 border-vt-gray-800/5 mb-7 flex w-fit max-w-full gap-1 rounded-full border p-1" role="group" :aria-label="$t('blog.languageSelect')">
        <button
          type="button"
          @click="render_setting = 'all'"
          :aria-pressed="render_setting === 'all'"
          :class="[
            'focus-visible:outline-democratic-red rounded-full px-4 py-2 font-sans text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2',
            render_setting === 'all' ? 'text-democratic-red bg-white shadow-sm' : 'text-vt-gray-700',
          ]"
        >
          {{ $t('blog.allLanguages') }}
        </button>
        <button
          type="button"
          @click="render_setting = 'current'"
          :aria-pressed="render_setting === 'current'"
          :class="[
            'focus-visible:outline-democratic-red rounded-full px-4 py-2 font-sans text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2',
            render_setting === 'current' ? 'text-democratic-red bg-white shadow-sm' : 'text-vt-gray-700',
          ]"
        >
          {{ $t('blog.currentLanguage') }}
        </button>
      </div>

      <div v-if="loading" class="vt-status-panel" role="status">
        <span class="border-vt-border border-t-democratic-red h-8 w-8 animate-spin rounded-full border-2" aria-hidden="true" />
        <p>{{ $t('blog.loading') }}</p>
      </div>

      <div v-else-if="error" class="vt-status-panel" role="alert">
        <p class="text-democratic-red">{{ error }}</p>
      </div>

      <div v-else-if="filteredPosts.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="post in filteredPosts" :key="post.id" class="vt-glass-panel flex flex-col p-6">
          <div class="mb-5 flex items-center gap-3">
            <img v-if="post.account.avatar" :src="post.account.avatar" :alt="post.account.display_name" class="border-vt-border h-11 w-11 rounded-full border object-cover" />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-vt-gray-800 font-semibold">
                  <a :href="post.account.url" target="_blank" rel="noopener noreferrer" class="hover:text-democratic-red text-sm transition-colors">{{ post.account.display_name }}</a>
                </span>
              </div>
              <div class="text-vt-gray-400 font-sans text-xs">
                <a :href="post.url" target="_blank" rel="noopener noreferrer" class="hover:text-democratic-red transition-colors">{{ formatDate(post.created_at) }}</a>
              </div>
            </div>
          </div>

          <p class="text-vt-gray-700 grow text-sm leading-7">{{ getSummary(post.content) }}</p>

          <div class="text-vt-gray-400 mt-5 flex items-center gap-5 font-sans text-xs">
            <div class="flex items-center gap-1.5">
              <IconWrapper name="message-circle" :size="15" />
              <span>{{ post.replies_count }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <IconWrapper name="repeat-2" :size="15" />
              <span>{{ post.reblogs_count }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <IconWrapper name="heart" :size="15" />
              <span>{{ post.favourites_count }}</span>
            </div>
          </div>

          <div v-if="post.tags && post.tags.length > 0" class="mt-4 flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag.name" class="vt-pill">#{{ tag.name }}</span>
          </div>

          <div class="mt-4">
            <a :href="post.url" target="_blank" rel="noopener noreferrer" class="text-democratic-red font-sans text-sm font-medium hover:underline">{{ $t('blog.viewOriginal') }} →</a>
          </div>
        </article>
      </div>

      <div v-else-if="!loading && !error" class="vt-status-panel">
        <p>{{ $t('blog.noPosts') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import IconWrapper from '@/components/IconWrapper.vue'

const { locale } = useI18n()
const { t } = useI18n()

useHead({
  title: t('header.mastodon') + ' | vTaiwan',
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
    const response = await fetch('https://vtaiwan-transcription-worker.bestian123.workers.dev/api/mastodon')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    posts.value = data
  } catch (err) {
    console.error('❌ 獲取貼文失敗:', err)
    error.value = t('blog.fetchError')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>
