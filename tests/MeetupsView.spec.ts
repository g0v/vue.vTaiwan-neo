import { mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import MeetupsView from '@/views/MeetupsView.vue'
import zhTW from '@/l10n/zh-TW.json'

vi.mock('@unhead/vue', () => ({ useHead: vi.fn() }))

describe('MeetupsView', () => {
  it('保留嵌入式 Google Calendar 與所有主要入口', () => {
    const i18n = createI18n({ legacy: false, locale: 'zh-TW', messages: { 'zh-TW': zhTW } })
    const wrapper = mount(MeetupsView, {
      global: {
        plugins: [i18n],
        stubs: { RouterLink: RouterLinkStub, IconWrapper: true },
      },
    })

    const iframe = wrapper.get('iframe')
    expect(iframe.attributes('src')).toContain('calendar.google.com/calendar/embed')
    expect(iframe.attributes('title')).toBe('會議行事曆')

    const routes = wrapper.findAllComponents(RouterLinkStub).map(link => link.props('to'))
    expect(routes).toEqual(expect.arrayContaining(['/jitsi', '/transcriptions', '/contact']))

    const calendarLink = wrapper.get('a[href*="calendar.google.com/calendar/u/2"]')
    expect(calendarLink.attributes('target')).toBe('_blank')
    expect(calendarLink.attributes('rel')).toBe('noopener noreferrer')
  })
})
