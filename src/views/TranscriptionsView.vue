<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('transcriptions.title') }}</h1>
        <p class="text-gray-600">{{ $t('transcriptions.description') }}</p>
      </div>

      <!-- 上傳區域 -->
      <div v-if="props.user" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ $t('transcriptions.upload.title') }}</h2>
        <p class="text-gray-600">{{ $t('transcriptions.upload.description') }}</p>
        <div class="space-y-4">
          <div>
            <!-- <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('transcriptions.upload.selectFile') }}
            </label> -->
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
            {{ uploading ? $t('transcriptions.upload.uploading') : $t('transcriptions.upload.uploadButton') }}
          </button>
        </div>
      </div>

      <!-- 未登入提示 -->
      <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-yellow-700">{{ $t('transcriptions.upload.loginRequired') }}</p>
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
        <h2 class="text-xl font-semibold mb-4">{{ $t('transcriptions.list.title') }}</h2>

        <input type="text" v-model="search" placeholder="Search..." class="w-full p-2 border border-gray-300 rounded-md mb-4" />

        <div class="gap-4 flex flex-col-reverse">
          <div
            v-for="transcription in transcriptions.filter(t => t.meeting_id.includes(search) || t.outline.includes(search))"
            :key="transcription.meeting_id"
            class="bg-white rounded-lg shadow-md p-6 border border-gray-200 relative"
          >
            <!-- 樣稿標籤 -->
            <div v-if="transcription.meeting_id === '20250621'" class="absolute -top-2 -right-2 z-10">
              <div class="bg-yellow-400 text-black text-xs font-bold px-3 py-1 transform rotate-12 shadow-md">
                {{ currentLanguage === 'zh-TW' ? '樣稿' : 'Prototype' }}
              </div>
            </div>

            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ $t('transcriptions.list.meetingId') }}: {{ transcription.meeting_id }}
                </h3>
                <div class="text-gray-600 text-sm mb-4">
                  <img src="@/assets/CC0.png" alt="CC0.png" class="w-auto h-8">
                  <div v-html="getRenderedOutlinePreview(transcription.outline)" class="prose prose-sm max-w-none"></div>
                </div>
              </div>

              <div class="flex space-y-4 ml-4 flex-col">
                <button
                  @click="showOutline(transcription.outline, transcription.meeting_id)"
                  class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  {{ $t('transcriptions.list.viewOutline') }}
                </button>
                <button
                  @click="$router.push(`/transcription_detail/${transcription.meeting_id}`)"
                  class="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                >
                  {{ $t('transcriptions.list.viewDetail') }}
                </button>
                <button
                  @click="downloadTranscription(transcription.meeting_id)"
                  class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  {{ $t('transcriptions.list.download') }}
                </button>

                <!-- 複製逐字稿連結 -->
                <button
                  @click="copyTranscriptionLink(transcription.meeting_id)"
                  class="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                >
                  {{ $t('transcriptions.list.copyLink') }}
                </button>
              </div>
            </div>

            <div class="text-xs text-gray-500 mt-2">
              {{ $t('transcriptions.list.fileName') }}: transcript-{{ formatMeetingId(transcription.meeting_id) }}.txt
            </div>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="!loading && transcriptions.length === 0" class="text-center py-12">
        <p class="text-gray-500">{{ $t('transcriptions.list.empty') }}</p>
      </div>
    </div>

    <!-- 大綱彈出視窗 -->
    <div
      v-if="showOutlineModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeOutlineModal"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full max-h-[80vh]  overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">{{ $t('transcriptions.outline.title') }} - {{ currentOutlineMeetingId }}</h3>
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
          <div class="flex items-center mb-4">
            <img src="@/assets/CC0.png" alt="CC0.png" class="w-auto h-8">
          </div>
          <div id="renderedOutline" v-if="!editing" v-html="renderedOutline" class="prose prose-sm max-w-none"></div>
          <textarea
            name="" id="" class="w-full h-full min-h-[200px] max-h-[60vh]" v-else v-model="myOutline">
          </textarea>
		    <!-- <span>{{ myOutline }}</span> -->
        </div>

        <div class="p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <button
            @click="copyOutline"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>{{ $t('transcriptions.outline.copy') }}</span>
          </button>
		      <button
            v-if="userData && (userData.uid)"
            @click="toggleEditOutline"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <!-- edit icon -->
            <svg v-if="!editing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <!-- save icon -->
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v14h14V5H5zm4 0v4h6V5H9zm0 6v6h6v-6H9z"></path>
            </svg>
            <span v-if="!editing">{{ $t('transcriptions.outline.edit') }}</span>
			      <span v-else>{{ $t('transcriptions.outline.saveAndEndEdit') }}</span>
          </button>
          <button v-if="editing"
            @click="cancelEditOutline"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {{ $t('transcriptions.outline.cancel') }}
          </button>
          <button
            @click="closeOutlineModal"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            {{ $t('transcriptions.outline.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import axios from 'axios'
import { marked } from 'marked'

interface Transcription {
  meeting_id: string
  transcription: string
  outline: string
}

const { locale, t } = useI18n()
useHead({
  title: t('transcriptions.title') + ' | vTaiwan'
})

// 當前語言
const currentLanguage = computed(() => locale.value)

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

// 渲染 Markdown 內容
const renderedOutline = computed(() => {
  if (!currentOutline.value) return ''
  return marked(currentOutline.value)
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
    return marked(truncated)
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
      body: formData
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
  axios.post('https://vtaiwan-transcription-worker.bestian123.workers.dev/api/update-outline', {
    meeting_id: currentOutlineMeetingId.value,
    outline: myOutline.value
  }).then(response => {
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
  }).catch(error => {
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
