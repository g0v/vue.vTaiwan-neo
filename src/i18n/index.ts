import { createI18n } from 'vue-i18n'
import zhTW from '../l10n/zh-TW.json'
import en from '../l10n/en.json'

// 支援的語言列表
export const supportedLocales = [
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
] as const

// 支援的語言代碼類型
export type SupportedLocale = typeof supportedLocales[number]['code']

// 預設語言
const defaultLocale: SupportedLocale = 'zh-TW'

// 從 localStorage 或瀏覽器語言設定取得語言偏好
const getLocale = (): SupportedLocale => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && supportedLocales.some(locale => locale.code === savedLocale)) {
    return savedLocale as SupportedLocale
  }

  // 檢查瀏覽器語言設定
  const browserLocale = navigator.language
  if (browserLocale.startsWith('zh')) {
    return 'zh-TW'
  }
  if (browserLocale.startsWith('en')) {
    return 'en'
  }

  return defaultLocale
}

// 建立 i18n 實例
const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: getLocale(),
  fallbackLocale: defaultLocale,
  messages: {
    'zh-TW': zhTW,
    'en': en
  },
  globalInjection: true, // 全域注入 $t 函數
  silentTranslationWarn: true, // 在開發環境中隱藏翻譯警告
  silentFallbackWarn: true
})

// 語言切換函數
export const setLocale = (locale: SupportedLocale) => {
  if (supportedLocales.some(l => l.code === locale)) {
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
  }
}

// 取得當前語言
export const getCurrentLocale = (): SupportedLocale => {
  return i18n.global.locale.value as SupportedLocale
}

// 取得語言顯示名稱
export const getLocaleName = (locale: string) => {
  const found = supportedLocales.find(l => l.code === locale)
  return found ? found.name : locale
}

export default i18n
