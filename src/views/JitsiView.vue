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
      <JaaSMeeting
        :key="jitsiKey"
        v-bind="jitsiProps"
        lang="zh-TW"
        @get-iframe-ref-on-api-ready="onIframeReady"
        @on-api-ready="onApiReady"
        @on-ready-to-close="onReadyToClose"
      />
    </div>

    <!-- 寬螢幕逐字稿面板 -->
    <div
      v-if="showTranscript && !isMobile"
      class="w-[38%] h-full"
    >
      <TranscriptPanel @close="hideTranscript" />
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

        <TranscriptPanel @close="hideTranscript" />
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
import { JaaSMeeting } from '@jitsi/vue-sdk';
import TranscriptPanel from '../components/TranscriptPanel.vue';
import IconWrapper from '../components/IconWrapper.vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'JitsiView',
  components: {
    JaaSMeeting,
    TranscriptPanel,
    IconWrapper
  },
  props: { userData: { type: Object, required: false, default: () => ({}) } },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      appId: 'vpaas-magic-cookie-7c142b7a730e4478878703f86c03d5a1', // 替換自己的 App ID
      room: 'vtaiwan',
      jwt: '',
      jitsiKey: 0, // 用於強制重新渲染組件
      jitsiApi: null, // 儲存 Jitsi API 實例

      // 逐字稿相關
      showTranscript: false,
      drawerWidth: 400, // 抽屜寬度
      isDragging: false,
      dragStartX: 0,
      dragStartWidth: 0,
    };
  },
  computed: {
    fullRoomName() { return `${this.appId}/${this.room}`; },
    jitsiProps() {
      return {
        'app-id': this.appId,
        'room-name': this.fullRoomName,
        'jwt': this.jwt,
        'use-staging': false
      };
    },
    isMobile() {
      return window.innerWidth < 768; // md breakpoint
    }
  },
  async created() {
    console.log('JitsiView created');
    this.getJwt();
  },
  beforeUnmount() {
    // 清理事件監聽器
    this.removeJitsiEventListeners();
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
    window.addEventListener('resize', this.handleResize);
  },
  watch: {
    userData: {
      handler(newVal) {
        console.log('userData', newVal);
        this.getJwt();
      },
    },
    jwt(newJwt, oldJwt) {
      // 當 JWT 更新時，增加 key 值來強制重新渲染組件
      if (newJwt && newJwt !== oldJwt) {
        console.log('JWT updated, reloading JaaSMeeting component');
        this.jitsiKey += 1;
      }
    }
  },
  methods: {
    async getJwt() {
      const user_id = this.userData.uid || 'guest' + Math.floor(Math.random() * 1000000);
      const user_name = this.userData.name || 'Guest' + Math.floor(Math.random() * 1000000);
      const user_email = this.userData.email || 'guest@vtaiwan.tw';
      const isAdmin = this.userData.isAdmin || false;
      console.log('user_id', user_id);
      console.log('user_name', user_name);
      console.log('user_email', user_email);
      console.log('isAdmin', isAdmin);
      const res = await fetch(`https://vtaiwan-jaas-jwt-worker.bestian123.workers.dev/api/jitsi-token?room=vtaiwan&user_id=${user_id}&user_name=${user_name}&user_email=${user_email}&user_moderator=${isAdmin}`);
      const json = await res.json();
      this.jwt = json.token;
    },
    onIframeReady(parentNode) {
      console.log('Iframe Ready', parentNode);
      parentNode.style.height = '100vh';
      parentNode.style.width = '100%';
      // 設定 iframe 的 width 和 height
      parentNode.querySelector('iframe').style.width = '100%';
      parentNode.querySelector('iframe').style.height = '100%';

      // 當逐字稿面板顯示/隱藏時，確保 iframe 正確調整大小
      this.$watch('showTranscript', () => {
        setTimeout(() => {
          if (parentNode.querySelector('iframe')) {
            parentNode.querySelector('iframe').style.width = '100%';
            parentNode.querySelector('iframe').style.height = '100%';
          }
        }, 300); // 等待 CSS 轉場完成
      });
    },
    onApiReady(api) {
      console.log('Jitsi API Ready', api);
      this.jitsiApi = api;
      this.setupJitsiEventListeners();
    },
    onReadyToClose() {
      console.log('Jitsi ready to close');
      this.handleJitsiHangup();
    },
    setupJitsiEventListeners() {
      if (!this.jitsiApi) return;

      // 監聽會議結束事件
      this.jitsiApi.addEventListener('videoConferenceLeft', this.handleJitsiHangup);
      this.jitsiApi.addEventListener('readyToClose', this.handleJitsiHangup);

      console.log('Jitsi event listeners setup');
    },
    removeJitsiEventListeners() {
      if (!this.jitsiApi) return;

      // 移除事件監聽器
      this.jitsiApi.removeEventListener('videoConferenceLeft', this.handleJitsiHangup);
      this.jitsiApi.removeEventListener('readyToClose', this.handleJitsiHangup);

      console.log('Jitsi event listeners removed');
    },
    handleJitsiHangup() {
      console.log('Jitsi hangup detected, reloading component...');

      // 清理當前的事件監聽器
      this.removeJitsiEventListeners();
      this.jitsiApi = null;

      // 延遲一點時間再重新載入，確保清理完成
      setTimeout(() => {
        this.jitsiKey += 1;
        console.log('JaaSMeeting component reloaded');
      }, 500);
    },

    // 逐字稿相關方法
    toggleTranscript() {
      console.log('toggleTranscript', this.showTranscript);
      this.showTranscript = !this.showTranscript;
    },

    hideTranscript() {
      this.showTranscript = false;
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
    }
  }
};
</script>

<style scoped>
/* 確保 JaaSMeeting 組件填滿父容器 */
:deep(.jaas-meeting) {
  width: 100% !important;
  height: 100vh !important;
}

:deep(.jaas-meeting iframe) {
  width: 100% !important;
  height: 100% !important;
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
