import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './style.css'

import VueGtag from 'vue-gtag-next'
import { createHead } from '@unhead/vue/client'
import { getCurrentInstance } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useGtag } from 'vue-gtag-next'

// 讓 TypeScript 知道 window.gtag 可能存在
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    gtag?: any
  }
}

const app = createApp(App)

const head = createHead()
app.use(head)

app.use(router)
app.use(i18n)
app.use(VueGtag, {
  property: {
    id: 'G-PJ396EXSTX'
  }
})

router.afterEach((to, from) => {
  // 取得最新的 title
  const title = document.title
  // 取得 vue-gtag 實例
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_path: to.fullPath,
      page_location: window.location.href
    })
  }
})

app.mount('#app')
