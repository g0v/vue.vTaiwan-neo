<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">逐字稿管理</h1>
        <p class="text-gray-600">管理會議逐字稿，包含查詢、下載和上傳功能</p>
      </div>

      <!-- 上傳區域 -->
      <div v-if="props.user" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">上傳逐字稿</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              選擇檔案 (.txt)
            </label>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept=".txt,.srt,.md"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            @click="uploadTranscription"
            :disabled="!selectedFile || uploading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ uploading ? '上傳中...' : '上傳逐字稿' }}
          </button>
        </div>
      </div>

      <!-- 未登入提示 -->
      <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-yellow-700">請先登入才能上傳逐字稿檔案</p>
        </div>
      </div>

      <!-- 載入狀態 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- 逐字稿列表 -->
      <div v-if="!loading && transcriptions.length > 0" class="space-y-4">
        <h2 class="text-xl font-semibold mb-4">逐字稿列表</h2>

        <div class="grid gap-4">
          <div
            v-for="transcription in transcriptions"
            :key="transcription.meeting_id"
            class="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  會議 ID: {{ transcription.meeting_id }}
                </h3>
                <p class="text-gray-600 text-sm mb-4">
                  {{ truncateText(transcription.outline, 100) }}
                </p>
              </div>

              <div class="flex space-x-2 ml-4 flex-col">
                <button
                  @click="showOutline(transcription.outline, transcription.meeting_id)"
                  class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  查看大綱
                </button>
                <button
                  @click="downloadTranscription(transcription.meeting_id)"
                  class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  下載全文
                </button>
              </div>
            </div>

            <div class="text-xs text-gray-500 mt-2">
              檔案名稱: transcript-{{ formatMeetingId(transcription.meeting_id) }}.txt
            </div>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="!loading && transcriptions.length === 0" class="text-center py-12">
        <p class="text-gray-500">目前沒有逐字稿資料</p>
      </div>
    </div>

    <!-- 大綱彈出視窗 -->
    <div
      v-if="showOutlineModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeOutlineModal"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">會議大綱 - {{ currentOutlineMeetingId }}</h3>
            <button
              @click="closeOutlineModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <pre class="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{{ currentOutline }}</pre>
        </div>

        <div class="p-6 border-t border-gray-200">
          <button
            @click="closeOutlineModal"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Transcription {
  meeting_id: string
  transcription: string
  outline: string
}

// 定義 props
const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  userData: {
    type: Object,
    default: null
  }
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

// 載入逐字稿列表
const loadTranscriptions = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch('https://vtaiwan-jaas-jwt-worker.bestian123.workers.dev/api/query-table')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    transcriptions.value = data
  } catch (err) {
    console.error('載入逐字稿失敗:', err)
    error.value = '載入逐字稿列表失敗，請稍後再試'
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
    alert('請選擇檔案')
    return
  }

  const meetingId = extractMeetingIdFromFilename(selectedFile.value.name)
  if (!meetingId) {
    alert('檔案名稱格式不正確，請使用 transcript-YYYY-MM-DD.txt 格式')
    return
  }

    // 檢查是否已存在
  if (checkMeetingExists(meetingId)) {
    if (!isAdmin.value) {
      alert('此會議逐字稿已存在，需要管理員權限才能更新')
      return
    }

    if (!window.confirm(`會議 ${meetingId} 的逐字稿已存在，確定要更新嗎？`)) {
      return
    }
  }

  try {
    uploading.value = true

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await fetch('https://vtaiwan-jaas-jwt-worker.bestian123.workers.dev/api/upload-transcription', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`上傳失敗: ${response.status}`)
    }

    alert('逐字稿上傳成功！')

    // 重新載入列表
    await loadTranscriptions()

    // 清除檔案選擇
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

  } catch (err) {
    console.error('上傳失敗:', err)
    alert('上傳失敗，請稍後再試')
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

// 截斷文字
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

// 組件掛載時載入數據
onMounted(() => {
  loadTranscriptions()
})
</script>

<style scoped>
/* 自定義樣式如果需要 */
</style>
