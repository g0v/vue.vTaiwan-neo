<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content-wide">
      <div class="vt-page-intro">
        <p class="vt-section-label">{{ t('pageLabels.transcriptions') }}</p>
        <h1 class="vt-page-title">
          <span class="vt-title-underline">{{ t('transcriptions.title') }}</span>
        </h1>
        <p class="vt-page-description">{{ t('transcriptions.description') }}</p>
      </div>

      <section v-if="props.user" class="vt-glass-panel mb-7 p-6 sm:p-8" :aria-labelledby="'upload-transcription-title'">
        <h2 id="upload-transcription-title" class="vt-panel-title">{{ t('transcriptions.upload.title') }}</h2>
        <p class="text-vt-gray-700 mt-2 leading-7">{{ t('transcriptions.upload.description') }}</p>
        <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            ref="fileInput"
            type="file"
            accept=".txt,.srt,.md"
            class="text-vt-gray-700 file:bg-vt-red-tint file:text-democratic-red block min-w-0 flex-1 font-sans text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
            @change="handleFileSelect"
          />
          <button type="button" :disabled="!selectedFile || uploading" class="vt-btn vt-btn-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-50" @click="uploadTranscription">
            {{ uploading ? t('transcriptions.upload.uploading') : t('transcriptions.upload.uploadButton') }}
          </button>
        </div>
      </section>

      <div v-else class="border-wheat-yellow/20 bg-vt-yellow-tint text-vt-gray-800 mb-7 flex items-center gap-3 rounded-2xl border p-5">
        <IconWrapper name="triangle-alert" :size="20" class="text-wheat-yellow shrink-0" />
        <p>{{ t('transcriptions.upload.loginRequired') }}</p>
      </div>

      <div v-if="loading" class="vt-status-panel" role="status">
        <span class="border-vt-border border-t-democratic-red h-8 w-8 animate-spin rounded-full border-2" aria-hidden="true" />
        <p>{{ t('common.loading') }}</p>
      </div>
      <div v-else-if="error" class="vt-status-panel" role="alert">
        <p class="text-democratic-red">{{ error }}</p>
      </div>

      <section v-else-if="transcriptions.length" :aria-labelledby="'transcription-list-title'">
        <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="transcription-list-title" class="vt-panel-title">{{ t('transcriptions.list.title') }}</h2>
          <label class="sr-only" for="transcription-search">{{ t('common.search') }}</label>
          <input id="transcription-search" v-model="search" type="search" :placeholder="t('common.search')" class="vt-form-control sm:max-w-xs" />
        </div>

        <div class="space-y-4">
          <article v-for="transcription in filteredTranscriptions" :key="transcription.meeting_id" class="vt-glass-panel relative p-6 sm:p-7">
            <span v-if="transcription.meeting_id === '20250621'" class="bg-vt-yellow-tint text-wheat-yellow absolute top-4 right-4 rounded-full px-3 py-1 font-sans text-xs font-semibold">{{
              t('blog.prototype')
            }}</span>
            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-3">
                  <img src="@/assets/CC0.png" alt="CC0" class="h-7 w-auto" />
                  <h3 class="m-0 text-lg">{{ t('transcriptions.list.meetingId') }}: {{ transcription.meeting_id }}</h3>
                </div>
                <div v-html="getRenderedOutlinePreview(transcription.outline)" class="prose text-vt-gray-700 mt-4 max-w-none text-sm"></div>
                <p class="text-vt-gray-400 mt-4 font-mono text-xs">{{ t('transcriptions.list.fileName') }}: transcript-{{ formatMeetingId(transcription.meeting_id) }}.txt</p>
              </div>
              <div class="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
                <button type="button" class="vt-btn vt-btn-secondary px-4 py-2 text-sm" @click="showOutline(transcription.outline, transcription.meeting_id)">
                  {{ t('transcriptions.list.viewOutline') }}
                </button>
                <RouterLink :to="`/transcription_detail/${transcription.meeting_id}`" class="vt-btn vt-btn-primary px-4 py-2 text-sm">{{ t('transcriptions.list.viewDetail') }}</RouterLink>
                <button type="button" class="vt-btn vt-btn-ghost px-4 py-2 text-sm" @click="downloadTranscription(transcription.meeting_id)">{{ t('transcriptions.list.download') }}</button>
                <button type="button" class="vt-btn vt-btn-ghost px-4 py-2 text-sm" @click="copyTranscriptionLink(transcription.meeting_id)">{{ t('transcriptions.list.copyLink') }}</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div v-else class="vt-status-panel">
        <p>{{ t('transcriptions.list.empty') }}</p>
      </div>
    </div>

    <div v-if="showOutlineModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" @click="closeOutlineModal">
      <div class="vt-glass-panel max-h-[85vh] w-full max-w-4xl overflow-hidden bg-white/95" role="dialog" aria-modal="true" :aria-labelledby="'outline-dialog-title'" @click.stop>
        <header class="border-vt-border flex items-center justify-between border-b p-5 sm:p-6">
          <h3 id="outline-dialog-title" class="m-0 text-xl">{{ t('transcriptions.outline.title') }} · {{ currentOutlineMeetingId }}</h3>
          <button type="button" class="vt-icon-button" :aria-label="t('transcriptions.outline.close')" @click="closeOutlineModal"><IconWrapper name="x" :size="19" /></button>
        </header>
        <div class="max-h-[58vh] overflow-y-auto p-5 sm:p-6">
          <img src="@/assets/CC0.png" alt="CC0" class="mb-4 h-8 w-auto" />
          <div v-if="!editing" id="renderedOutline" v-html="renderedOutline" class="prose max-w-none"></div>
          <textarea v-else v-model="myOutline" class="vt-form-control min-h-72 resize-y font-mono"></textarea>
        </div>
        <footer class="border-vt-border flex flex-wrap gap-3 border-t p-5 sm:p-6">
          <button type="button" class="vt-btn vt-btn-ghost" @click="copyOutline"><IconWrapper name="copy" :size="16" />{{ t('transcriptions.outline.copy') }}</button>
          <button v-if="userData?.uid" type="button" class="vt-btn vt-btn-secondary" @click="toggleEditOutline">
            <IconWrapper :name="editing ? 'save' : 'edit'" :size="16" />{{ editing ? t('transcriptions.outline.saveAndEndEdit') : t('transcriptions.outline.edit') }}
          </button>
          <button v-if="editing" type="button" class="vt-btn vt-btn-ghost" @click="cancelEditOutline">{{ t('transcriptions.outline.cancel') }}</button>
          <button type="button" class="vt-btn vt-btn-primary sm:ml-auto" @click="closeOutlineModal">{{ t('transcriptions.outline.close') }}</button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import axios from 'axios'
