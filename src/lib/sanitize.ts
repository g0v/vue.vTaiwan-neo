import DOMPurify from 'dompurify'

const sanitizerOptions = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['script', 'style', 'base', 'object', 'embed', 'svg', 'math'],
  FORBID_ATTR: ['style'],
  ALLOW_UNKNOWN_PROTOCOLS: false,
}

/**
 * 清理所有要交給 v-html 的不受信任 HTML。
 * DOMPurify 會移除事件處理器（例如 onerror）及 javascript: URL。
 */
export const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html || '', sanitizerOptions)
}

/**
 * 僅供既有的第三方嵌入內容使用。iframe 必須使用 HTTP(S) URL。
 */
export const sanitizeEmbedHtml = (html: string) => {
  return DOMPurify.sanitize(html || '', {
    ...sanitizerOptions,
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy', 'sandbox'],
  })
}
