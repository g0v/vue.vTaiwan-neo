/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-carousel'
declare module 'lucide-vue-next'

// 解決 Vue 內部類型衝突
declare global {
  interface Window {
    __VUE_DEVTOOLS_GLOBAL_HOOK__: any
  }
}
