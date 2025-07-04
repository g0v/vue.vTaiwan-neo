<template>
  <div class="transcript-panel h-full flex flex-col bg-white border-l border-gray-200">
    <!-- 標題列 -->
    <div class="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ $t('transcript.title') }}
            <span class="text-sm text-gray-600">{{ $t('transcript.subtitle') }}</span>
          </h3>
        </div>

        <button
          @click="$emit('close')"
          class="md:hidden p-2 hover:bg-gray-200 rounded-lg transition"
          :title="$t('transcript.hideTranscript')"
        >
          <IconWrapper name="x" :size="20" />
        </button>
      </div>

      <!-- 控制按鈕 -->
      <div class="flex items-center gap-2 flex-wrap">

        <!-- <button
          @click="iAmRecorder"
          :class="[
            'px-3 py-1 text-xs rounded-full transition',
            isRecorder
              ? 'bg-jade-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ $t('transcript.iAmRecorder') }}
        </button> -->

        <button
          @click="toggleAutoScroll"
          :class="[
            'px-3 py-1 text-xs rounded-full transition',
            autoScroll
              ? 'bg-jade-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ $t('transcript.autoScroll') }}
        </button>

        <select
          v-model="fontSize"
          class="px-2 py-1 text-xs border border-gray-300 rounded"
        >
          <option value="small">{{ $t('transcript.fontSizeSmall') }}</option>
          <option value="medium">{{ $t('transcript.fontSizeMedium') }}</option>
          <option value="large">{{ $t('transcript.fontSizeLarge') }}</option>
        </select>

        <button
          @click="exportTranscript"
          class="px-3 py-1 text-xs bg-jade-green text-white rounded hover:bg-jade-green/90 transition"
        >
          {{ $t('transcript.exportTranscript') }}
        </button>
      </div>
    </div>

    <!-- 逐字稿內容 -->
    <div
      ref="transcriptContent"
      class="flex-shrink-0 overflow-y-auto p-4 space-y-2 max-h-[50vh]"
      :class="fontSizeClass"
    >
      <div v-if="Object.keys(transcriptData).length === 0" class="text-center text-gray-500 py-8">
        <IconWrapper name="file-text" :size="48" class="mx-auto mb-4 text-gray-300" />
        <p>{{ $t('transcript.noContent') }}</p>
      </div>

      <div
        v-for="(entry, index) in Object.values(transcriptData)"
        :key="entry.timestamp"
        class="transcript-entry border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition"
      >
        <div class="flex items-start justify-start md:justify-between mb-2">
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>{{ formatTimestamp(entry.timestamp) }}</span>
            <span v-if="entry.speaker" class="font-medium">{{ entry.speaker }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="editEntry(index)"
              class="p-1 hover:bg-gray-100 rounded transition"
              :title="$t('transcript.edit')"
            >
              <IconWrapper name="edit" :size="14" />
            </button>
            <button
              @click="deleteEntry(index)"
              class="p-1 hover:bg-red-100 text-red-600 rounded transition"
              :title="$t('transcript.deleteEntry')"
            >
              <IconWrapper name="trash" :size="14" />
            </button>
          </div>
        </div>

        <div v-if="editingIndex === index" class="space-y-2">
          <input
            v-model="editingEntry.speaker"
            :placeholder="$t('transcript.speaker')"
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
          <textarea
            v-model="editingEntry.text"
            :placeholder="$t('transcript.content')"
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none"
            rows="3"
          ></textarea>
          <div class="flex gap-2">
            <button
              @click="saveEntry"
              class="px-3 py-1 text-xs bg-jade-green text-white rounded hover:bg-jade-green/90 transition"
            >
              {{ $t('transcript.save') }}
            </button>
            <button
              @click="cancelEdit"
              class="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              {{ $t('transcript.cancel') }}
            </button>
          </div>
        </div>

        <div v-else class="text-gray-900 whitespace-pre-wrap" style="word-break: break-all;">{{ entry.text }}</div>
      </div>
    </div>

    <!-- 中部區塊，可以手動輸入逐字稿 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <textarea
        v-model="manualTranscript"
        class="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none"
        rows="3"
        :placeholder="$t('transcript.manualTranscript')"
      ></textarea>
      <div class="flex gap-2">
        <button
          @click="addManualTranscript"
          class="px-3 py-1 text-xs bg-jade-green text-white rounded hover:bg-jade-green/90 transition"
        > {{ $t('transcript.addManualTranscript') }}
        </button>
      </div>
    </div>

    <!-- 底部狀態列 -->
    <div class="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>{{ Object.keys(transcriptData).length }} 條記錄</span>
        <div class="flex items-center gap-2">
          <div :class="[
            'w-2 h-2 rounded-full',
            isConnected ? 'bg-jade-green' : 'bg-red-500'
          ]"></div>
          <span>{{ isConnected ? '已連接' : $t('transcript.disconnected') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from './IconWrapper.vue'

const { t } = useI18n()

// Props
const props = defineProps({
  userData: {
    type: Object,
    default: () => ({})
  },
  transcriptData: {
    type: Object,
    default: () => ({})
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isRecorder: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'add-data', 'i-am-recorder'])

// 響應式數據
const transcriptData = computed(() => props.transcriptData || {})

const autoScroll = ref(true)
const fontSize = ref('medium')
const isConnected = ref(true)
const editingIndex = ref(-1)
const editingEntry = ref({ speaker: '', text: '' })
const transcriptContent = ref(null)
const manualTranscript = ref('')

watch(transcriptData, () => {
  if (autoScroll.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
})

// 計算屬性
const fontSizeClass = computed(() => {
  switch (fontSize.value) {
    case 'small': return 'text-sm'
    case 'large': return 'text-lg'
    default: return 'text-base'
  }
})

// 方法
const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 滾動到底部
const scrollToBottom = () => {
  if (transcriptContent.value) {
    transcriptContent.value.scrollTop = transcriptContent.value.scrollHeight
  }
}

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value
}

const addNewData = () => {
  const timestamp = Date.now();
  const newData = {
    speaker: '',
    text: '',
    timestamp
  };
  emit('add-data', newData);
}

const addManualTranscript = () => {
  const timestamp = Date.now();
  const newData = {
    speaker: props.userData.name || 'Guest',
    text: manualTranscript.value,
    timestamp
  };
  emit('add-data', newData);
  manualTranscript.value = ''
}

const editEntry = (index) => {
  editingIndex.value = index
  editingEntry.value = {
    speaker: Object.values(transcriptData.value)[index].speaker,
    text: Object.values(transcriptData.value)[index].text
  }
}

const saveEntry = () => {
  if (editingIndex.value >= 0) {
    const updatedData = {
      ...Object.values(transcriptData.value)[editingIndex.value],
      speaker: editingEntry.value.speaker,
      text: editingEntry.value.text
    }
    emit('update-data', updatedData)
    cancelEdit()
  }
}

const cancelEdit = () => {
  editingIndex.value = -1
  editingEntry.value = { speaker: '', text: '' }
}

const deleteEntry = (index) => {
  if (confirm(t('transcript.confirmClear'))) {
    emit('delete-data', Object.values(transcriptData.value)[index].timestamp)
  }
}

const exportTranscript = () => {
  const content = Object.values(transcriptData.value).map(entry => {
    const time = formatTimestamp(entry.timestamp)
    const speaker = entry.speaker ? `${entry.speaker}: ` : ''
    return `[${time}] ${speaker}${entry.text}`
  }).join('\n\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const iAmRecorder = () => {
  emit('i-am-recorder')
}

// 模擬即時逐字稿更新（實際使用時會替換為 WebSocket 或其他即時通訊）
const simulateRealTimeUpdate = () => {
  const sampleTexts = [
    '這是一個很重要的議題，我們需要仔細討論。',
    '我同意剛才的發言，但是我想補充一些觀點。',
    '從技術角度來看，這個提案是可行的。',
    '我們需要考慮到實施的成本和效益。',
    '這個政策對於民眾的影響是什麼？'
  ]

  const speakers = ['主持人', '與會者A', '與會者B', '與會者C', '專家']

  setInterval(() => {
    if (Math.random() > 0.7) { // 30% 機率添加新內容
      const newEntry = {
        id: Date.now(),
        timestamp: new Date(),
        speaker: speakers[Math.floor(Math.random() * speakers.length)],
        text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
      }
      emit('add-data', newEntry)
    }
  }, 5000) // 每5秒檢查一次
}

// 組件掛載時開始模擬
// simulateRealTimeUpdate() // 取消註解以啟用模擬數據
</script>

<style scoped>
.transcript-panel {
  min-height: 0; /* 確保 flex 子元素可以正確縮放 */
}

.transcript-entry {
  transition: all 0.2s ease;
}

.transcript-entry:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 自定義滾動條 */
.transcript-panel ::-webkit-scrollbar {
  width: 6px;
}

.transcript-panel ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.transcript-panel ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.transcript-panel ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