import { marked } from 'marked'
import { sanitizeHtml } from '../lib/sanitize'
import IconWrapper from '@/components/IconWrapper.vue'

interface Transcription {
  meeting_id: string
  transcription: string
  outline: string
}

const { locale, t } = useI18n()
useHead({
  title: t('transcriptions.title') + ' | vTaiwan',
})

// 當前語言
const currentLanguage = computed(() => locale.value)

// 定義 props
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  userData: {
    type: Object,
    default: null,
  },
})

// 配置 marked 選項
marked.setOptions({
  breaks: true, // 支援換行
  gfm: true, // GitHub Flavored Markdown
})

// 計算用戶是否有管理員權限
const isAdmin = computed(() => {
  return props.userData && (props.userData.isAdmin === true || props.userData.isSuperAdmin === true)
})

// 響應式數據
const transcriptions = ref<Transcription[]>([])
const loading = ref(true)
const error = ref('')
const uploading = ref(false)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()

// 大綱彈出視窗相關
const showOutlineModal = ref(false)
const currentOutline = ref('')
const currentOutlineMeetingId = ref('')
const editing = ref(false)
const myOutline = ref('')

// 搜尋
const search = ref('')

// 依會議 ID（YYYYMMDD）由新到舊排列
const filteredTranscriptions = computed(() => {
  return transcriptions.value.filter(t => t.meeting_id.includes(search.value) || t.outline.includes(search.value)).sort((a, b) => b.meeting_id.localeCompare(a.meeting_id))
})

// 渲染 Markdown 內容
const renderedOutline = computed(() => {
  if (!currentOutline.value) return ''
  return sanitizeHtml(marked.parse(currentOutline.value, { async: false }))
})

// 預覽內容
const previewOutline = computed(() => {
  if (!myOutline.value) return ''
  return marked(myOutline.value)
})

// 渲染大綱預覽（截斷後的markdown）
const getRenderedOutlinePreview = computed(() => {
  return (outline: string) => {
    if (!outline) return ''

    // const truncated = outline
    // 截斷文字
    const truncated = outline.length > 500 ? outline.substring(0, 500) + '...' : outline

    // 渲染 markdown
    return sanitizeHtml(marked.parse(truncated, { async: false }))
  }
})

// 載入逐字稿列表
const loadTranscriptions = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch('https://vtaiwan-transcription-worker.bestian123.workers.dev/api/query-table')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    transcriptions.value = data
  } catch (err) {
    console.error('載入逐字稿失敗:', err)
    error.value = t('transcriptions.messages.loadError')
  } finally {
    loading.value = false
  }
}

// 處理檔案選擇
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

// 提取會議ID從檔案名稱
const extractMeetingIdFromFilename = (filename: string): string => {
  // 假設檔案名稱格式為 transcript-2025-06-21.txt
  const match = filename.match(/transcript-(\d{4}-\d{2}-\d{2})/)
  if (match) {
    return match[1].replace(/-/g, '') // 轉換為 20250621 格式
  }
  return ''
}

// 檢查會議ID是否已存在
const checkMeetingExists = (meetingId: string): boolean => {
  return transcriptions.value.some(t => t.meeting_id === meetingId)
}

