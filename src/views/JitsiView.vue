<template>
  <div class="w-full h-screen flex" v-if="jwt">
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
        v-if="!hasJoined && jwt"
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
          <button
            @click="joinMeeting"
            class="px-6 py-3 bg-jade-green text-white rounded-lg hover:bg-jade-green/90 transition-colors"
          >
            加入會議
          </button>
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
      class="w-[38%] h-full"
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

    <!-- 浮動切換按鈕 -->
    <button
      @click="toggleTranscript"
      :class="[
        'fixed bottom-6 right-6 z-30 p-4 rounded-full shadow-lg transition-all duration-300',
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
      drawerWidth: 400, // 抽屜寬度
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
      }
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
      this.meetingData = snapshot.val();
      console.log('meetingData', this.meetingData);
      this.transcriptData = this.meetingData.transcripts || {};
      this.isRecorder = this.meetingData.recorder == this.userData.uid;
      console.log('transcriptData', this.transcriptData);
    });

    // this.getJwt();
  },
  async mounted() {
    this.getJwt();
  },
  beforeUnmount() {
    // 清理 Jitsi API
    if (this.jitsiApi) {
      this.jitsiApi.dispose();
      this.jitsiApi = null;
    }

    // 清理轉錄緩存計時器
    this.clearTranscriptCache();

    // 清理拖拽事件監聽器
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDragging);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.stopDragging);

    // 清理視窗大小變化監聽器
    window.removeEventListener('resize', this.handleResize);
  },
  mounted() {
    // 監聽視窗大小變化
    this.joinMeetingName = this.userData.name || 'Guest' + Math.floor(Math.random() * 1000000);

    window.addEventListener('resize', this.handleResize);
  },
  watch: {
    userData: {
      handler(newVal, oldVal) {
        console.log('userData', newVal);
        this.isRecorder = this.meetingData.recorder == this.userData.uid;
        this.joinMeetingName = this.userData.name || 'Guest' + Math.floor(Math.random() * 1000000);
        this.getJwt();
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
      const user_id = this.userData.uid || 'guest' + Math.floor(Math.random() * 1000000);
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
        return;
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
          transcription: {
            enabled: true,
            useAppLanguage: false, // 改為 false，不使用應用程式語言
            preferredLanguage: 'en-US' // 設定為英文
          }
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security', 'transcription'
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
          console.log('✅ 已加入會議，轉錄功能應該可用');
          // 自動啟用字幕（2秒後）
          setTimeout(() => {
            console.log('🔄 自動啟用字幕...');
            this.jitsiApi.executeCommand('toggleSubtitles');
          }, 2000);
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
        console.log('設定記錄者', this.userData.uid);
        this.meetingData.recorder = this.userData.uid;
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
