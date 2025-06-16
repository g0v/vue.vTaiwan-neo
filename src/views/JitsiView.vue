<template>
  <div class="w-full h-screen" v-if="jwt">
    <JaaSMeeting
      :key="jitsiKey"
      v-bind="jitsiProps"
      lang="zh-TW"
      @get-iframe-ref-on-api-ready="onIframeReady"
      @on-api-ready="onApiReady"
      @on-ready-to-close="onReadyToClose"
    />
  </div>
</template>

<script>
import { JaaSMeeting } from '@jitsi/vue-sdk';

export default {
  name: 'JitsiView',
  components: { JaaSMeeting },
  props: { userData: { type: Object, required: false, default: () => ({}) } },
  data() {
    return {
      appId: 'vpaas-magic-cookie-7c142b7a730e4478878703f86c03d5a1', // 替換自己的 App ID
      room: 'vtaiwan',
      jwt: '',
      jitsiKey: 0, // 用於強制重新渲染組件
      jitsiApi: null, // 儲存 Jitsi API 實例
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
    }
  },
  async created() {
    console.log('JitsiView created');
    this.getJwt();
  },
  beforeUnmount() {
    // 清理事件監聽器
    this.removeJitsiEventListeners();
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
</style>