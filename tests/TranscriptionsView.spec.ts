import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import TranscriptionsView from '@/views/TranscriptionsView.vue'
import zhTW from '@/l10n/zh-TW.json'

vi.mock('@unhead/vue', () => ({ useHead: vi.fn() }))

describe('TranscriptionsView 大綱下載', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              meeting_id: '20250621',
              transcription: '會議逐字稿',
              outline: '# 會議大綱\n\n- 第一項',
            },
          ]),
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('在大綱視窗下載文字檔，並使用 outline-YYYY-MM-DD.txt 檔名', async () => {
    const downloads: Array<{ filename: string; href: string }> = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloads.push({ filename: this.download, href: this.href })
    })

    const i18n = createI18n({ legacy: false, locale: 'zh-TW', messages: { 'zh-TW': zhTW } })
    const wrapper = mount(TranscriptionsView, {
      global: {
        plugins: [i18n],
        stubs: { RouterLink: RouterLinkStub, IconWrapper: true },
      },
    })
    await flushPromises()

    const viewOutlineButton = wrapper.findAll('button').find(button => button.text() === '查看大綱')
    expect(viewOutlineButton).toBeDefined()
    await viewOutlineButton!.trigger('click')
    const downloadButton = wrapper.findAll('button').find(button => button.text() === '下載大綱')
    expect(downloadButton).toBeDefined()

    await downloadButton!.trigger('click')

    expect(downloads).toHaveLength(1)
    expect(downloads[0].filename).toBe('outline-2025-06-21.txt')
    expect(decodeURIComponent(downloads[0].href)).toContain('# 會議大綱\n\n- 第一項')
  })
})
