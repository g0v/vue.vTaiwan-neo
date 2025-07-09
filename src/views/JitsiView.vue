<template>
  <div class="w-full h-screen flex">
    <!-- 視訊會議區域 -->
    <div
      :class="[
        'transition-all duration-300',
        // 寬螢幕：視訊佔 62%，逐字稿佔 38%
        showTranscript && !isMobile ? 'w-[62%]' : 'w-full'
      ]"
    >
      <!-- 加入會議按鈕 -->
      <div
        v-if="!hasJoined"
        class="flex items-center justify-center h-full bg-gray-100"
      >
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">vTaiwan 視訊會議</h2>
          <p class="text-gray-600 mb-6">準備加入會議室：{{ room }}</p>

          <!-- 可以自訂加入會議的名字，預設為 userData.name -->
          <input
            v-model="joinMeetingName"
            class="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-green"
            placeholder="請輸入您的名字"
          />

          <!-- 加入會議按鈕 -->
          <button
            @click="joinMeeting"
            class="px-6 py-3 bg-jade-green text-white rounded-lg hover:bg-jade-green/90 transition-colors"
          >
            加入會議
          </button>

          <br/>
          <!-- Google 登入 -->
          <p v-if="!userData || !userData.uid" class="text-gray-600 text-sm">
            如欲啟用完整逐字稿功能，請先登入
          </p>

        </div>
      </div>

      <!-- Jitsi Meet 容器 -->
      <div
        v-show="hasJoined"
        ref="jitsiContainer"
        class="w-full"
        style="height: calc(100% - 50px);"
        :key="jitsiKey"
      ></div>
    </div>

    <!-- 寬螢幕逐字稿面板 -->
    <div
      v-if="showTranscript && !isMobile"
      class="w-[62%] md:w-[38%] h-full"
    >
      <TranscriptPanel
          @close="hideTranscript"
          :user-data="userData" :transcript-data="transcriptData"
          :is-recorder="isRecorder"
          @add-data="addTranscriptData"
          @update-data="updateTranscriptData"
          @delete-data="deleteTranscriptData"
          @i-am-recorder="toggleRecorder" />
    </div>

    <!-- 窄螢幕抽屜式逐字稿面板 -->
    <div
      v-if="isMobile"
      :class="[
        'fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out',
        showTranscript ? 'translate-x-0' : 'translate-x-full'
      ]"
      :style="{ width: drawerWidth + 'px' }"
    >
      <div class="h-full bg-white shadow-xl">
        <!-- 拖拽手柄 -->
        <div
          class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-4 h-16 bg-gray-300 rounded-l-lg cursor-col-resize flex items-center justify-center hover:bg-gray-400 transition"
          @mousedown="startDragging"
          @touchstart="startDragging"
        >
          <div class="w-1 h-8 bg-gray-500 rounded"></div>
        </div>

        <TranscriptPanel
          @close="hideTranscript"
          :user-data="userData" :transcript-data="transcriptData"
          :is-recorder="isRecorder"
          @add-data="addTranscriptData"
          @update-data="updateTranscriptData"
          @delete-data="deleteTranscriptData"
          @i-am-recorder="toggleRecorder" />
      </div>
    </div>

    <!-- 遮罩層（窄螢幕時） -->
    <div
      v-if="isMobile && showTranscript"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="hideTranscript"
    ></div>

    <!-- 音訊設定模態框 -->
    <div
      v-if="showAudioSettings"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 audio-settings-modal"
      @click="hideAudioSettings"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-[95vw] max-w-md max-h-[90vh] overflow-y-auto mx-2"
        @click.stop
      >
        <div class="p-4 sm:p-3">
          <div class="flex items-center justify-between mb-4 sm:mb-1">
            <h3 class="text-lg sm:text-xl font-bold text-gray-800">{{ $t('transcript.audioSettings') }}</h3>
            <button
              @click="hideAudioSettings"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <IconWrapper name="x" :size="20" class="sm:w-6 sm:h-6" />
            </button>
          </div>

          <!-- 音訊源選擇 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              {{ $t('transcript.selectAudioSource') }}
            </label>

            <div v-if="audioDevices.length === 0" class="text-gray-500 text-sm mb-4">
              {{ $t('transcript.loadingAudioDevices') }}
            </div>

            <div v-else class="space-y-2 sm:space-y-0">
              <div
                v-for="device in audioDevices"
                :key="device.deviceId"
                class="border rounded-lg transition-colors"
                :class="selectedAudioDeviceId === device.deviceId ? 'border-democratic-red bg-democratic-red/5' : 'border-gray-200 hover:border-gray-300'"
              >
                <!-- 設備選擇區域 -->
                <div
                  class="flex items-center p-4 sm:p-3 cursor-pointer"
                  @click="selectAudioDevice(device.deviceId)"
                >
                  <div class="flex-shrink-0 mr-3">
                    <div
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      :class="selectedAudioDeviceId === device.deviceId ? 'border-democratic-red' : 'border-gray-300'"
                    >
                      <div
                        v-if="selectedAudioDeviceId === device.deviceId"
                        class="w-2 h-2 rounded-full bg-democratic-red"
                      ></div>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-800">{{ device.label || $t('transcript.unknownDevice') }}</div>
                    <div class="text-xs text-gray-500">{{ device.deviceId.length > 10 ? device.deviceId.slice(0, 10) + '...' : device.deviceId }}</div>
                  </div>
                </div>

                <!-- 音量直條（僅在測試該設備時顯示） -->
                <div
                  v-if="isTestingAudio && selectedAudioDeviceId == device.deviceId"
                  class="px-4 sm:px-3 pb-4 sm:pb-3"
                >
                  <div class="text-xs text-gray-600 mb-2">{{ $t('transcript.audioLevel') }}</div>
                  <div class="flex items-end space-x-1 h-12">
                    <div
                      v-for="(level, index) in audioLevels"
                      :key="index"
                      class="flex-1 rounded-t transition-all duration-100"
                      :style="{
                        height: Math.max(2, level * 500) + '%',
                        backgroundColor: level > 0.1 ?
                          `rgb(${Math.floor(34 + level * 200)}, ${Math.floor(197 + level * 58)}, ${Math.floor(94 + level * 161)})` :
                          `rgb(${Math.floor(156 + level * 50)}, ${Math.floor(163 + level * 50)}, ${Math.floor(175 + level * 50)})`
                      }"
                    ></div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1 text-center">
                    {{ $t('transcript.speakToTest') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 測試按鈕 -->
          <div class="mb-6 sm:mb-4">
            <button
              @click="isTestingAudio ? stopAudioTest() : testAudioDevice()"
              :disabled="!selectedAudioDeviceId"
              class="w-full px-4 py-3 sm:py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :class="isTestingAudio ? 'bg-red-500 hover:bg-red-600' : 'bg-jade-green hover:bg-jade-green/90'"
            >
              <span v-if="isTestingAudio">{{ $t('transcript.stopTest') }}</span>
              <span v-else>{{ $t('transcript.testAudioDevice') }}</span>
            </button>
          </div>

          <!-- 儲存按鈕 -->
          <div class="flex space-x-3">
            <button
              @click="saveAudioSettings"
              class="flex-1 px-4 py-3 sm:py-2 bg-democratic-red text-white rounded-lg hover:bg-democratic-red/90 transition-colors"
            >
              {{ $t('common.save') }}
            </button>
            <button
              @click="hideAudioSettings"
              class="flex-1 px-4 py-3 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 浮動按鈕組 -->
    <div class="fixed bottom-16 right-6 z-50 flex flex-col space-y-3">
      <!-- 手機版音訊設定按鈕（獨立按鈕） -->
      <button
        v-if="isMobile && userData && userData.uid"
        @click="toggleAudioSettings"
        class="p-4 rounded-full shadow-lg transition-all duration-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-300 flex items-center justify-center hover:scale-105"
        :title="$t('transcript.audioSettings')"
      >
        <IconWrapper name="settings" :size="24" />
      </button>

      <!-- 音訊轉錄按鈕 -->
      <div class="relative">
        <button
          v-if="userData && userData.uid"
          @click="toggleAudioRecording"
          :class="[
            'p-4 rounded-full shadow-lg transition-all duration-300 relative',
            isRecordingAudio
              ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          ]"
          :title="isRecordingAudio ? `停止錄音轉錄 (${recordingTimeLeft}秒)` : '開始錄音轉錄 (最多120秒)'"
        >
          <IconWrapper
            :name="isRecordingAudio ? 'square' : 'mic'"
            :size="24"
          />
          <!-- 倒計時顯示 -->
          <div
            v-if="isRecordingAudio"
            class="absolute -top-2 -left-2 bg-white text-red-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-red-500"
          >
            {{ recordingTimeLeft }}
          </div>
          <!-- "轉錄中，請稍候..." 顯示 -->
          <div
            v-if="isTranscripting"
            class="absolute -bottom-2 right-12 transform -translate-x-1/2 bg-white text-red-500 text-xs font-bold rounded-full w-36 h-6 flex items-center justify-center border-2 border-red-500"
          >
            轉錄中，請稍候...
          </div>
        </button>

        <!-- 桌面版音訊設定小按鈕（僅在非手機時顯示） -->
        <button
          v-if="!isMobile && userData && userData.uid"
          @click="toggleAudioSettings"
          class="absolute -top-1 -right-1 w-7 h-7 rounded-full shadow-lg transition-all duration-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-gray-300 flex items-center justify-center hover:scale-110 audio-settings-button z-10"
          :title="$t('transcript.audioSettings')"
        >
          <IconWrapper name="chevron-up" :size="14" />
        </button>
      </div>

      <!-- 逐字稿切換按鈕 -->
      <button
        v-if="userData && userData.uid"
        @click="toggleTranscript"
        :class="[
          'p-4 rounded-full shadow-lg transition-all duration-300',
          showTranscript
            ? 'bg-democratic-red text-white hover:bg-democratic-red/90'
            : 'bg-jade-green text-white hover:bg-jade-green/90'
        ]"
        :title="showTranscript ? $t('transcript.hideTranscript') : $t('transcript.showTranscript')"
      >
        <IconWrapper
          :name="showTranscript ? 'x' : 'file-text'"
          :size="24"
        />
      </button>
    </div>
  </div>
