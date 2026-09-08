import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import FAQView from '@/views/FAQView.vue'
import zhTW from '@/l10n/zh-TW.json'

vi.mock('@unhead/vue', () => ({ useHead: vi.fn() }))

const mountFaq = () => {
  const i18n = createI18n({ legacy: false, locale: 'zh-TW', messages: { 'zh-TW': zhTW } })
  return mount(FAQView, {
    global: {
      plugins: [i18n],
      stubs: { IconWrapper: true },
    },
  })
}

describe('FAQ 新視覺 accordion', () => {
  it('預設展開第一題，並建立正確的 ARIA 關聯', () => {
    const wrapper = mountFaq()
    const firstButton = wrapper.get('#faq-trigger-1')

    expect(firstButton.attributes('aria-expanded')).toBe('true')
    expect(firstButton.attributes('aria-controls')).toBe('faq-panel-1')
    expect(wrapper.get('#faq-panel-1').attributes('aria-labelledby')).toBe('faq-trigger-1')
  })

  it('同時只展開一題，再按一次可收合', async () => {
    const wrapper = mountFaq()
    const firstButton = wrapper.get('#faq-trigger-1')
    const secondButton = wrapper.get('#faq-trigger-2')

    await secondButton.trigger('click')
    expect(firstButton.attributes('aria-expanded')).toBe('false')
    expect(secondButton.attributes('aria-expanded')).toBe('true')

    await secondButton.trigger('click')
    expect(secondButton.attributes('aria-expanded')).toBe('false')
  })

  it('保留安全處理後的 rich HTML 與步驟清單', async () => {
    const wrapper = mountFaq()

    await wrapper.get('#faq-trigger-3').trigger('click')
    expect(wrapper.get('#faq-panel-3 a').attributes('rel')).toContain('noopener')

    await wrapper.get('#faq-trigger-4').trigger('click')
    expect(wrapper.findAll('#faq-panel-4 li')).toHaveLength(4)
  })
})
