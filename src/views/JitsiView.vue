<template>
  <div class="flex h-screen w-full">
    <!-- 視訊會議區域 -->
    <div
      :class="[
        'transition-all duration-300',
        // 寬螢幕：視訊佔 62%，逐字稿佔 38%
        showTranscript && !isMobile ? 'w-[62%]' : 'w-full',
      ]"
    >
      <!-- 加入會議按鈕 -->
      <div v-if="!hasJoined" class="flex h-full items-center justify-center bg-gray-100">
        <div class="text-center">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">vTaiwan 視訊會議</h2>
          <p class="mb-6 text-gray-600">準備加入會議室：{{ room }}</p>

          <!-- 可以自訂加入會議的名字，預設為 userData.name -->
          <input v-model="joinMeetingName" class="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-jade-green" placeholder="請輸入您的名字" />

          <!-- 加入會議按鈕 -->
          <button @click="joinMeeting" class="rounded-lg bg-jade-green px-6 py-3 text-white transition-colors hover:bg-jade-green/90">加入會議</button>

          <br />
          <!-- Google 登入 -->
          <p v-if="!userData || !userData.uid" class="text-sm text-gray-600">如欲加入會議並啟用完整逐字稿功能，請先登入</p>
        </div>
      </div>

      <!-- Jitsi Meet 容器 -->
      <div v-show="hasJoined" ref="jitsiContainer" class="w-full" style="height: calc(100% - 50px)" :key="jitsiKey"></div>
    </div>

    <!-- 寬螢幕逐字稿面板 -->
    <div v-if="showTranscript && !isMobile" class="h-full w-[62%] md:w-[38%]">
      <TranscriptPanel
        @close="hideTranscript"
        :user-data="userData"
        :transcript-data="transcriptData"
        :is-recorder="isRecorder"
        :selected-date="selectedDate"
        @add-data="addTranscriptData"
        @update-data="updateTranscriptData"
        @delete-data="deleteTranscriptData"
        @i-am-recorder="toggleRecorder"
        @date-change="onDateChange"
      />
    </div>

    <!-- 窄螢幕抽屜式逐字稿面板 -->
    <div
      v-if="isMobile"
      :class="['fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out', showTranscript ? 'translate-x-0' : 'translate-x-full']"
      :style="{ width: drawerWidth + 'px' }"
    >
      <div class="h-full bg-white shadow-xl">
        <!-- 拖拽手柄 -->
        <div
          class="absolute left-0 top-1/2 flex h-16 w-4 -translate-x-4 -translate-y-1/2 transform cursor-col-resize items-center justify-center rounded-l-lg bg-gray-300 transition hover:bg-gray-400"
          @mousedown="startDragging"
          @touchstart="startDragging"
        >
          <div class="h-8 w-1 rounded bg-gray-500"></div>
        </div>

        <TranscriptPanel
          @close="hideTranscript"
          :user-data="userData"
          :transcript-data="transcriptData"
          :is-recorder="isRecorder"
          :selected-date="selectedDate"
          @add-data="addTranscriptData"
          @update-data="updateTranscriptData"
          @delete-data="deleteTranscriptData"
          @i-am-recorder="toggleRecorder"
          @date-change="onDateChange"
        />
      </div>
    </div>

    <!-- 遮罩層（窄螢幕時） -->
    <div v-if="isMobile && showTranscript" class="fixed inset-0 z-40 bg-black bg-opacity-50" @click="hideTranscript"></div>

    <!-- 音訊設定模態框 -->
    <div v-if="showAudioSettings" class="audio-settings-modal fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4" @click="hideAudioSettings">
      <div class="mx-2 max-h-[90vh] w-[95vw] max-w-md overflow-y-auto rounded-lg bg-white shadow-xl" @click.stop>
        <div class="p-4 sm:p-1">
          <div class="mb-4 flex items-center justify-between sm:mb-1">
            <h3 class="text-lg font-bold text-gray-800 sm:text-lg">{{ $t('transcript.audioSettings') }}</h3>
            <button @click="hideAudioSettings" class="p-1 text-gray-400 transition-colors hover:text-gray-600">
              <IconWrapper name="x" :size="20" class="sm:h-6 sm:w-6" />
            </button>
          </div>

          <!-- 音訊源選擇 -->
          <div class="mb-6">
            <label class="mb-3 block text-sm font-medium text-gray-700">
              {{ $t('transcript.selectAudioSource') }}
            </label>

            <div v-if="audioDevices.length === 0" class="mb-4 text-sm text-gray-500">
              {{ $t('transcript.loadingAudioDevices') }}
            </div>

            <div v-else class="space-y-2 sm:space-y-0">
              <div
                v-for="device in audioDevices"
                :key="device.deviceId"
                class="rounded-lg border transition-colors"
                :class="selectedAudioDeviceId === device.deviceId ? 'border-democratic-red bg-democratic-red/5' : 'border-gray-200 hover:border-gray-300'"
              >
                <!-- 設備選擇區域 -->
                <div class="flex cursor-pointer items-center p-4 sm:p-1" @click="selectAudioDevice(device.deviceId)">
                  <div class="mr-3 flex-shrink-0">
                    <div class="flex h-4 w-4 items-center justify-center rounded-full border-2" :class="selectedAudioDeviceId === device.deviceId ? 'border-democratic-red' : 'border-gray-300'">
                      <div v-if="selectedAudioDeviceId === device.deviceId" class="h-2 w-2 rounded-full bg-democratic-red"></div>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-800">{{ device.label || $t('transcript.unknownDevice') }}</div>
                    <div class="text-xs text-gray-500">{{ device.deviceId.length > 10 ? device.deviceId.slice(0, 10) + '...' : device.deviceId }}</div>
                  </div>
                </div>

                <!-- 音量直條（僅在測試該設備時顯示） -->
                <div v-if="isTestingAudio && selectedAudioDeviceId == device.deviceId" class="px-4 pb-4 sm:px-3 sm:pb-3">
                  <div class="mb-2 text-xs text-gray-600">{{ $t('transcript.audioLevel') }}</div>
                  <div class="flex h-12 items-end space-x-1">
                    <div
                      v-for="(level, index) in audioLevels"
                      :key="index"
                      class="flex-1 rounded-t transition-all duration-100"
                      :style="{
                        height: Math.max(2, level * 500) + '%',
                        backgroundColor:
                          level > 0.1
                            ? `rgb(${Math.floor(34 + level * 200)}, ${Math.floor(197 + level * 58)}, ${Math.floor(94 + level * 161)})`
                            : `rgb(${Math.floor(156 + level * 50)}, ${Math.floor(163 + level * 50)}, ${Math.floor(175 + level * 50)})`,
                      }"
                    ></div>
                  </div>
                  <div class="mt-1 text-center text-xs text-gray-500">
                    {{ $t('transcript.speakToTest') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 轉錄語言選擇 -->
          <div class="mb-6">
            <label class="mb-3 block text-sm font-medium text-gray-700">
              {{ $t('transcript.selectTranscriptionLanguage') || '轉錄語言' }}
            </label>
            <TranscriptLanguageSwitcher v-model="transcriptionLanguage" />
          </div>

          <!-- 測試按鈕 -->
          <div class="mb-6 sm:mb-4">
            <button
              @click="isTestingAudio ? stopAudioTest() : testAudioDevice()"
              :disabled="!selectedAudioDeviceId"
              class="w-full rounded-lg px-4 py-3 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:py-2"
              :class="isTestingAudio ? 'bg-red-500 hover:bg-red-600' : 'bg-jade-green hover:bg-jade-green/90'"
            >
              <span v-if="isTestingAudio">{{ $t('transcript.stopTest') }}</span>
              <span v-else>{{ $t('transcript.testAudioDevice') }}</span>
            </button>
          </div>

          <!-- 儲存按鈕 -->
          <div class="flex space-x-3">
            <button @click="saveAudioSettings" class="flex-1 rounded-lg bg-democratic-red px-4 py-3 text-white transition-colors hover:bg-democratic-red/90 sm:py-2">
              {{ $t('common.save') }}
            </button>
            <button @click="hideAudioSettings" class="flex-1 rounded-lg bg-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-400 sm:py-2">
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 浮動按鈕組 -->
    <div class="fixed bottom-16 right-6 z-50 flex flex-col space-y-3">
      <!-- 手機版音訊設定按鈕（獨立按鈕） -->
      <div class="relative">
        <button
          v-if="isMobile && userData && userData.uid"
          @click="toggleAudioSettings"
          class="flex items-center justify-center rounded-full border border-gray-300 bg-white p-4 text-gray-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:text-gray-800"
          :title="$t('transcript.audioSettings')"
        >
          <IconWrapper name="settings" :size="24" />
          <!-- 轉錄語言國旗（手機版：音訊設定按鈕右下角） -->
          <div v-if="isMobile" class="z-15 absolute -right-1 top-10 flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm shadow-sm" :title="`轉錄語言: ${transcriptionLanguage}`">
            {{ transcriptionLanguageFlag }}
          </div>
        </button>
      </div>

      <!-- 音訊轉錄按鈕 -->
      <div class="relative">
        <button
          v-if="userData && userData.uid"
          @click="toggleAudioRecording"
          :class="[
            'relative rounded-full p-4 shadow-lg transition-all duration-300',
            isRecordingAudio ? 'animate-pulse bg-red-500 text-white hover:bg-red-600' : 'bg-purple-500 text-white hover:bg-purple-600',
          ]"
          :title="isRecordingAudio ? `停止錄音轉錄 (${recordingTimeLeft}秒)${isTranscripting ? ' - 轉錄中，音檔將排隊處理' : ''}` : '開始錄音轉錄 (Push to Start, Push to Stop)'"
        >
          <IconWrapper :name="isRecordingAudio ? 'square' : 'mic'" :size="24" />
          <!-- 倒計時顯示 -->
          <div v-if="isRecordingAudio" class="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-500 bg-white text-xs font-bold text-red-500">
            {{ recordingTimeLeft }}
          </div>
          <!-- "轉錄中，請稍候..." 顯示 -->
          <div
            v-if="isTranscripting"
            class="absolute -bottom-2 right-2 flex h-6 w-36 -translate-x-1/2 transform items-center justify-center rounded-full border-2 border-red-500 bg-white text-xs font-bold text-red-500"
          >
            轉錄中，請稍候...
          </div>
        </button>

        <!-- 錄音者顯示 -->
        <div
          v-if="meetingData.recordingSpeaker && !isTranscripting"
          class="absolute -bottom-2 -right-10 flex h-6 w-48 items-center justify-center rounded-full border-2 border-red-500 bg-white text-xs font-bold text-red-500"
        >
          {{ meetingData.recordingSpeaker }} 錄音中，已錄 {{ recordingDuration }} 秒
        </div>

        <!-- 排隊狀態顯示 -->
        <div
          v-if="audioQueue.length > 0 && !meetingData.recordingSpeaker"
          class="absolute -bottom-2 -right-10 flex items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500 px-3 py-1 text-xs font-bold text-white"
        >
          📋 {{ audioQueue.length }} 個音檔排隊中
        </div>

        <!-- 桌面版音訊設定小按鈕（僅在非手機時顯示） -->
        <button
          v-if="!isMobile && userData && userData.uid"
          @click="toggleAudioSettings"
          class="audio-settings-button absolute -right-1 -top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-gray-50 hover:text-gray-700"
          :title="$t('transcript.audioSettings')"
        >
          <IconWrapper name="chevron-up" :size="14" />
          <!-- 轉錄語言國旗（桌面版：音訊設定按鈕右下角） -->
          <div v-if="!isMobile" class="z-15 absolute -right-1 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm shadow-sm" :title="`轉錄語言: ${transcriptionLanguage}`">
            {{ transcriptionLanguageFlag }}
          </div>
        </button>
      </div>

      <!-- 逐字稿切換按鈕 -->
      <button
        v-if="userData && userData.uid"
        @click="toggleTranscript"
        :class="[
          'rounded-full p-4 shadow-lg transition-all duration-300',
          showTranscript ? 'bg-democratic-red text-white hover:bg-democratic-red/90' : 'bg-jade-green text-white hover:bg-jade-green/90',
        ]"
        :title="showTranscript ? $t('transcript.hideTranscript') : $t('transcript.showTranscript')"
      >
        <IconWrapper :name="showTranscript ? 'x' : 'file-text'" :size="24" />
      </button>
    </div>

    <!-- 加入後提示橫幅：教導點黑色區域再按左下角圖示（可關閉） -->
    <div v-if="hasJoined && showJitsiTipBanner" class="fixed left-1/2 top-4 z-[9999] max-w-[92vw] -translate-x-1/2 md:max-w-2xl" role="status" aria-live="polite">
      <div class="flex items-start space-x-3 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-yellow-900 shadow">
        <div class="flex-1 text-sm leading-relaxed">
          {{ $t('jitsi.tipBanner.message') }}
        </div>
        <button @click="dismissJitsiTipBanner" class="ml-2 text-yellow-900/70 transition-colors hover:text-yellow-900" :title="$t('jitsi.tipBanner.dismiss')" aria-label="close">
          <IconWrapper name="x" :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TranscriptPanel from '../components/TranscriptPanel.vue'
