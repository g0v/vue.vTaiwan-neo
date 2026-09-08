import { flushPromises, shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import JitsiView from '@/views/JitsiView.vue'
import zhTW from '@/l10n/zh-TW.json'
import en from '@/l10n/en.json'
import ja from '@/l10n/ja.json'

const firebaseMocks = vi.hoisted(() => ({
  get: vi.fn(),
  onValue: vi.fn(),
  set: vi.fn(),
}))

vi.mock('@/lib/firebase', () => ({ database: {} }))
vi.mock('firebase/database', () => ({
  get: firebaseMocks.get,
  onValue: firebaseMocks.onValue,
  ref: vi.fn((_database, path) => path),
  set: firebaseMocks.set,
}))

describe('JitsiView 分軌轉錄按鈕', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    firebaseMocks.get.mockResolvedValue({ exists: () => false })
    firebaseMocks.set.mockResolvedValue(undefined)
    firebaseMocks.onValue.mockReturnValue(vi.fn())

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        addEventListener: vi.fn(),
        enumerateDevices: vi.fn().mockResolvedValue([]),
        getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [] }),
        removeEventListener: vi.fn(),
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('閒置時顯示紫色，並依語系提供提示文字', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh-TW',
      messages: { 'zh-TW': zhTW, en, ja },
    })
    const wrapper = shallowMount(JitsiView, {
      props: { userData: { uid: 'test-user' } },
      global: {
        plugins: [i18n],
        stubs: {
          IconWrapper: true,
          TranscriptLanguageSwitcher: true,
          TranscriptPanel: true,
        },
      },
    })
    await flushPromises()

    const button = wrapper.get('button[aria-label="分軌轉錄"]')
    expect(button.attributes('title')).toBe('分軌轉錄')
    expect(button.classes()).toContain('bg-transcription-purple')

    i18n.global.locale.value = 'en'
    await wrapper.vm.$nextTick()
    expect(button.attributes('title')).toBe('Separate-track transcription')

    i18n.global.locale.value = 'ja'
    await wrapper.vm.$nextTick()
    expect(button.attributes('title')).toBe('トラック別文字起こし')

    wrapper.unmount()
  })
})
