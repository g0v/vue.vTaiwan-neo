import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import TopicsView from '@/views/TopicsView.vue'
import zhTW from '@/l10n/zh-TW.json'
import type { FormattedTopicData } from '@/lib/discourse'

const discourseMocks = vi.hoisted(() => ({ getFormattedTopics: vi.fn() }))
const storedValues = new Map<string, string>()
const localStorageMock: Storage = {
  get length() {
    return storedValues.size
  },
  clear: () => storedValues.clear(),
  getItem: key => storedValues.get(key) ?? null,
  key: index => [...storedValues.keys()][index] ?? null,
  removeItem: key => storedValues.delete(key),
  setItem: (key, value) => storedValues.set(key, String(value)),
}

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, configurable: true })

vi.mock('@/lib/discourse', () => ({ default: discourseMocks }))
vi.mock('@unhead/vue', () => ({ useHead: vi.fn() }))

const topics: FormattedTopicData[] = [
  {
    id: 1,
    title: '開放資料',
    routeName: 'open-data',
    status: '意見徵集',
    slogan: '讓公共資料更容易使用',
    owner: '',
    cover: '',
    tags: ['開放政府'],
    views: 20,
    posts_count: 4,
    participant_count: 8,
    last_posted_at: '2026-08-20T00:00:00.000Z',
    created_at: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: '數位身分證',
    routeName: 'digital-id',
    status: '研擬草案',
    slogan: '兼顧隱私與便利',
    owner: '',
    cover: '',
    tags: ['數位政策'],
    views: 80,
    posts_count: 12,
    participant_count: 30,
    last_posted_at: '2026-08-10T00:00:00.000Z',
    created_at: '2026-07-01T00:00:00.000Z',
  },
  {
    id: 3,
    title: '歷史議題',
    routeName: 'history',
    status: '歷史案件',
    slogan: '已完成的討論',
    owner: '',
    cover: '',
    tags: ['歷史'],
    views: 200,
    posts_count: 30,
    participant_count: 15,
    last_posted_at: '2026-07-20T00:00:00.000Z',
    created_at: '2026-06-01T00:00:00.000Z',
  },
]

const mountTopics = async () => {
  const i18n = createI18n({ legacy: false, locale: 'zh-TW', messages: { 'zh-TW': zhTW } })
  const wrapper = mount(TopicsView, {
    global: {
      plugins: [i18n],
      stubs: {
        RouterLink: RouterLinkStub,
        IconWrapper: true,
        TopicCard: {
          props: ['topic'],
          template: '<article class="topic-stub" :data-id="topic.id">{{ topic.title }}</article>',
        },
      },
    },
  })
  await flushPromises()
  return wrapper
}

const topicTitles = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('.topic-stub').map(card => card.text())

describe('TopicsView', () => {
  beforeEach(() => {
    localStorage.clear()
    discourseMocks.getFormattedTopics.mockReset()
    discourseMocks.getFormattedTopics.mockResolvedValue(topics)
  })

  it('保留搜尋、排序、階段與書籤篩選', async () => {
    localStorage.setItem('bookmarkedTopics', JSON.stringify([1]))
    const wrapper = await mountTopics()

    expect(topicTitles(wrapper)).toEqual(['開放資料', '數位身分證', '歷史議題'])

    const buttons = wrapper.findAll('button')
    await buttons.find(button => button.text() === '參與人數')!.trigger('click')
    expect(topicTitles(wrapper)).toEqual(['數位身分證', '歷史議題', '開放資料'])

    await buttons.find(button => button.text() === '意見徵集')!.trigger('click')
    expect(topicTitles(wrapper)).toEqual(['開放資料'])

    await buttons.find(button => button.text() === '意見徵集')!.trigger('click')
    await buttons.find(button => button.text() === '書籤')!.trigger('click')
    expect(topicTitles(wrapper)).toEqual(['開放資料'])

    await wrapper.get('input[type="search"]').setValue('不存在')
    expect(wrapper.text()).toContain('找不到符合的議題')

    await wrapper
      .findAll('button')
      .find(button => button.text() === '清除所有篩選')!
      .trigger('click')
    expect(topicTitles(wrapper)).toEqual(['數位身分證', '歷史議題', '開放資料'])
  })

  it('API 失敗時顯示錯誤並可重試', async () => {
    discourseMocks.getFormattedTopics.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(topics)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = await mountTopics()

    expect(wrapper.text()).toContain('無法載入議題')
    await wrapper
      .findAll('button')
      .find(button => button.text() === '重試')!
      .trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.topic-stub')).toHaveLength(3)
  })
})