import IconWrapper from '../components/IconWrapper.vue'
import TranscriptLanguageSwitcher from '../components/TranscriptLanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'
import { get, onValue, ref as dbRef, set } from 'firebase/database'
import { database } from '../lib/firebase'
import { getCurrentLocale, supportedLocales } from '../i18n'

export default {
  name: 'JitsiView',
  components: {
    TranscriptPanel,
    IconWrapper,
    TranscriptLanguageSwitcher,
  },
  props: {
    userData: { type: Object, required: false, default: () => ({}) },
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      isRecorder: false,
      isTranscripting: false,
      joinMeetingName: '',
      today: '',
      selectedDate: '',
      meetingData: {
        recordingStartTime: null,
        recordingSpeaker: null,
      },
      transcriptData: {},
      firebaseUnsubscribe: null, // 用於取消 Firebase 監聽
      appId: 'vpaas-magic-cookie-7c142b7a730e4478878703f86c03d5a1', // 替換自己的 App ID
      room: 'vtaiwan',
      jwt: '',
      jitsiKey: 0, // 用於強制重新渲染組件
      jitsiApi: null, // 儲存 Jitsi API 實例
      hasJoined: false, // 是否已加入會議
      jitsiDomain: '8x8.vc', // JaaS domain

      // 逐字稿相關
      showTranscript: false,
      drawerWidth: Math.min(window.innerWidth * 0.9, 400), // 抽屜寬度
      isDragging: false,
      dragStartX: 0,
      dragStartWidth: 0,

      // 新增：轉錄緩存邏輯
      transcriptCache: {
        currentSpeaker: null, // 當前說話者
        currentSpeakerId: null, // 當前說話者ID
        currentText: '', // 當前暫存的文字內容
        lastMessageId: null, // 最後一個訊息ID
        debounceTimer: null, // 防抖計時器
        maxWaitTime: 3000, // 最長等待時間（毫秒）
        debounceDelay: 1500, // 防抖延遲時間（毫秒）
      },

      // 音訊轉錄功能
      isRecordingAudio: false, // 是否正在錄音
      audioMediaRecorder: null, // MediaRecorder 實例
      audioStream: null, // 音訊流
      audioChunks: [], // 錄音片段
      audioRecordingTimer: null, // 錄音計時器
      maxRecordingTime: 30 * 1000, // 最大錄音時間（毫秒）- 30秒
      recordingTimeLeft: 0, // 剩餘錄音時間（秒）
      countdownInterval: null, // 倒計時間隔
      transcriptionApiUrl: 'https://vtaiwan-transcription-worker.bestian123.workers.dev/api/transcription/',
      isPageVisible: true, // 頁面是否可見

      // 音檔序列排隊系統
      audioQueue: [], // 音檔排隊序列
      isProcessingQueue: false, // 是否正在處理排隊序列

      // 音訊設定相關
      showAudioSettings: false, // 是否顯示音訊設定模態框
      audioDevices: [], // 可用的音訊設備列表
      selectedAudioDeviceId: '', // 選擇的音訊設備ID
      isTestingAudio: false, // 是否正在測試音訊
      testAudioStream: null, // 測試音訊流
      audioLevels: [], // 音訊音量直條數據
      audioAnalyser: null, // 音訊分析器
      audioContext: null, // 音訊上下文
      audioSource: null, // 音訊來源
      levelUpdateInterval: null, // 音量更新間隔
      recordingTimerInterval: null, // 錄音計時器間隔
      recordingTimer: 0, // 錄音計時器（用於觸發 computed 更新）

      // 轉錄語言設定
      transcriptionLanguage: 'zh-TW', // 轉錄語言，預設為網站語言

      // Jitsi 提示橫幅
      showJitsiTipBanner: typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('vtaiwan_jitsi_tip_dismissed') !== '1' : true,
    }
  },
  computed: {
    fullRoomName() {
      return `${this.appId}/${this.room}`
    },
    isMobile() {
      return window.innerWidth < 768 // md breakpoint
    },
    transcriptionLanguageFlag() {
      const found = supportedLocales.find(l => l.code === this.transcriptionLanguage)
      return found ? found.flag : '🌐'
    },
    recordingDuration() {
      if (!this.meetingData.recordingStartTime) return 0
      // 依賴於 recordingTimer 來觸發每秒更新
      this.recordingTimer // 依賴於這個變數
      return Math.floor((new Date().getTime() - this.meetingData.recordingStartTime) / 1000)
    },
  },
  created() {
    console.log('JitsiView created')
    // 使用本地時間產生 yyyymmdd 格式
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    this.today = `${year}${month}${day}`

    // 設定預設選擇日期為今天 (YYYY-MM-DD 格式)
    this.selectedDate = `${year}-${month}-${day}`

    console.log('today', this.today)

    // 初始載入會議資料
    this.loadMeetingData()

    // this.getJwt();
  },
  mounted() {
    console.log('mounted')

    // 啟動錄音計時器，每秒更新一次以觸發 computed 重新計算
    this.recordingTimerInterval = setInterval(() => {
      // console.log('recordingTimerInterval');
      // 更新計時器變數以觸發 computed 重新計算
      this.recordingTimer = Date.now()
    }, 1000)

    // 監聽視窗大小變化
    this.joinMeetingName = (this.userData || {}).name || 'Guest'

    window.addEventListener('resize', this.handleResize)

    // 初始化轉錄語言：從 localStorage 載入或使用當前網站語言
    this.loadTranscriptionLanguage()

    // Watch 網站語言變化，自動更新轉錄語言（如果使用者沒有手動設定）
    this.$watch(
      () => getCurrentLocale(),
      newLocale => {
        const savedLanguage = localStorage.getItem('vtaiwan_transcription_language')
        // 如果使用者沒有手動設定過，則跟隨網站語言
        if (!savedLanguage) {
          this.transcriptionLanguage = newLocale
        }
      }
    )

    // 載入音訊設備和設定
    this.loadAudioDevices()
    this.loadAudioSettings()

    // 監聽設備變更
    navigator.mediaDevices.addEventListener('devicechange', this.handleDeviceChange)

    // 監聽頁面可見性變化
    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    // this.getJwt();
  },
  beforeUnmount() {
    // 清理 Jitsi API
    if (this.jitsiApi) {
      this.jitsiApi.dispose()
      this.jitsiApi = null
    }

    // 清理 Firebase 監聽器
    if (this.firebaseUnsubscribe) {
      this.firebaseUnsubscribe()
      this.firebaseUnsubscribe = null
    }

    // 清理轉錄緩存計時器
    this.clearTranscriptCache()

    // 清理音訊錄製資源
    this.cleanupAudioRecording()

    // 清理排隊序列處理
    this.stopQueueProcessing()
    this.clearAudioQueue()

    // 清理錄音計時器間隔
    if (this.recordingTimerInterval) {
      clearInterval(this.recordingTimerInterval)
      this.recordingTimerInterval = null
    }

    // 清理音訊測試資源
    this.stopAudioTest()

    // 清理拖拽事件監聽器
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDragging)
    document.removeEventListener('touchmove', this.onDrag)
    document.removeEventListener('touchend', this.stopDragging)

    // 清理視窗大小變化監聽器
    window.removeEventListener('resize', this.handleResize)

    // 清理設備變更監聽器
    navigator.mediaDevices.removeEventListener('devicechange', this.handleDeviceChange)

    // 清理頁面可見性監聽器
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  },
  watch: {
    userData: {
      handler(newVal, oldVal) {
        console.log('userData', newVal)
        this.isRecorder = this.meetingData.recorder == (this.userData || {}).uid
        this.joinMeetingName = (this.userData || {}).name || 'Guest'
        // this.getJwt();
      },
    },
    jwt(newJwt, oldJwt) {
      // 當 JWT 更新時，如果已經加入會議則重新初始化
      if (newJwt && newJwt !== oldJwt && this.hasJoined) {
        console.log('JWT updated, reinitializing Jitsi Meet')
        this.initializeJitsiMeet()
      }
    },
  },
  methods: {
    dismissJitsiTipBanner() {
      this.showJitsiTipBanner = false
      try {
        localStorage.setItem('vtaiwan_jitsi_tip_dismissed', '1')
      } catch (e) {
        // ignore storage errors
      }
    },

    async getJwt() {
      const user_id = (this.userData || {}).uid || 'Guest'

      if (user_id == 'Guest') {
        window.alert('請先登入，方可加入會議')
        return
      }

      const user_name = this.joinMeetingName

      console.log('user_name', user_name)
      console.log('user_id', user_id)
      const user_email = this.userData.email || 'guest@vtaiwan.tw'
      const isAdmin = this.userData.isAdmin || false
      // console.log('user_id', user_id);
      // console.log('user_name', user_name);
      // console.log('user_email', user_email);
      // console.log('isAdmin', isAdmin);
      const res = await fetch(
        `https://vtaiwan-jaas-jwt-worker.bestian123.workers.dev/api/jitsi-token?room=vtaiwan&user_id=${user_id}&user_name=${user_name}&user_email=${user_email}&user_moderator=${isAdmin}`
      )
      const json = await res.json()
      this.jwt = json.token
    },

    loadJitsiExternalAPI() {
      // 載入 Jitsi External API script
      if (window.JitsiMeetExternalAPI) {
        console.log('Jitsi External API already loaded')
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `https://${this.jitsiDomain}/${this.appId}/external_api.js`
        script.async = true
        script.onload = () => {
          console.log('Jitsi External API loaded')
          resolve()
        }
        script.onerror = error => {
          console.error('Failed to load Jitsi External API:', error)
          reject(error)
        }
        document.head.appendChild(script)
      })
    },

    async joinMeeting() {
      if (!this.jwt) {
        console.error('No JWT available')
        await this.getJwt()
      }

      if (!this.jwt) {
        return
      }

      try {
        // 載入 Jitsi External API
        await this.loadJitsiExternalAPI()

        // 設定已加入狀態
        this.hasJoined = true

        // 等待 DOM 更新後初始化 Jitsi Meet
        this.$nextTick(() => {
          this.initializeJitsiMeet()
        })
      } catch (error) {
        console.error('Failed to join meeting:', error)
        this.hasJoined = false
      }
    },

    initializeJitsiMeet() {
      if (!window.JitsiMeetExternalAPI || !this.jwt || !this.$refs.jitsiContainer) {
        console.log('Jitsi API not ready or missing requirements')
        return
      }

      // 清理現有的 API 實例
      if (this.jitsiApi) {
        this.jitsiApi.dispose()
        this.jitsiApi = null
      }

      const options = {
        roomName: this.fullRoomName,
        parentNode: this.$refs.jitsiContainer,
        jwt: this.jwt,
        lang: 'en', // 改為英文測試
        width: '100%',
        height: '100%',
        configOverwrite: {
          disableDeepLinking: true,
          startWithAudioMuted: true, // 預設關閉麥克風
          startWithVideoMuted: true, // 預設關閉鏡頭
          prejoinPageEnabled: false,
          // 禁用analytics以避免screen sharing時的錯誤
          analytics: {
            disabled: true,
          },
          // 禁用第三方請求
          disableThirdPartyRequests: true,
          transcription: {
            enabled: false,
            useAppLanguage: false, // 改為 false，不使用應用程式語言
            preferredLanguage: 'en-US', // 設定為英文
          },
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'closedcaptions',
            'desktop',
            'embedmeeting',
            'fullscreen',
            'fodeviceselection',
            'hangup',
            'profile',
            'chat',
            'livestreaming',
            'etherpad',
            'sharedvideo',
            'settings',
            'raisehand',
            'videoquality',
            'filmstrip',
            'invite',
            'feedback',
            'stats',
            'shortcuts',
            'tileview',
            'videobackgroundblur',
            'download',
            'help',
            'mute-everyone',
            'security',
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#474747',
          MOBILE_APP_PROMO: false,
          LANG_DETECTION: false,
          DEFAULT_LANGUAGE: 'en-US', // 以英文測試
        },
      }

      console.log('Initializing Jitsi Meet with options:', options)

      try {
        this.jitsiApi = new window.JitsiMeetExternalAPI(this.jitsiDomain, options)

        // 新增：監聽轉錄事件以便除錯
        this.jitsiApi.addEventListener('transcriptionChunkReceived', event => {
          console.log('🎯 轉錄內容接收:', event)

          // 解析 event.data
          if (event.data) {
            const data = event.data
            const language = data.language
            const participant = data.participant
            const stable = data.stable
            const messageId = data.messageID

            console.log('language', language)
            console.log('participant', participant)
            console.log('stable', stable)
            console.log('messageId', messageId)

            if (stable && this.isRecorder) {
              // 使用新的緩存邏輯處理轉錄內容
              this.handleTranscriptChunk({
                messageId: messageId,
                speakerId: participant.id,
                speakerName: participant.name,
                text: stable,
                language: language,
              })
            }
          }
        })

        // 新增：監聽會議準備完成事件
        this.jitsiApi.addEventListener('videoConferenceJoined', () => {
          console.log('✅ 已加入會議') // ，轉錄功能應該可用
          // 自動啟用字幕（2秒後）
          /* setTimeout(() => {
            console.log('🔄 自動啟用字幕...');
            this.jitsiApi.executeCommand('toggleSubtitles');
          }, 2000); */
        })

        // 監聽會議離開事件
        this.jitsiApi.addEventListener('videoConferenceLeft', this.handleMeetingLeft)
        this.jitsiApi.addEventListener('readyToClose', this.handleMeetingLeft)

        console.log('Jitsi Meet initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Jitsi Meet:', error)
        this.hasJoined = false
      }
    },

    handleMeetingLeft() {
      console.log('Meeting left, cleaning up...')

      if (this.jitsiApi) {
        this.jitsiApi.removeEventListener('videoConferenceLeft', this.handleMeetingLeft)
        this.jitsiApi.removeEventListener('readyToClose', this.handleMeetingLeft)
        this.jitsiApi.dispose()
        this.jitsiApi = null
      }

      // 清空容器
      if (this.$refs.jitsiContainer) {
        this.$refs.jitsiContainer.innerHTML = ''
      }

      // 重設狀態
      this.hasJoined = false

      console.log('Meeting cleanup completed')
    },

    // 逐字稿相關方法
    toggleRecorder() {
      this.isRecorder = !this.isRecorder
      console.log('toggleRecorder', this.isRecorder)
      if (this.isRecorder) {
        console.log('設定記錄者', (this.userData || {}).uid)
        this.meetingData.recorder = (this.userData || {}).uid
        this.updateMeetingData()
      } else {
        console.log('解除記錄者')
        this.meetingData.recorder = ''
        this.updateMeetingData()
      }
    },

    toggleTranscript() {
      console.log('toggleTranscript', this.showTranscript)
      this.showTranscript = !this.showTranscript
    },

    hideTranscript() {
      this.showTranscript = false
    },

    addTranscriptData(newEntry) {
      console.log('addTranscriptData', newEntry)
      this.transcriptData[newEntry.timestamp] = newEntry
      this.updateMeetingData()
    },

    updateTranscriptData(updatedData) {
      console.log('updateTranscriptData', updatedData)
      this.transcriptData[updatedData.timestamp] = updatedData
      this.updateMeetingData()
    },

    deleteTranscriptData(timestamp) {
      console.log('deleteTranscriptData', timestamp)
      delete this.transcriptData[timestamp]
      this.updateMeetingData()
    },

    updateMeetingData() {
      console.log('updateMeetingData', this.transcriptData)
      this.meetingData.transcripts = this.transcriptData

      // 更新記錄者
      /* set(dbRef(database, `/meetings/${this.today}/recorder`), this.meetingData.recorder).then(() => {
        console.log('Meeting data updated');
      }); */

      // 更新逐字稿
      set(dbRef(database, `/meetings/${this.today}/transcripts`), this.transcriptData).then(() => {
        console.log('Meeting data updated')
      })
    },

    handleResize() {
      // 當視窗大小改變時，如果從窄螢幕變為寬螢幕，關閉抽屜
      if (!this.isMobile && this.showTranscript) {
        // 在寬螢幕模式下，逐字稿會自動顯示為側邊欄
        this.$forceUpdate()
      }
    },

    // 拖拽相關方法
    startDragging(event) {
      this.isDragging = true
      this.dragStartX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
      this.dragStartWidth = this.drawerWidth

      // 添加事件監聽器
      if (event.type === 'mousedown') {
        document.addEventListener('mousemove', this.onDrag)
        document.addEventListener('mouseup', this.stopDragging)
      } else {
        document.addEventListener('touchmove', this.onDrag)
        document.addEventListener('touchend', this.stopDragging)
      }

      // 防止選擇文字
      event.preventDefault()
    },

    onDrag(event) {
      if (!this.isDragging) return

      const currentX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX
      const deltaX = this.dragStartX - currentX // 向左拖拽為正值
      const newWidth = Math.max(300, Math.min(window.innerWidth * 0.8, this.dragStartWidth + deltaX))

      this.drawerWidth = newWidth
    },

    stopDragging() {
      this.isDragging = false
      this.removeDragListeners()
    },

    removeDragListeners() {
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDragging)
      document.removeEventListener('touchmove', this.onDrag)
      document.removeEventListener('touchend', this.stopDragging)
    },

    // 新增：處理轉錄片段的緩存邏輯
    handleTranscriptChunk(chunk) {
      const { messageId, speakerId, speakerName, text, language } = chunk

      console.log('📝 處理轉錄片段:', { speakerId, speakerName, text })

      // 檢查是否為同一說話者
      const isSameSpeaker = this.transcriptCache.currentSpeakerId === speakerId

      if (isSameSpeaker) {
        // 同一說話者：檢查內容是否有重複或延伸
        const isTextExtension = this.isTextExtension(this.transcriptCache.currentText, text)

        if (isTextExtension) {
          // 內容是延伸，更新緩存
          console.log('🔄 內容延伸，更新緩存:', text)
          this.transcriptCache.currentText = text
          this.transcriptCache.lastMessageId = messageId

          // 重新設定防抖計時器
          this.resetTranscriptTimer()
        } else {
          // 內容不是延伸，可能是新的句子，先提交舊的再開始新的
          console.log('📤 內容不延伸，提交舊內容並開始新內容')
          this.commitTranscriptCache()
          this.startNewTranscriptCache(speakerId, speakerName, text, messageId)
        }
      } else {
        // 不同說話者：先提交舊的緩存，再開始新的
        console.log('👤 說話者更換，提交舊內容並開始新內容')
        this.commitTranscriptCache()
        this.startNewTranscriptCache(speakerId, speakerName, text, messageId)
      }
    },

    // 檢查文字是否為延伸（新文字包含舊文字且更長）
    isTextExtension(oldText, newText) {
      if (!oldText) return true
      if (newText.length <= oldText.length) return false

      // 檢查新文字是否以舊文字開頭（忽略大小寫和前後空白）
      const oldTextTrimmed = oldText.trim().toLowerCase()
      const newTextTrimmed = newText.trim().toLowerCase()

      return newTextTrimmed.startsWith(oldTextTrimmed)
    },

    // 開始新的轉錄緩存
    startNewTranscriptCache(speakerId, speakerName, text, messageId) {
      console.log('🆕 開始新轉錄緩存:', { speakerId, speakerName, text })

      this.transcriptCache.currentSpeaker = speakerName
      this.transcriptCache.currentSpeakerId = speakerId
      this.transcriptCache.currentText = text
      this.transcriptCache.lastMessageId = messageId

      // 設定防抖計時器
      this.resetTranscriptTimer()
    },

    // 重設轉錄計時器
    resetTranscriptTimer() {
      // 清除現有計時器
      if (this.transcriptCache.debounceTimer) {
        clearTimeout(this.transcriptCache.debounceTimer)
      }

      // 設定新的計時器
      this.transcriptCache.debounceTimer = setTimeout(() => {
        console.log('⏰ 計時器觸發，提交轉錄內容')
        this.commitTranscriptCache()
      }, this.transcriptCache.debounceDelay)
    },

    // 提交轉錄緩存到 Firebase
    commitTranscriptCache() {
      if (!this.transcriptCache.currentText || !this.transcriptCache.currentSpeaker) {
        console.log('❌ 沒有內容可提交')
        return
      }

      console.log('✅ 提交轉錄內容:', {
        speaker: this.transcriptCache.currentSpeaker,
        text: this.transcriptCache.currentText,
      })

      // 使用現有的 addTranscriptData 函式
      this.addTranscriptData({
        id: this.transcriptCache.lastMessageId,
        timestamp: new Date().getTime(),
        speaker: this.transcriptCache.currentSpeaker,
        text: this.transcriptCache.currentText.trim(),
      })

      // 清空緩存
      this.clearTranscriptCache()
    },

    // 清空轉錄緩存
    clearTranscriptCache() {
      if (this.transcriptCache.debounceTimer) {
        clearTimeout(this.transcriptCache.debounceTimer)
      }

      this.transcriptCache = {
        ...this.transcriptCache,
        currentSpeaker: null,
        currentSpeakerId: null,
        currentText: '',
        lastMessageId: null,
        debounceTimer: null,
      }
    },

    // 音訊轉錄相關方法
    async toggleAudioRecording() {
      if (this.isRecordingAudio) {
        await this.stopAudioRecording()
      } else {
        // 在開始錄音時請求通知權限
        console.log('🔔 開始錄音前請求通知權限...')
        await this.requestNotificationPermission()
        await this.startAudioRecording()
      }
    },

    async startAudioRecording() {
      try {
        console.log('🎤 開始音訊錄製...')

        // 如果已經在錄音，先停止現有的
        if (this.isRecordingAudio && this.audioMediaRecorder) {
          console.log('🔄 檢測到現有錄音，先停止...')
          if (this.audioMediaRecorder.state !== 'inactive') {
            this.audioMediaRecorder.stop()
          }
          this.isRecordingAudio = false
        }

        // 請求音訊權限（使用選擇的音訊設備）
        const audioConstraints = {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }

        // 如果有選擇的音訊設備，則使用該設備
        if (this.selectedAudioDeviceId) {
          audioConstraints.deviceId = { exact: this.selectedAudioDeviceId }
        }

        this.audioStream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: false,
        })

        // 清空之前的錄音片段
        this.audioChunks = []

        // 創建 MediaRecorder
        this.audioMediaRecorder = new MediaRecorder(this.audioStream, {
          mimeType: 'audio/webm;codecs=opus',
        })

        // 監聽錄音數據
        this.audioMediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data)
          }
        }

        // 監聽錄音停止
        this.audioMediaRecorder.onstop = () => {
          console.log('🎤 錄音停止，開始處理音訊...')
          this.processRecordedAudio()
        }

        // 開始錄音
        this.audioMediaRecorder.start()
        this.isRecordingAudio = true

        // 在Firebase中記錄發言者和錄音開始時間
        const currentTime = new Date().getTime()
        const speakerName = (this.userData || {}).name || '未知說話者'
        this.meetingData.recordingStartTime = currentTime
        this.meetingData.recordingSpeaker = speakerName

        // 更新錄音者
        if (this.meetingData.recordingSpeaker) {
          set(dbRef(database, `/meetings/${this.today}/recordingSpeaker`), this.meetingData.recordingSpeaker).then(() => {
            console.log('Recording speaker updated')
          })

          // 更新錄音開始時間
          this.meetingData.recordingStartTime = new Date().getTime()

          set(dbRef(database, `/meetings/${this.today}/recordingStartTime`), this.meetingData.recordingStartTime).then(() => {
            console.log('Recording start time updated')
          })
        }

        // 設置倒計時
        this.recordingTimeLeft = Math.ceil(this.maxRecordingTime / 1000) // 轉換為秒

        // 開始倒計時顯示
        this.countdownInterval = setInterval(() => {
          this.recordingTimeLeft--
          if (this.recordingTimeLeft <= 0) {
            this.recordingTimeLeft = 0
          }
        }, 1000)

        // 設置自動停止計時器
        this.audioRecordingTimer = setTimeout(() => {
          console.log('⏰ 錄音時間到達上限，停止錄音並處理音訊...')

          // 發送瀏覽器通知
          this.sendBrowserNotification('轉錄時間到', '60秒錄音完成，正在處理音訊並準備下一輪轉錄')

          // 停止錄音並處理音訊，然後自動開始下一輪
          this.stopAudioRecordingForNextRound()
        }, this.maxRecordingTime)

        console.log(`✅ 音訊錄製已開始（最多 ${this.maxRecordingTime / 1000} 秒）`)
      } catch (error) {
        console.error('❌ 無法開始音訊錄製:', error)
        alert('無法開始錄音，請檢查麥克風權限')
      }
    },

    async stopAudioRecording() {
      // 在Firebase中移除發言者和錄音開始時間
      console.log('🔄 手動停止：移除發言者和錄音開始時間')
      this.meetingData.recordingStartTime = null
      this.meetingData.recordingSpeaker = null
      set(dbRef(database, `/meetings/${this.today}/recordingStartTime`), null).then(() => {
        console.log('Recording start time updated')
      })
      set(dbRef(database, `/meetings/${this.today}/recordingSpeaker`), null).then(() => {
        console.log('Recording speaker updated')
      })
      this.recordingTimer = 0

      try {
        console.log('⏹️ 手動停止音訊錄製...')

        // 清除計時器
        if (this.audioRecordingTimer) {
          clearTimeout(this.audioRecordingTimer)
          this.audioRecordingTimer = null
        }

        // 清除倒計時間隔
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval)
          this.countdownInterval = null
        }

        // 停止錄音
        if (this.audioMediaRecorder && this.audioMediaRecorder.state !== 'inactive') {
          this.audioMediaRecorder.stop()
        }

        this.isRecordingAudio = false
        this.recordingTimeLeft = 0

        // 清理音訊資源（手動停止時）
        this.cleanupAudioRecording()

        console.log('✅ 音訊錄製已手動停止')
      } catch (error) {
        console.error('❌ 停止錄音時發生錯誤:', error)
      }
    },

    async processRecordedAudio() {
      try {
        if (this.audioChunks.length === 0) {
          console.log('❌ 沒有錄音數據')
          return
        }

        // 創建音訊 Blob
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
        console.log('📁 音訊文件大小:', (audioBlob.size / 1024).toFixed(2), 'KB')

        // 清空錄音片段，準備下一輪錄音
        this.audioChunks = []

        // 將音檔加入排隊序列
        const audioItem = {
          id: Date.now(),
          blob: audioBlob,
          timestamp: new Date().toISOString(),
          size: audioBlob.size,
        }

        this.audioQueue.push(audioItem)
        console.log(`📋 音檔已加入排隊序列，當前排隊數量: ${this.audioQueue.length}`)

        // 檢查是否為自動重啟模式
        if (this.meetingData.recordingSpeaker) {
          console.log('🔄 自動重啟模式，立即重啟錄音')
          // 立即開始下一輪錄音
          this.startNextRecordingRound()
        }

        // 開始處理排隊序列（如果還沒開始的話）
        this.startQueueProcessing()
      } catch (error) {
        console.error('❌ 處理錄音時發生錯誤:', error)
        // 即使出錯，如果是自動重啟模式也要嘗試下一輪
        if (this.meetingData.recordingSpeaker) {
          setTimeout(() => {
            this.startNextRecordingRound()
          }, 1000)
        }
      }
    },

    async sendAudioToTranscription(audioBlob) {
      try {
        console.log('📤 發送音訊到轉錄服務...')

        // 創建 FormData
        const formData = new FormData()
        formData.append('file', audioBlob, 'recording.webm')

        // 構建轉錄 API URL，包含語言參數
        const transcriptionUrl = `${this.transcriptionApiUrl}${this.transcriptionLanguage}`
        console.log('🌐 轉錄語言:', this.transcriptionLanguage)
        console.log('🔗 轉錄 API URL:', transcriptionUrl)

        // 發送到後端
        const response = await fetch(transcriptionUrl, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          // 檢查是否為 AI 幻覺回應（422 狀態碼）
          if (response.status === 422) {
            const errorData = await response.json().catch(() => ({}))
            console.log('🔇 音檔音量過低，AI 產生幻覺回應:', errorData.message || '音檔音量過低')
            // 422 狀態碼不顯示 alert，只記錄日誌，避免影響用戶體驗
            return
          }

          // 其他錯誤狀態碼
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.text()
        console.log('✅ 轉錄結果:', result)

        // 如果有轉錄文字，也可以加入到逐字稿中
        if (result) {
          const speakerName = (this.userData || {}).name || '未知說話者'
          this.addTranscriptData({
            id: 'audio_' + Date.now(),
            timestamp: Date.now(),
            speaker: speakerName,
            text: result,
          })
        }
      } catch (error) {
        console.error('❌ 轉錄請求失敗:', error)
        alert('轉錄服務暫時無法使用，請稍後再試')
        throw error // 重新拋出錯誤，讓調用者處理
      }
    },

    cleanupAudioRecording() {
      console.log('🧹 清理音訊錄製資源...')

      // 清除所有計時器
      if (this.audioRecordingTimer) {
        clearTimeout(this.audioRecordingTimer)
        this.audioRecordingTimer = null
      }

      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
        this.countdownInterval = null
      }

      // 停止音訊流
      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => {
          track.stop()
        })
        this.audioStream = null
      }

      // 清理 MediaRecorder
      if (this.audioMediaRecorder) {
        this.audioMediaRecorder = null
      }

      // 清空錄音片段
      this.audioChunks = []

      // 重設狀態
      this.isRecordingAudio = false
      this.recordingTimeLeft = 0

      console.log('🧹 音訊錄製資源已清理完成')
    },

    // 音訊設定相關方法
    async loadAudioDevices() {
      try {
        console.log('🔍 載入音訊設備...')

        // 先請求權限以獲取設備列表
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop()) // 立即停止流

        // 獲取音訊設備列表
        const devices = await navigator.mediaDevices.enumerateDevices()
        this.audioDevices = devices.filter(device => device.kind === 'audioinput')

        console.log('✅ 音訊設備載入完成:', this.audioDevices.length, '個設備')
      } catch (error) {
        console.error('❌ 載入音訊設備失敗:', error)
        this.audioDevices = []
      }
    },

    loadAudioSettings() {
      try {
        const savedDeviceId = localStorage.getItem('vtaiwan_selected_audio_device')
        if (savedDeviceId) {
          this.selectedAudioDeviceId = savedDeviceId
          console.log('✅ 載入已儲存的音訊設備設定:', savedDeviceId)
        }
      } catch (error) {
        console.error('❌ 載入音訊設定失敗:', error)
      }
    },

    saveAudioSettings() {
      try {
        localStorage.setItem('vtaiwan_selected_audio_device', this.selectedAudioDeviceId)
        localStorage.setItem('vtaiwan_transcription_language', this.transcriptionLanguage)
        console.log('✅ 音訊設定已儲存:', this.selectedAudioDeviceId)
        console.log('✅ 轉錄語言已儲存:', this.transcriptionLanguage)
        this.hideAudioSettings()
      } catch (error) {
        console.error('❌ 儲存音訊設定失敗:', error)
      }
    },

    loadTranscriptionLanguage() {
      try {
        const savedLanguage = localStorage.getItem('vtaiwan_transcription_language')
        if (savedLanguage) {
          this.transcriptionLanguage = savedLanguage
          console.log('✅ 載入已儲存的轉錄語言設定:', savedLanguage)
        } else {
          // 如果沒有儲存的設定，使用當前網站語言
          this.transcriptionLanguage = getCurrentLocale()
          console.log('✅ 使用當前網站語言作為轉錄語言:', this.transcriptionLanguage)
        }
      } catch (error) {
        console.error('❌ 載入轉錄語言設定失敗:', error)
        // 預設使用當前網站語言
        this.transcriptionLanguage = getCurrentLocale()
      }
    },

    selectAudioDevice(deviceId) {
      this.selectedAudioDeviceId = deviceId
      console.log('📱 選擇音訊設備:', deviceId)
    },

    async testAudioDevice() {
      if (!this.selectedAudioDeviceId) return

      try {
        this.isTestingAudio = true
        console.log('🎵 測試音訊設備...')

        // 初始化音訊音量直條
        this.audioLevels = Array(20).fill(0)

        // 創建測試音訊流
        this.testAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: this.selectedAudioDeviceId },
            echoCancellation: true,
            noiseSuppression: true,
          },
        })

        // 創建 Web Audio API 上下文
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

        // 如果音訊上下文被暫停，需要恢復
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume()
        }

        this.audioSource = this.audioContext.createMediaStreamSource(this.testAudioStream)
        this.audioAnalyser = this.audioContext.createAnalyser()

        // 設定分析器參數
        this.audioAnalyser.fftSize = 256
        this.audioAnalyser.smoothingTimeConstant = 0.8

        // 連接音訊節點 - 分析器需要連接到目標節點才能工作
        this.audioSource.connect(this.audioAnalyser)
        this.audioAnalyser.connect(this.audioContext.destination)

        // 開始音量監控
        this.startAudioLevelMonitoring()

        console.log('✅ 音訊測試已開始，請對著麥克風說話')
      } catch (error) {
        console.error('❌ 音訊測試失敗:', error)
        this.isTestingAudio = false
        alert('音訊測試失敗，請檢查設備權限')
      }
    },

    startAudioLevelMonitoring() {
      const bufferLength = this.audioAnalyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateLevels = () => {
        if (!this.isTestingAudio) return

        // 使用時域數據來檢測音量
        this.audioAnalyser.getByteTimeDomainData(dataArray)

        // 計算 RMS (Root Mean Square) 音量
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          const value = (dataArray[i] - 128) / 128 // 轉換為 -1 到 1
          sum += value * value
        }
        const rms = Math.sqrt(sum / bufferLength)
        const normalizedLevel = Math.min(1, rms * 3) // 放大音量並限制在 0-1

        // 添加調試信息
        if (normalizedLevel > 0.05) {
          console.log('🎤 檢測到音訊輸入，音量:', normalizedLevel.toFixed(3))
        }

        // 更新音量直條（創建更真實的視覺效果）
        this.audioLevels = this.audioLevels.map((level, index) => {
          // 創建波浪效果，讓每個直條有不同的頻率
          const waveFactor = Math.sin(Date.now() * 0.005 + index * 0.2) * 0.05

          // 根據音量大小調整波浪幅度
          const amplitude = normalizedLevel * 0.3
          const newLevel = Math.max(0, Math.min(1, normalizedLevel + waveFactor + amplitude))

          // 平滑過渡
          const smoothedLevel = level * 0.8 + newLevel * 0.2

          return smoothedLevel
        })

        this.levelUpdateInterval = requestAnimationFrame(updateLevels)
      }

      updateLevels()
    },

    stopAudioTest() {
      this.isTestingAudio = false

      // 停止音量監控
      if (this.levelUpdateInterval) {
        cancelAnimationFrame(this.levelUpdateInterval)
        this.levelUpdateInterval = null
      }

      // 清理音訊資源
      if (this.audioSource) {
        this.audioSource.disconnect()
        this.audioSource = null
      }

      if (this.audioAnalyser) {
        this.audioAnalyser = null
      }

      if (this.audioContext) {
        this.audioContext.close()
        this.audioContext = null
      }

      // 停止音訊流
      if (this.testAudioStream) {
        this.testAudioStream.getTracks().forEach(track => track.stop())
        this.testAudioStream = null
      }

      // 清空音量直條
      this.audioLevels = []

      console.log('✅ 音訊測試完成')
    },

    toggleAudioSettings() {
      this.showAudioSettings = !this.showAudioSettings
      if (this.showAudioSettings) {
        // 重新載入設備列表（以防有新設備連接）
        this.loadAudioDevices()
      }
    },

    hideAudioSettings() {
      this.showAudioSettings = false
      // 停止音訊測試
      this.stopAudioTest()
    },

    handleDeviceChange() {
      console.log('🔌 檢測到設備變更，重新載入設備列表...')
      this.loadAudioDevices()
    },

    onDateChange(newDate) {
      console.log('Date changed to:', newDate)

      // 將 YYYY-MM-DD 格式轉換為 yyyymmdd 格式
      const dateParts = newDate.split('-')
      this.today = dateParts[0] + dateParts[1] + dateParts[2]

      console.log('Converted date format:', this.today)

      // 當日期變更時，重新載入 meetingData 和 transcriptData
      this.loadMeetingData()
    },

    async loadMeetingData() {
      try {
        // 先取消現有的 Firebase 監聽
        if (this.firebaseUnsubscribe) {
          this.firebaseUnsubscribe()
          this.firebaseUnsubscribe = null
        }

        // 檢查會議資料是否存在
        const snapshot = await get(dbRef(database, `/meetings/${this.today}`))
        if (snapshot.exists()) {
          console.log('Meeting data exists for', this.today)
        } else {
          console.log('Meeting data not found for', this.today, 'creating new one')
          // 如果 meeting 不存在，則建立一個新的 meeting
          await set(dbRef(database, `/meetings/${this.today}`), {
            recorder: '',
            transcripts: {},
          })
        }

        // 設定新的 Firebase 監聽
        this.firebaseUnsubscribe = onValue(dbRef(database, `/meetings/${this.today}`), snapshot => {
          if (snapshot.exists()) {
            this.meetingData = snapshot.val()
            console.log('Meeting data updated for', this.today, this.meetingData)
            this.transcriptData = (this.meetingData || {}).transcripts || {}
            this.isRecorder = this.meetingData.recorder == (this.userData || {}).uid
            console.log('Transcript data updated:', this.transcriptData)
          } else {
            this.meetingData = { recorder: '', transcripts: {} }
            this.transcriptData = {}
            this.isRecorder = false
          }
        })
      } catch (error) {
        console.error('Error loading meeting data:', error)
      }
    },

    handleVisibilityChange() {
      const wasVisible = this.isPageVisible
      this.isPageVisible = !document.hidden
      console.log('Page visibility changed:', this.isPageVisible)

      // 當頁面從可見變為不可見，且正在錄音時，發送通知
      if (wasVisible && !this.isPageVisible && this.isRecordingAudio) {
        console.log('📱 頁面離開焦點，發送自動轉錄模式通知')
        this.sendBrowserNotification('模式已切換為自動持續轉錄模式', '當您切換回此頁面時，轉錄將停止自動循環')
      }
    },

    // 請求瀏覽器通知權限
    async requestNotificationPermission() {
      if ('Notification' in window) {
        console.log('🔔 當前通知權限:', Notification.permission)
        console.log('🔔 瀏覽器支援通知:', 'Notification' in window)

        if (Notification.permission === 'default') {
          console.log('🔔 請求通知權限...')
          const permission = await Notification.requestPermission()
          console.log('🔔 通知權限結果:', permission)
          return permission === 'granted'
        } else if (Notification.permission === 'granted') {
          console.log('🔔 已有通知權限')
          return true
        } else {
          console.log('🔔 通知權限被拒絕:', Notification.permission)
          return false
        }
      }
      console.log('❌ 瀏覽器不支援通知功能')
      return false
    },

    // 停止錄音並處理音訊，然後自動開始下一輪
    async stopAudioRecordingForNextRound() {
      try {
        console.log('🔄 停止錄音並處理音訊，準備下一輪...')

        // 清除計時器
        if (this.audioRecordingTimer) {
          clearTimeout(this.audioRecordingTimer)
          this.audioRecordingTimer = null
        }

        if (this.countdownInterval) {
          clearInterval(this.countdownInterval)
          this.countdownInterval = null
        }

        // 停止錄音
        if (this.audioMediaRecorder && this.audioMediaRecorder.state !== 'inactive') {
          this.audioMediaRecorder.stop()
        }

        this.isRecordingAudio = false
        this.recordingTimeLeft = 0

        // 等待錄音停止事件觸發，然後在 processRecordedAudio 中自動開始下一輪
        console.log('⏳ 等待音訊處理完成...')
      } catch (error) {
        console.error('❌ 停止錄音準備下一輪時發生錯誤:', error)
        // 如果出錯，嘗試直接開始下一輪
        setTimeout(() => {
          this.startNextRecordingRound()
        }, 1000)
      }
    },

    // 自動開始下一輪錄音
    async startNextRecordingRound() {
      try {
        console.log('🔄 自動開始下一輪錄音...')

        // 清空錄音片段
        this.audioChunks = []

        // 重新開始錄音
        await this.startAudioRecording()

        console.log('✅ 下一輪錄音已開始')
      } catch (error) {
        console.error('❌ 自動開始下一輪錄音失敗:', error)
        // 如果自動開始失敗，發送通知提醒用戶
        this.sendBrowserNotification('轉錄錯誤', '自動開始下一輪錄音失敗，請手動重新開始')
      }
    },

    // 開始處理排隊序列
    startQueueProcessing() {
      if (this.isProcessingQueue || this.audioQueue.length === 0) {
        return
      }

      console.log('🚀 開始處理音檔排隊序列...')
      this.isProcessingQueue = true

      // 立即處理第一個音檔
      this.processNextAudioInQueue()
    },

    // 處理排隊序列中的下一個音檔
    async processNextAudioInQueue() {
      if (this.audioQueue.length === 0) {
        console.log('✅ 排隊序列處理完成')
        this.stopQueueProcessing()
        return
      }

      // 取出排隊序列中的第一個音檔
      const audioItem = this.audioQueue.shift()
      console.log(`📤 處理排隊音檔 ${audioItem.id}，剩餘 ${this.audioQueue.length} 個`)

      try {
        // 設定轉錄狀態
        this.isTranscripting = true

        // 發送音檔到後端轉錄
        await this.sendAudioToTranscription(audioItem.blob)

        console.log(`✅ 音檔 ${audioItem.id} 轉錄完成`)

        // 轉錄完成後，檢查是否還有排隊的音檔，如果有則繼續處理
        if (this.audioQueue.length > 0) {
          console.log(`🔄 還有 ${this.audioQueue.length} 個音檔在排隊，繼續處理...`)
          // 使用 nextTick 確保狀態更新完成後再處理下一個
          this.$nextTick(() => {
            this.processNextAudioInQueue()
          })
        } else {
          // 沒有更多音檔，完成處理
          console.log('✅ 所有音檔處理完成')
          this.stopQueueProcessing()
        }
      } catch (error) {
        console.error(`❌ 音檔 ${audioItem.id} 轉錄失敗:`, error)

        // 即使轉錄失敗，也要繼續處理下一個音檔（如果有的話）
        if (this.audioQueue.length > 0) {
          console.log(`🔄 轉錄失敗，但還有 ${this.audioQueue.length} 個音檔在排隊，繼續處理...`)
          this.$nextTick(() => {
            this.processNextAudioInQueue()
          })
        } else {
          this.stopQueueProcessing()
        }
      } finally {
        // 轉錄完成，更新狀態
        this.isTranscripting = false
      }
    },

    // 停止排隊序列處理
    stopQueueProcessing() {
      this.isProcessingQueue = false
      console.log('🛑 排隊序列處理已停止')
    },

    // 清空排隊序列
    clearAudioQueue() {
      this.audioQueue = []
      console.log('🗑️ 音檔排隊序列已清空')
    },

    // 發送瀏覽器通知
    async sendBrowserNotification(title, body) {
      try {
        console.log('📢 準備發送通知:', title, body)
        console.log('📢 當前頁面可見性:', this.isPageVisible)

        const hasPermission = await this.requestNotificationPermission()
        console.log('📢 通知權限檢查結果:', hasPermission)

        if (hasPermission) {
          console.log('📢 創建通知對象...')

          // 使用最簡單的通知設定（與手動測試相同）
          const notification = new Notification(title, {
            body: body,
          })

          console.log('📢 通知對象創建成功:', notification)

          // 添加通知事件監聽
          notification.onclick = () => {
            console.log('📢 通知被點擊')
            window.focus() // 聚焦到視窗
          }

          notification.onshow = () => {
            console.log('📢 通知已顯示')
          }

          notification.onerror = error => {
            console.error('📢 通知錯誤:', error)
          }

          notification.onclose = () => {
            console.log('📢 通知已關閉')
          }

          console.log('📢 瀏覽器通知已發送:', title)
        } else {
          console.log('❌ 沒有通知權限，無法發送通知')
        }
      } catch (error) {
        console.error('❌ 發送通知失敗:', error)
        console.error('❌ 錯誤詳情:', error.message)
        console.error('❌ 錯誤堆疊:', error.stack)
      }
    },
  },
}
</script>

