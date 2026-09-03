import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import router from '@/router'
import Footer from '@/components/Footer.vue'
// 直接讀 SFC 原始碼：<router-link to="/x"> 與 <a href="/x"> 渲染後都是 <a href="/x">，
// 只看 render 結果無法分辨，所以「站內連結必須用 router-link」這條規則要在原始碼層檢查。
import source from '@/components/Footer.vue?raw'
import zhTW from '@/l10n/zh-TW.json'
import en from '@/l10n/en.json'
import ja from '@/l10n/ja.json'

const routerLinkTargets = [...source.matchAll(/<router-link[^>]*\sto="([^"]+)"/g)].map(m => m[1])
const anchorHrefs = [...source.matchAll(/<a[^>]*\shref="([^"]+)"/g)].map(m => m[1])

// 頁尾目前的站內連結；新增時請一併補上，避免有人改壞卻沒被測到。
const EXPECTED_INTERNAL = ['/meetups', '/topics', '/privacy', '/terms']

const messages = { 'zh-TW': zhTW, en, ja }

const mountFooter = async (locale: keyof typeof messages = 'zh-TW') => {
  // router 的 afterEach 會呼叫 window.scrollTo，jsdom 未實作，先蓋掉避免噪音
  window.scrollTo = () => {}
  const i18n = createI18n({ legacy: false, locale, messages })
  router.push('/')
  await router.isReady()
  return mount(Footer, { global: { plugins: [i18n, router] } })
}

describe('Footer 連結', () => {
  it('站內連結一律使用 router-link，不留 <a href="/...">', () => {
    expect(anchorHrefs.filter(h => h.startsWith('/'))).toEqual([])
  })

  it('不再指向 next.vtaiwan.tw（設計稿暫放的非正式網址）', () => {
    expect(source).not.toContain('next.vtaiwan.tw')
  })

  it('預期的站內連結都還在', () => {
    for (const path of EXPECTED_INTERNAL) {
      expect(routerLinkTargets, `頁尾少了 ${path} 的 router-link`).toContain(path)
    }
  })

  it('每個 router-link 的路徑都存在於 router，且不會落到 catch-all', () => {
    for (const path of routerLinkTargets) {
      const resolved = router.resolve(path)
      expect(resolved.matched.length, `${path} 沒有對應的 route`).toBeGreaterThan(0)
      expect(resolved.name, `${path} 落到 catch-all，表示 route 不存在`).not.toBe('catchAll')
      expect(resolved.matched[0].path, `${path} 解析到非預期的 route`).toBe(path)
    }
  })

  it('外部連結都有 target="_blank" 與 rel="noopener noreferrer"', () => {
    const externalTags = [...source.matchAll(/<a\s[^>]*>/g)].map(m => m[0]).filter(tag => /href="https?:/.test(tag))
    expect(externalTags.length).toBeGreaterThan(0)
    for (const tag of externalTags) {
      expect(tag, `外部連結缺 target="_blank"：${tag}`).toContain('target="_blank"')
      expect(tag, `外部連結缺 rel="noopener noreferrer"：${tag}`).toContain('rel="noopener noreferrer"')
    }
  })

  it('渲染後站內連結都產生對應的 <a href>', async () => {
    const wrapper = await mountFooter()
    for (const path of EXPECTED_INTERNAL) {
      expect(wrapper.find(`a[href="${path}"]`).exists(), `${path} 沒有渲染出連結`).toBe(true)
    }
  })

  it('掛載時不會噴 vue-router 警告', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await mountFooter()
    const warnings = warnSpy.mock.calls.map(call => String(call[0]))
    warnSpy.mockRestore()
    expect(warnings.filter(w => w.includes('No match') || w.includes('[Vue Router warn]'))).toEqual([])
  })

  it.each([
    ['zh-TW', '加入下次會議', '提案新議題'],
    ['en', 'Join the next meeting', 'Propose a new topic'],
    ['ja', '次回のミーティングに参加', '新しいトピックを提案'],
  ] as const)('%s 顯示對應語言的會議與提案連結', async (locale, meetingLabel, topicLabel) => {
    const wrapper = await mountFooter(locale)
    expect(wrapper.get('a[href="/meetups"]').text()).toContain(meetingLabel)
    expect(wrapper.get('a[href="/topics"]').text()).toContain(topicLabel)
  })
})
