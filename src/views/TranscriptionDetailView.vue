<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content max-w-4xl">
      <div class="vt-page-intro flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="vt-section-label">{{ t('pageLabels.transcriptions') }}</p>
          <h1 class="vt-page-title">{{ t('transcriptionDetail.title') }} · {{ formatMeetingId(meetingId) }}</h1>
          <p class="vt-page-description">{{ t('transcriptionDetail.description') }}</p>
        </div>
        <RouterLink to="/transcriptions" class="vt-btn vt-btn-ghost shrink-0">{{ t('transcriptionDetail.backToList') }}</RouterLink>
      </div>

      <div class="border-jade-green/20 bg-vt-green-tint mb-6 rounded-2xl border p-4">
        <div class="flex items-center gap-3">
          <img src="@/assets/CC_BY_SA.png" alt="CC-BY-SA-4.0" class="h-8 w-auto" />
          <div class="text-vt-gray-800 text-sm">
            <p class="font-medium">
              <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant" target="_blank" rel="noopener noreferrer" class="hover:text-democratic-red underline">{{
                t('transcriptionDetail.licenseTitle')
              }}</a>
            </p>
            <p class="text-vt-gray-700 mt-1 text-xs">{{ t('transcriptionDetail.licenseDescription') }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="vt-status-panel" role="status">
        <span class="border-vt-border border-t-democratic-red h-8 w-8 animate-spin rounded-full border-2" aria-hidden="true" />
        <p>{{ t('transcriptionDetail.loading') }}</p>
      </div>

      <div v-else-if="error" class="vt-status-panel" role="alert">
        <p class="text-democratic-red">{{ error }}</p>
      </div>

      <div v-else-if="transcriptionContent.length > 0" class="vt-glass-panel divide-vt-border/70 divide-y overflow-hidden">
        <article v-for="(message, index) in transcriptionContent" :key="index" class="p-5 sm:p-6">
          <div class="flex items-start gap-4">
            <div class="shrink-0">
              <div class="bg-vt-green-tint text-jade-green flex h-10 w-10 items-center justify-center overflow-hidden rounded-full font-sans font-semibold">
                <img v-if="getPhotoURL(getSpeaker(message))" :src="getPhotoURL(getSpeaker(message))" :alt="t('transcriptionDetail.photoAlt')" class="h-10 w-10 rounded-full" />
                <span v-else aria-hidden="true">{{ getSpeaker(message).slice(0, 1) }}</span>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-vt-gray-400 mb-2 font-sans text-xs">
                <strong class="text-vt-gray-800 text-sm">{{ getSpeaker(message) }}</strong> · {{ getDateTime(message) }}
              </div>
              <div class="text-vt-gray-800 leading-7 break-words whitespace-pre-wrap">{{ dropSpeakerAndDateTime(message) }}</div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="vt-status-panel">
        <p>{{ t('transcriptionDetail.noContent') }}</p>
      </div>
    </div>
  </section>
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