<style scoped>
/* 確保 Jitsi 容器填滿父容器（減去 50px） */
.jitsi-container {
  width: 100% !important;
  height: calc(100vh - 50px) !important;
}

/* Jitsi iframe 樣式 */
:deep(iframe) {
  width: 100% !important;
  height: calc(100vh - 80px) !important;
  border: none;
}

/* 拖拽時的樣式 */
.cursor-col-resize {
  cursor: col-resize;
}

/* 防止拖拽時選擇文字 */
.dragging {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 浮動按鈕動畫 */
.fixed.bottom-6.right-6 {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fixed.bottom-6.right-6:hover {
  transform: scale(1.05);
}

/* 音訊設定小按鈕樣式 */
.audio-settings-button {
  z-index: 60;
}

/* 手機上的音訊設定模態框優化 */
@media (max-width: 640px) {
  .audio-settings-modal {
    padding: 0.5rem;
  }

  .audio-settings-modal .bg-white {
    border-radius: 0.75rem;
  }
}

/* 抽屜陰影 */
.shadow-xl {
  box-shadow:
    -10px 0 25px -3px rgba(0, 0, 0, 0.1),
    -4px 0 10px -2px rgba(0, 0, 0, 0.05);
}

/* 響應式調整 */
@media (max-width: 768px) {
  /* 在窄螢幕上確保抽屜不會太寬 */
  .transcript-drawer {
    max-width: 90vw;
  }
}

/* 確保視訊區域在調整大小時平滑過渡 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