// 上傳逐字稿
const uploadTranscription = async () => {
  if (!selectedFile.value) {
    alert(t('transcriptions.messages.selectFileFirst'))
    return
  }

  const meetingId = extractMeetingIdFromFilename(selectedFile.value.name)
  if (!meetingId) {
    alert(t('transcriptions.messages.invalidFileName'))
    return
  }

  // 檢查是否已存在
  if (checkMeetingExists(meetingId)) {
    if (!isAdmin.value) {
      alert(t('transcriptions.messages.existsRequireAdmin'))
      return
    }

    if (!window.confirm(t('transcriptions.messages.confirmUpdate', { meetingId }))) {
      return
    }
  }

  try {
    uploading.value = true

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await fetch('https://vtaiwan-transcription-worker.bestian123.workers.dev/api/upload-transcription', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`上傳失敗: ${response.status}`)
    }

    alert(t('transcriptions.messages.uploadSuccess'))

    // 重新載入列表
    await loadTranscriptions()

    // 清除檔案選擇
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (err) {
    console.error('上傳失敗:', err)
    alert(t('transcriptions.messages.uploadError'))
  } finally {
    uploading.value = false
  }
}

// 顯示大綱
const showOutline = (outline: string, meetingId: string) => {
  currentOutline.value = outline
  currentOutlineMeetingId.value = meetingId
  showOutlineModal.value = true
}

// 關閉大綱視窗
const closeOutlineModal = () => {
  showOutlineModal.value = false
  currentOutline.value = ''
  currentOutlineMeetingId.value = ''
}

// 複製大綱到剪貼簿
const copyOutline = async () => {
  try {
    await navigator.clipboard.writeText(currentOutline.value)
    alert(t('transcriptions.outline.copySuccess'))
  } catch (err) {
    console.error('複製失敗:', err)
    // 降級方案：使用傳統方法
    const textArea = document.createElement('textarea')
    textArea.value = currentOutline.value
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      alert(t('transcriptions.outline.copySuccess'))
    } catch (fallbackErr) {
      console.error('降級複製也失敗:', fallbackErr)
      alert(t('transcriptions.outline.copyError'))
    }
    document.body.removeChild(textArea)
  }
}

// 複製逐字稿連結
const copyTranscriptionLink = (meetingId: string) => {
  const url = `https://r2-vtaiwan.bestian.tw/${meetingId}.txt`
  navigator.clipboard.writeText(url)
  alert(t('transcriptions.list.copyLinkSuccess'))
}

const startEditOutline = () => {
  if (!isAdmin.value) {
    alert(t('transcriptions.outline.editRequireAdmin'))
    return
  }
  console.log('startEditOutline')
  myOutline.value = currentOutline.value
  editing.value = true
}

const endEditOutline = () => {
  console.log('endEditOutline')
  editing.value = false
  // 發送POST請求到後端
  axios
    .post('https://vtaiwan-transcription-worker.bestian123.workers.dev/api/update-outline', {
      meeting_id: currentOutlineMeetingId.value,
      outline: myOutline.value,
    })
    .then(response => {
      console.log(response)
      if (response.status === 200) {
        console.log('更新大綱成功')
        currentOutline.value = myOutline.value

        // 同時更新逐字稿列表中的大綱
        const transcriptionIndex = transcriptions.value.findIndex(t => t.meeting_id === currentOutlineMeetingId.value)
        if (transcriptionIndex !== -1) {
          transcriptions.value[transcriptionIndex].outline = myOutline.value
        }

        myOutline.value = ''
      }
    })
    .catch(error => {
      console.error('更新大綱失敗:', error)
    })
}

const cancelEditOutline = () => {
  console.log('cancelEditOutline')
  editing.value = false
  myOutline.value = ''
}

// 編輯逐字稿
const toggleEditOutline = async () => {
  if (!editing.value) {
    startEditOutline()
  } else {
    endEditOutline()
  }
  // editing.value = !editing.value
}

// 下載逐字稿
const downloadTranscription = (meetingId: string) => {
  console.log(meetingId)
  const url = `https://r2-vtaiwan.bestian.tw/${meetingId}.txt`
  console.log(url)
  fetch(url, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  }).then(response => {
    response.text().then(text => {
      console.log(text)

      const link = document.createElement('a')
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
      link.target = '_blank'
      link.download = `transcript-${formatMeetingId(meetingId)}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  })
}

// 格式化會議ID (20250621 -> 2025-06-21)
const formatMeetingId = (meetingId: string): string => {
  if (meetingId.length === 8) {
    return `${meetingId.substring(0, 4)}-${meetingId.substring(4, 6)}-${meetingId.substring(6, 8)}`
  }
  return meetingId
}

// 組件掛載時載入數據
onMounted(() => {
  loadTranscriptions()
})
</script>

<style scoped>
/* 自定義樣式如果需要 */
textarea {
  border: 2px solid #000000;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;
}
</style>
