// vue-i18n 以 globalInjection:true 注入的全域 $t（createI18n 設定為 legacy:false）。
// 補上型別宣告，讓 vue-tsc 在模板中認得 $t，否則會報 TS2339「Property '$t' does not exist」。
import type { ComposerTranslation } from 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: ComposerTranslation
  }
}