</template>

<script>
import TranscriptPanel from '../components/TranscriptPanel.vue';
import IconWrapper from '../components/IconWrapper.vue';
import { useI18n } from 'vue-i18n';
import { get, onValue, ref as dbRef, set } from 'firebase/database';
import { database } from '../lib/firebase';

export default {
  name: 'JitsiView',
  components: {
    TranscriptPanel,
    IconWrapper
  },
  props: {
    userData: { type: Object, required: false, default: () => ({}) }
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      isTranscripting: false,
      joinMeetingName: '',
      today: '',
      meetingData: {},
      transcriptData: {},
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
        currentSpeaker: null,        // 當前說話者
        currentSpeakerId: null,      // 當前說話者ID
        currentText: '',             // 當前暫存的文字內容
        lastMessageId: null,         // 最後一個訊息ID
        debounceTimer: null,         // 防抖計時器
        maxWaitTime: 3000,           // 最長等待時間（毫秒）
        debounceDelay: 1500          // 防抖延遲時間（毫秒）
      },

      // 音訊轉錄功能
      isRecordingAudio: false,       // 是否正在錄音
      audioMediaRecorder: null,      // MediaRecorder 實例
      audioStream: null,             // 音訊流
      audioChunks: [],               // 錄音片段
      audioRecordingTimer: null,     // 錄音計時器
      maxRecordingTime: 120000,       // 最大錄音時間（毫秒）- 120秒
      recordingTimeLeft: 0,          // 剩餘錄音時間（秒）
      countdownInterval: null,       // 倒計時間隔
      transcriptionApiUrl: 'https://vtaiwan-transcription-worker.bestian123.workers.dev/api/transcription/',

      // 音訊設定相關
      showAudioSettings: false,      // 是否顯示音訊設定模態框
      audioDevices: [],              // 可用的音訊設備列表
      selectedAudioDeviceId: '',     // 選擇的音訊設備ID
      isTestingAudio: false,         // 是否正在測試音訊
      testAudioStream: null,         // 測試音訊流
      audioLevels: [],               // 音訊音量直條數據
      audioAnalyser: null,           // 音訊分析器
      audioContext: null,            // 音訊上下文
      audioSource: null,             // 音訊來源
      levelUpdateInterval: null,     // 音量更新間隔
    };
  },
  computed: {
    fullRoomName() { return `${this.appId}/${this.room}`; },
    isMobile() {
      return window.innerWidth < 768; // md breakpoint
    }
  },
  created() {
    console.log('JitsiView created');
    // 使用本地時間產生 yyyymmdd 格式
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    this.today = `${year}${month}${day}`;

    console.log('today', this.today);

    // 測試能否取得 meetingData
    get(dbRef(database, `/meetings/${this.today}`)).then((snapshot) => {
      console.log('meeting exists', snapshot.exists());
      if (snapshot.exists()) {
        console.log('meetingData', snapshot.val());
      } else {
        console.log('meeting does not exist');
        // 如果 meeting 不存在，則建立一個新的 meeting
        set(dbRef(database, `/meetings/${this.today}`), {
          recorder: '',
          transcripts: {}
        });
      }
    });

    onValue(dbRef(database, `/meetings/${this.today}`), (snapshot) => {
      if (snapshot.exists()) {
        this.meetingData = snapshot.val();
        console.log('meetingData', this.meetingData);
        this.transcriptData = (this.meetingData || {}).transcripts || {};
        this.isRecorder = this.meetingData.recorder == (this.userData || {}).uid;
        console.log('transcriptData', this.transcriptData);
      }
    });

    // this.getJwt();
  },
  async mounted() {
    console.log('mounted');
    // this.getJwt();
  },
  beforeUnmount() {
    // 清理 Jitsi API
    if (this.jitsiApi) {
      this.jitsiApi.dispose();
      this.jitsiApi = null;
    }

    // 清理轉錄緩存計時器
    this.clearTranscriptCache();

    // 清理音訊錄製資源
    this.cleanupAudioRecording();

    // 清理音訊測試資源
    this.stopAudioTest();

    // 清理拖拽事件監聽器
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDragging);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.stopDragging);

    // 清理視窗大小變化監聽器
    window.removeEventListener('resize', this.handleResize);

    // 清理設備變更監聽器
    navigator.mediaDevices.removeEventListener('devicechange', this.handleDeviceChange);
  },
  mounted() {
    // 監聽視窗大小變化
    this.joinMeetingName = (this.userData || {}).name || 'Guest' + Math.floor(Math.random() * 1000000);

    window.addEventListener('resize', this.handleResize);

    // 載入音訊設備和設定
    this.loadAudioDevices();
    this.loadAudioSettings();

    // 監聽設備變更
    navigator.mediaDevices.addEventListener('devicechange', this.handleDeviceChange);
  },
  watch: {
    userData: {
      handler(newVal, oldVal) {
        console.log('userData', newVal);
        this.isRecorder = this.meetingData.recorder == (this.userData || {}).uid;
        this.joinMeetingName = (this.userData || {}).name || 'Guest' + Math.floor(Math.random() * 1000000);
        // this.getJwt();
      },
    },
    jwt(newJwt, oldJwt) {
      // 當 JWT 更新時，如果已經加入會議則重新初始化
      if (newJwt && newJwt !== oldJwt && this.hasJoined) {
        console.log('JWT updated, reinitializing Jitsi Meet');
        this.initializeJitsiMeet();
      }
    }
  },
  methods: {

    async getJwt() {
      const user_id = (this.userData || {}).uid || 'guest' + Math.floor(Math.random() * 1000000);
      const user_name = this.joinMeetingName;

      console.log('user_name', user_name);
      console.log('user_id', user_id);
      const user_email = this.userData.email || 'guest@vtaiwan.tw';
      const isAdmin = this.userData.isAdmin || false;
      // console.log('user_id', user_id);
      // console.log('user_name', user_name);
      // console.log('user_email', user_email);
      // console.log('isAdmin', isAdmin);
      const res = await fetch(`https://vtaiwan-jaas-jwt-worker.bestian123.workers.dev/api/jitsi-token?room=vtaiwan&user_id=${user_id}&user_name=${user_name}&user_email=${user_email}&user_moderator=${isAdmin}`);
      const json = await res.json();
      this.jwt = json.token;
    },

    loadJitsiExternalAPI() {
      // 載入 Jitsi External API script
      if (window.JitsiMeetExternalAPI) {
        console.log('Jitsi External API already loaded');
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://${this.jitsiDomain}/${this.appId}/external_api.js`;
        script.async = true;
        script.onload = () => {
          console.log('Jitsi External API loaded');
          resolve();
        };
        script.onerror = (error) => {
          console.error('Failed to load Jitsi External API:', error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    },

    async joinMeeting() {
      if (!this.jwt) {
        console.error('No JWT available');
        await this.getJwt();
      }

      try {
        // 載入 Jitsi External API
        await this.loadJitsiExternalAPI();

        // 設定已加入狀態
        this.hasJoined = true;

        // 等待 DOM 更新後初始化 Jitsi Meet
        this.$nextTick(() => {
          this.initializeJitsiMeet();
        });
      } catch (error) {
        console.error('Failed to join meeting:', error);
        this.hasJoined = false;
      }
    },

    initializeJitsiMeet() {
      if (!window.JitsiMeetExternalAPI || !this.jwt || !this.$refs.jitsiContainer) {
        console.log('Jitsi API not ready or missing requirements');
        return;
      }

      // 清理現有的 API 實例
      if (this.jitsiApi) {
        this.jitsiApi.dispose();
        this.jitsiApi = null;
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
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          // 禁用analytics以避免screen sharing時的錯誤
          analytics: {
            disabled: true
          },
          // 禁用第三方請求
          disableThirdPartyRequests: true,
          transcription: {
            enabled: false,
            useAppLanguage: false, // 改為 false，不使用應用程式語言
            preferredLanguage: 'en-US' // 設定為英文
          }
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#474747',
          MOBILE_APP_PROMO: false,
          LANG_DETECTION: false,
          DEFAULT_LANGUAGE: 'en-US' // 以英文測試
        }
      };

      console.log('Initializing Jitsi Meet with options:', options);

      try {
        this.jitsiApi = new window.JitsiMeetExternalAPI(this.jitsiDomain, options);

        // 新增：監聽轉錄事件以便除錯
        this.jitsiApi.addEventListener('transcriptionChunkReceived', (event) => {
          console.log('🎯 轉錄內容接收:', event);

          // 解析 event.data
          if (event.data) {
            const data = event.data;
            const language = data.language;
            const participant = data.participant;
            const stable = data.stable;
            const messageId = data.messageID;

            console.log('language', language);
            console.log('participant', participant);
            console.log('stable', stable);
            console.log('messageId', messageId);

            if (stable && this.isRecorder) {
              // 使用新的緩存邏輯處理轉錄內容
              this.handleTranscriptChunk({
                messageId: messageId,
                speakerId: participant.id,
                speakerName: participant.name,
                text: stable,
                language: language
              });
            }
          }
        });

        // 新增：監聽會議準備完成事件
        this.jitsiApi.addEventListener('videoConferenceJoined', () => {
          console.log('✅ 已加入會議'); // ，轉錄功能應該可用
          // 自動啟用字幕（2秒後）
          /* setTimeout(() => {
            console.log('🔄 自動啟用字幕...');
            this.jitsiApi.executeCommand('toggleSubtitles');
          }, 2000); */
        });

        // 監聽會議離開事件
        this.jitsiApi.addEventListener('videoConferenceLeft', this.handleMeetingLeft);
        this.jitsiApi.addEventListener('readyToClose', this.handleMeetingLeft);

        console.log('Jitsi Meet initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Jitsi Meet:', error);
        this.hasJoined = false;
      }
    },

    handleMeetingLeft() {
      console.log('Meeting left, cleaning up...');

      if (this.jitsiApi) {
        this.jitsiApi.removeEventListener('videoConferenceLeft', this.handleMeetingLeft);
        this.jitsiApi.removeEventListener('readyToClose', this.handleMeetingLeft);
        this.jitsiApi.dispose();
        this.jitsiApi = null;
      }

      // 清空容器
      if (this.$refs.jitsiContainer) {
        this.$refs.jitsiContainer.innerHTML = '';
      }

      // 重設狀態
      this.hasJoined = false;

      console.log('Meeting cleanup completed');
    },

    // 逐字稿相關方法
    toggleRecorder() {
      this.isRecorder = !this.isRecorder;
      console.log('toggleRecorder', this.isRecorder);
      if (this.isRecorder) {
        console.log('設定記錄者', (this.userData || {}).uid);
        this.meetingData.recorder = (this.userData || {}).uid;
        this.updateMeetingData();
      } else {
        console.log('解除記錄者');
        this.meetingData.recorder = '';
        this.updateMeetingData();
      }
    },

    toggleTranscript() {
      console.log('toggleTranscript', this.showTranscript);
      this.showTranscript = !this.showTranscript;
    },

    hideTranscript() {
      this.showTranscript = false;
    },

    addTranscriptData(newEntry) {
      console.log('addTranscriptData', newEntry);
      this.transcriptData[newEntry.timestamp] = newEntry;
      this.updateMeetingData();
    },

    updateTranscriptData(updatedData) {
      console.log('updateTranscriptData', updatedData);
      this.transcriptData[updatedData.timestamp] = updatedData;
      this.updateMeetingData();
    },

    deleteTranscriptData(timestamp) {
      console.log('deleteTranscriptData', timestamp);
      delete this.transcriptData[timestamp];
      this.updateMeetingData();
    },

    updateMeetingData() {
      console.log('updateMeetingData', this.transcriptData);
      this.meetingData.transcripts = this.transcriptData;

      // 更新記錄者
      set(dbRef(database, `/meetings/${this.today}/recorder`), this.meetingData.recorder).then(() => {
        console.log('Meeting data updated');
      });

      // 更新逐字稿
      set(dbRef(database, `/meetings/${this.today}/transcripts`), this.transcriptData).then(() => {
        console.log('Meeting data updated');
      });
    },

    handleResize() {
      // 當視窗大小改變時，如果從窄螢幕變為寬螢幕，關閉抽屜
      if (!this.isMobile && this.showTranscript) {
        // 在寬螢幕模式下，逐字稿會自動顯示為側邊欄
        this.$forceUpdate();
      }
    },

    // 拖拽相關方法
    startDragging(event) {
      this.isDragging = true;
      this.dragStartX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;
      this.dragStartWidth = this.drawerWidth;

      // 添加事件監聽器
      if (event.type === 'mousedown') {
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDragging);
      } else {
        document.addEventListener('touchmove', this.onDrag);
        document.addEventListener('touchend', this.stopDragging);
      }

      // 防止選擇文字
      event.preventDefault();
    },

    onDrag(event) {
      if (!this.isDragging) return;

      const currentX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
      const deltaX = this.dragStartX - currentX; // 向左拖拽為正值
      const newWidth = Math.max(300, Math.min(window.innerWidth * 0.8, this.dragStartWidth + deltaX));

      this.drawerWidth = newWidth;
    },

    stopDragging() {
      this.isDragging = false;
      this.removeDragListeners();
    },

    removeDragListeners() {
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDragging);
      document.removeEventListener('touchmove', this.onDrag);
      document.removeEventListener('touchend', this.stopDragging);
    },

    // 新增：處理轉錄片段的緩存邏輯
    handleTranscriptChunk(chunk) {
      const { messageId, speakerId, speakerName, text, language } = chunk;

      console.log('📝 處理轉錄片段:', { speakerId, speakerName, text });

      // 檢查是否為同一說話者
      const isSameSpeaker = this.transcriptCache.currentSpeakerId === speakerId;

      if (isSameSpeaker) {
        // 同一說話者：檢查內容是否有重複或延伸
        const isTextExtension = this.isTextExtension(this.transcriptCache.currentText, text);

        if (isTextExtension) {
          // 內容是延伸，更新緩存
          console.log('🔄 內容延伸，更新緩存:', text);
          this.transcriptCache.currentText = text;
          this.transcriptCache.lastMessageId = messageId;

          // 重新設定防抖計時器
          this.resetTranscriptTimer();
        } else {
          // 內容不是延伸，可能是新的句子，先提交舊的再開始新的
          console.log('📤 內容不延伸，提交舊內容並開始新內容');
          this.commitTranscriptCache();
          this.startNewTranscriptCache(speakerId, speakerName, text, messageId);
        }
      } else {
        // 不同說話者：先提交舊的緩存，再開始新的
        console.log('👤 說話者更換，提交舊內容並開始新內容');
        this.commitTranscriptCache();
        this.startNewTranscriptCache(speakerId, speakerName, text, messageId);
      }
    },

    // 檢查文字是否為延伸（新文字包含舊文字且更長）
    isTextExtension(oldText, newText) {
      if (!oldText) return true;
      if (newText.length <= oldText.length) return false;

      // 檢查新文字是否以舊文字開頭（忽略大小寫和前後空白）
      const oldTextTrimmed = oldText.trim().toLowerCase();
      const newTextTrimmed = newText.trim().toLowerCase();

      return newTextTrimmed.startsWith(oldTextTrimmed);
    },

    // 開始新的轉錄緩存
    startNewTranscriptCache(speakerId, speakerName, text, messageId) {
      console.log('🆕 開始新轉錄緩存:', { speakerId, speakerName, text });

      this.transcriptCache.currentSpeaker = speakerName;
      this.transcriptCache.currentSpeakerId = speakerId;
      this.transcriptCache.currentText = text;
      this.transcriptCache.lastMessageId = messageId;

      // 設定防抖計時器
      this.resetTranscriptTimer();
    },

    // 重設轉錄計時器
    resetTranscriptTimer() {
      // 清除現有計時器
      if (this.transcriptCache.debounceTimer) {
        clearTimeout(this.transcriptCache.debounceTimer);
      }

      // 設定新的計時器
      this.transcriptCache.debounceTimer = setTimeout(() => {
        console.log('⏰ 計時器觸發，提交轉錄內容');
        this.commitTranscriptCache();
      }, this.transcriptCache.debounceDelay);
    },

    // 提交轉錄緩存到 Firebase
    commitTranscriptCache() {
      if (!this.transcriptCache.currentText || !this.transcriptCache.currentSpeaker) {
        console.log('❌ 沒有內容可提交');
        return;
      }

      console.log('✅ 提交轉錄內容:', {
        speaker: this.transcriptCache.currentSpeaker,
        text: this.transcriptCache.currentText
      });

      // 使用現有的 addTranscriptData 函式
      this.addTranscriptData({
        id: this.transcriptCache.lastMessageId,
        timestamp: new Date().getTime(),
        speaker: this.transcriptCache.currentSpeaker,
        text: this.transcriptCache.currentText.trim()
      });

      // 清空緩存
      this.clearTranscriptCache();
    },

    // 清空轉錄緩存
    clearTranscriptCache() {
      if (this.transcriptCache.debounceTimer) {
        clearTimeout(this.transcriptCache.debounceTimer);
      }

      this.transcriptCache = {
        ...this.transcriptCache,
        currentSpeaker: null,
        currentSpeakerId: null,
        currentText: '',
        lastMessageId: null,
        debounceTimer: null
      };
    },

    // 音訊轉錄相關方法
    async toggleAudioRecording() {
      if (this.isRecordingAudio) {
        await this.stopAudioRecording();
      } else {
        await this.startAudioRecording();
      }
    },

        async startAudioRecording() {
      try {
        console.log('🎤 開始音訊錄製...');

        // 請求音訊權限（使用選擇的音訊設備）
        const audioConstraints = {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        };

        // 如果有選擇的音訊設備，則使用該設備
        if (this.selectedAudioDeviceId) {
          audioConstraints.deviceId = { exact: this.selectedAudioDeviceId };
        }

        this.audioStream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: false
        });

        // 清空之前的錄音片段
        this.audioChunks = [];

        // 創建 MediaRecorder
        this.audioMediaRecorder = new MediaRecorder(this.audioStream, {
          mimeType: 'audio/webm;codecs=opus'
        });

        // 監聽錄音數據
        this.audioMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        // 監聽錄音停止
        this.audioMediaRecorder.onstop = () => {
          console.log('🎤 錄音停止，開始處理音訊...');
          this.processRecordedAudio();
        };

        // 開始錄音
        this.audioMediaRecorder.start();
        this.isRecordingAudio = true;

        // 設置倒計時
        this.recordingTimeLeft = Math.ceil(this.maxRecordingTime / 1000); // 轉換為秒

        // 開始倒計時顯示
        this.countdownInterval = setInterval(() => {
          this.recordingTimeLeft--;
          if (this.recordingTimeLeft <= 0) {
            this.recordingTimeLeft = 0;
          }
        }, 1000);

        // 設置自動停止計時器
        this.audioRecordingTimer = setTimeout(() => {
          console.log('⏰ 錄音時間到達上限，自動停止...');
          this.stopAudioRecording();
        }, this.maxRecordingTime);

        console.log(`✅ 音訊錄製已開始（最多 ${this.maxRecordingTime / 1000} 秒）`);
      } catch (error) {
        console.error('❌ 無法開始音訊錄製:', error);
        alert('無法開始錄音，請檢查麥克風權限');
      }
    },

        async stopAudioRecording() {
      try {
        console.log('⏹️ 停止音訊錄製...');

        // 清除計時器
        if (this.audioRecordingTimer) {
          clearTimeout(this.audioRecordingTimer);
          this.audioRecordingTimer = null;
        }

        // 清除倒計時間隔
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
        }

        // 停止錄音
        if (this.audioMediaRecorder && this.audioMediaRecorder.state !== 'inactive') {
          this.audioMediaRecorder.stop();
        }

        this.isRecordingAudio = false;
        this.recordingTimeLeft = 0;

        console.log('✅ 音訊錄製已停止');
      } catch (error) {
        console.error('❌ 停止錄音時發生錯誤:', error);
      }
    },

    async processRecordedAudio() {
      try {
        if (this.audioChunks.length === 0) {
          console.log('❌ 沒有錄音數據');
          return;
        }

        // 創建音訊 Blob
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        console.log('📁 音訊文件大小:', (audioBlob.size / 1024).toFixed(2), 'KB');

        // 發送到轉錄服務
        await this.sendAudioToTranscription(audioBlob);

        // 清理資源
        this.cleanupAudioRecording();
      } catch (error) {
        console.error('❌ 處理錄音時發生錯誤:', error);
      }
    },

    async sendAudioToTranscription(audioBlob) {
      try {
        console.log('📤 發送音訊到轉錄服務...');
        this.isTranscripting = true;

        // 創建 FormData
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');

        // 發送到後端
        const response = await fetch(this.transcriptionApiUrl, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
          this.isTranscripting = false;
        }

        const result = await response.text();
        console.log('✅ 轉錄結果:', result);

        // 如果有轉錄文字，也可以加入到逐字稿中
        if (result) {
          const speakerName = (this.userData || {}).name || '未知說話者';
          this.addTranscriptData({
            id: 'audio_' + Date.now(),
            timestamp: Date.now(),
            speaker: speakerName,
            text: result
          });
        }
        this.isTranscripting = false;
      } catch (error) {
        console.error('❌ 轉錄請求失敗:', error);
        alert('轉錄服務暫時無法使用，請稍後再試');
        this.isTranscripting = false;
      }
    },

        cleanupAudioRecording() {
      // 清除所有計時器
      if (this.audioRecordingTimer) {
        clearTimeout(this.audioRecordingTimer);
        this.audioRecordingTimer = null;
      }

      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }

      // 停止音訊流
      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => {
          track.stop();
        });
        this.audioStream = null;
      }

      // 清理 MediaRecorder
      if (this.audioMediaRecorder) {
        this.audioMediaRecorder = null;
      }

      // 清空錄音片段
      this.audioChunks = [];

      // 重設狀態
      this.isRecordingAudio = false;
      this.recordingTimeLeft = 0;

      console.log('🧹 音訊錄製資源已清理');
    },

    // 音訊設定相關方法
    async loadAudioDevices() {
      try {
        console.log('🔍 載入音訊設備...');

        // 先請求權限以獲取設備列表
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // 立即停止流

        // 獲取音訊設備列表
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.audioDevices = devices.filter(device => device.kind === 'audioinput');

        console.log('✅ 音訊設備載入完成:', this.audioDevices.length, '個設備');
      } catch (error) {
        console.error('❌ 載入音訊設備失敗:', error);
        this.audioDevices = [];
      }
    },

    loadAudioSettings() {
      try {
        const savedDeviceId = localStorage.getItem('vtaiwan_selected_audio_device');
        if (savedDeviceId) {
          this.selectedAudioDeviceId = savedDeviceId;
          console.log('✅ 載入已儲存的音訊設備設定:', savedDeviceId);
        }
      } catch (error) {
        console.error('❌ 載入音訊設定失敗:', error);
      }
    },

    saveAudioSettings() {
      try {
        localStorage.setItem('vtaiwan_selected_audio_device', this.selectedAudioDeviceId);
        console.log('✅ 音訊設定已儲存:', this.selectedAudioDeviceId);
        this.hideAudioSettings();
      } catch (error) {
        console.error('❌ 儲存音訊設定失敗:', error);
      }
    },

    selectAudioDevice(deviceId) {
      this.selectedAudioDeviceId = deviceId;
      console.log('📱 選擇音訊設備:', deviceId);
    },

    async testAudioDevice() {
      if (!this.selectedAudioDeviceId) return;

      try {
        this.isTestingAudio = true;
        console.log('🎵 測試音訊設備...');

        // 初始化音訊音量直條
        this.audioLevels = Array(20).fill(0);

        // 創建測試音訊流
        this.testAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: this.selectedAudioDeviceId },
            echoCancellation: true,
            noiseSuppression: true
          }
        });

                        // 創建 Web Audio API 上下文
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 如果音訊上下文被暫停，需要恢復
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        this.audioSource = this.audioContext.createMediaStreamSource(this.testAudioStream);
        this.audioAnalyser = this.audioContext.createAnalyser();

        // 設定分析器參數
        this.audioAnalyser.fftSize = 256;
        this.audioAnalyser.smoothingTimeConstant = 0.8;

        // 連接音訊節點 - 分析器需要連接到目標節點才能工作
        this.audioSource.connect(this.audioAnalyser);
        this.audioAnalyser.connect(this.audioContext.destination);

        // 開始音量監控
        this.startAudioLevelMonitoring();

        console.log('✅ 音訊測試已開始，請對著麥克風說話');

      } catch (error) {
        console.error('❌ 音訊測試失敗:', error);
        this.isTestingAudio = false;
        alert('音訊測試失敗，請檢查設備權限');
      }
    },

            startAudioLevelMonitoring() {
      const bufferLength = this.audioAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevels = () => {
        if (!this.isTestingAudio) return;

                // 使用時域數據來檢測音量
        this.audioAnalyser.getByteTimeDomainData(dataArray);

        // 計算 RMS (Root Mean Square) 音量
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const value = (dataArray[i] - 128) / 128; // 轉換為 -1 到 1
          sum += value * value;
        }
        const rms = Math.sqrt(sum / bufferLength);
        const normalizedLevel = Math.min(1, rms * 3); // 放大音量並限制在 0-1

        // 添加調試信息
        if (normalizedLevel > 0.05) {
          console.log('🎤 檢測到音訊輸入，音量:', normalizedLevel.toFixed(3));
        }

        // 更新音量直條（創建更真實的視覺效果）
        this.audioLevels = this.audioLevels.map((level, index) => {
          // 創建波浪效果，讓每個直條有不同的頻率
          const waveFactor = Math.sin(Date.now() * 0.005 + index * 0.2) * 0.05;

          // 根據音量大小調整波浪幅度
          const amplitude = normalizedLevel * 0.3;
          const newLevel = Math.max(0, Math.min(1, normalizedLevel + waveFactor + amplitude));

          // 平滑過渡
          const smoothedLevel = level * 0.8 + newLevel * 0.2;

          return smoothedLevel;
        });

        this.levelUpdateInterval = requestAnimationFrame(updateLevels);
      };

      updateLevels();
    },

    stopAudioTest() {
      this.isTestingAudio = false;

      // 停止音量監控
      if (this.levelUpdateInterval) {
        cancelAnimationFrame(this.levelUpdateInterval);
        this.levelUpdateInterval = null;
      }

      // 清理音訊資源
      if (this.audioSource) {
        this.audioSource.disconnect();
        this.audioSource = null;
      }

      if (this.audioAnalyser) {
        this.audioAnalyser = null;
      }

      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      // 停止音訊流
      if (this.testAudioStream) {
        this.testAudioStream.getTracks().forEach(track => track.stop());
        this.testAudioStream = null;
      }

      // 清空音量直條
      this.audioLevels = [];

      console.log('✅ 音訊測試完成');
    },

    toggleAudioSettings() {
      this.showAudioSettings = !this.showAudioSettings;
      if (this.showAudioSettings) {
        // 重新載入設備列表（以防有新設備連接）
        this.loadAudioDevices();
      }
    },

    hideAudioSettings() {
      this.showAudioSettings = false;
      // 停止音訊測試
      this.stopAudioTest();
    },

    handleDeviceChange() {
      console.log('🔌 檢測到設備變更，重新載入設備列表...');
      this.loadAudioDevices();
    },
  }
};
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
  height: 100% !important;
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
  box-shadow: -10px 0 25px -3px rgba(0, 0, 0, 0.1), -4px 0 10px -2px rgba(0, 0, 0, 0.05);
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
