<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mx-auto max-w-4xl">
      <!-- CC-BY-SA-4.0 授權標註 -->
      <div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div class="flex items-center space-x-3">
          <img src="@/assets/CC_BY_SA.png" alt="CC-BY-SA-4.0" class="h-8 w-auto" />
          <div class="text-sm text-blue-800">
            <p class="font-medium">
              本內容以 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">CC-BY-SA-4.0</a> 授權分享
            </p>
            <p class="mt-1 text-xs">您可以自由分享、修改本內容，惟需標註原作者並以相同授權條款分享</p>
          </div>
        </div>
      </div>

      <!-- 頁面標題 -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="mb-2 text-3xl font-bold text-gray-900">{{ t('transcriptionDetail.title') }} - {{ formatMeetingId(meetingId) }}</h1>
            <p class="text-gray-600">{{ t('transcriptionDetail.description') }}</p>
          </div>
          <RouterLink to="/transcriptions" class="flex items-center space-x-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>{{ t('transcriptionDetail.backToList') }}</span>
          </RouterLink>
        </div>
      </div>

      <!-- 載入狀態 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="error" class="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        {{ error }}
      </div>

      <!-- 逐字稿內容 -->
      <div v-if="!loading && !error && transcriptionContent.length > 0" class="space-y-0">
        <div v-for="(message, index) in transcriptionContent" :key="index" class="border-b border-gray-200 bg-white p-6 md:rounded-lg md:border md:border-b-0 md:border-gray-200 md:shadow-md">
          <div class="flex items-start space-x-4">
            <!-- 頭像 -->
            <div class="flex-shrink-0">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                <img v-if="getPhotoURL(getSpeaker(message))" :src="getPhotoURL(getSpeaker(message))" :alt="t('transcriptionDetail.photoAlt')" class="h-10 w-10 rounded-full" />
                <svg v-else class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>

            <!-- 訊息內容 -->
            <div class="min-w-0 flex-1">
              <div class="mb-2 text-sm text-gray-500">{{ getSpeaker(message) }} {{ getDateTime(message) }}</div>
              <div class="whitespace-pre-wrap break-all leading-relaxed text-gray-900">
                {{ dropSpeakerAndDateTime(message) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="!loading && !error && transcriptionContent.length === 0" class="py-12 text-center">
        <p class="text-gray-500">{{ t('transcriptionDetail.noContent') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
const { t } = useI18n()
useHead({
  title: t('transcriptionDetail.title') + ' | vTaiwan',
})
const route = useRoute()

// 定義 props
const props = defineProps<{
  user?: any
  userData?: any
}>()

// 從路由參數獲取會議ID
const meetingId = computed(() => route.params.meeting_id as string)

// 響應式數據
const loading = ref(true)
const error = ref('')
const transcriptionContent = ref<string[]>([])

// 格式化會議ID (20250621 -> 2025-06-21)
const formatMeetingId = (meetingId: string): string => {
  if (meetingId.length === 8) {
    return `${meetingId.substring(0, 4)}-${meetingId.substring(4, 6)}-${meetingId.substring(6, 8)}`
  }
  return meetingId
}

// 取得發言者
const getSpeaker = (message: string): string => {
  return message
    .split('\n')[0]
    .replace(/^\[.+?\]/, '')
    .replace(/:.+$/, '')
}

const getDateTime = (message: string): string => {
  return message.split('\n')[0].replace(/\].+?$/, ']')
}

const dropSpeakerAndDateTime = (message: string): string => {
  const speaker = getSpeaker(message)
  return message.split(speaker)[1].replace(': ', '')
}

// 載入逐字稿內容
const loadTranscriptionContent = async () => {
  try {
    loading.value = true
    error.value = ''

    const url = `https://r2-vtaiwan.bestian.tw/${meetingId.value}.txt`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()

    // 按 \n{2,4} 分割內容
    transcriptionContent.value = text.split(/\n{2,4}/).filter(block => block.trim().length > 0)
  } catch (err) {
    console.error('載入逐字稿失敗:', err)
    error.value = t('transcriptionDetail.loadError')
  } finally {
    loading.value = false
  }
}

const getPhotoURL = (speaker: string): string => {
  if (props.userData && props.userData.name == speaker.replace(/\s+/g, '')) {
    return props.userData.photoURL
  }
  return ''
}

// 組件掛載時載入數據
onMounted(() => {
  loadTranscriptionContent()
})
</script>

<style scoped>
/* 自定義樣式如果需要 */
</style>
