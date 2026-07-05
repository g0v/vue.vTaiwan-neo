// vue-i18n 使用 legacy: false + globalInjection: true，
// 於 Composition API 模式下 $t 是透過 app.config.globalProperties 注入，
// 需在模板型別中手動宣告全域注入的 $t（此檔為 module，才能「擴充」而非「取代」vue 模組）。
import type { ComposerTranslation } from 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: ComposerTranslation
  }
}

export {}
