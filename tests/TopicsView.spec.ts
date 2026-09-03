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
          props: { topic: Object, metric: String, showCover: Boolean },
          template: '<article class="topic-stub" :data-id="topic.id" :data-metric="metric" :data-show-cover="showCover">{{ topic.title }}</article>',
        },
      },
    },
  })
  await flushPromises()
  return wrapper
}

const topicTitles = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[data-testid="topics-list"] .topic-stub').map(card => card.text())
const recentTopicTitles = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[aria-labelledby="recent-topics-heading"] .topic-stub').map(card => card.text())

describe('TopicsView', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-08-28T12:00:00.000Z'))
    localStorage.clear()
    discourseMocks.getFormattedTopics.mockReset()
    discourseMocks.getFormattedTopics.mockResolvedValue(topics)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('近期與完整列表的卡片都使用瀏覽人次', async () => {
    const wrapper = await mountTopics()
    const cards = wrapper.findAll('.topic-stub')

    expect(cards).toHaveLength(5)
    expect(cards.every(card => card.attributes('data-metric') === 'views')).toBe(true)
  })

  it('只有近期議題卡片啟用封面，完整列表維持無封面', async () => {
    const wrapper = await mountTopics()
    const recentCards = wrapper.findAll('[aria-labelledby="recent-topics-heading"] .topic-stub')
    const listCards = wrapper.findAll('[data-testid="topics-list"] .topic-stub')

    expect(recentCards).toHaveLength(2)
    expect(listCards).toHaveLength(3)
    expect(recentCards.every(card => card.attributes('data-show-cover') === 'true')).toBe(true)
    expect(listCards.every(card => card.attributes('data-show-cover') === 'false')).toBe(true)
  })

  it('依更新時間篩選近三個月，包含邊界並以建立時間作為備援', async () => {
    discourseMocks.getFormattedTopics.mockResolvedValueOnce([
      { ...topics[0], id: 4, title: '剛好三個月', last_posted_at: '2026-05-28T12:00:00.000Z' },
      { ...topics[0], id: 5, title: '超過三個月', last_posted_at: '2026-05-28T11:59:59.999Z' },
      { ...topics[0], id: 6, title: '以建立時間判斷', last_posted_at: '', created_at: '2026-08-22T00:00:00.000Z' },
      { ...topics[0], id: 7, title: '舊議題的新討論', created_at: '2020-01-01T00:00:00.000Z', last_posted_at: '2026-08-27T00:00:00.000Z' },
      { ...topics[0], id: 8, title: '網站基本設定', last_posted_at: '2026-08-28T00:00:00.000Z' },
      { ...topics[0], id: 9, title: '舊議題無更新', last_posted_at: '', created_at: '2026-05-01T00:00:00.000Z' },
    ])
    const wrapper = await mountTopics()

    expect(recentTopicTitles(wrapper)).toEqual(['舊議題的新討論', '以建立時間判斷', '剛好三個月'])
    expect(topicTitles(wrapper)).toContain('超過三個月')
  })

  it('近期議題排除歷史案件，即使更新時間在三個月內', async () => {
    const wrapper = await mountTopics()

    expect(recentTopicTitles(wrapper)).toEqual(['開放資料', '數位身分證'])
    expect(topicTitles(wrapper)).toContain('歷史議題')
  })

  it('近期議題按更新時間排序且最多顯示六筆', async () => {
    discourseMocks.getFormattedTopics.mockResolvedValueOnce(
      Array.from({ length: 8 }, (_, index) => ({
        ...topics[0],
        id: index + 10,
        title: `近期議題 ${index + 1}`,
        last_posted_at: `2026-08-${10 + index}T00:00:00.000Z`,
      }))
    )
    const wrapper = await mountTopics()

    expect(recentTopicTitles(wrapper)).toEqual(['近期議題 8', '近期議題 7', '近期議題 6', '近期議題 5', '近期議題 4', '近期議題 3'])
    expect(topicTitles(wrapper)).toHaveLength(8)
  })

  it('沒有近期議題時顯示提示，仍保留完整列表', async () => {
    discourseMocks.getFormattedTopics.mockResolvedValueOnce([{ ...topics[2], last_posted_at: '2026-01-01T00:00:00.000Z' }])
    const wrapper = await mountTopics()

    expect(wrapper.get('[aria-labelledby="recent-topics-heading"]').text()).toContain('暫無近期議題')
    expect(recentTopicTitles(wrapper)).toEqual([])
    expect(topicTitles(wrapper)).toEqual(['歷史議題'])
  })

  it('載入期間顯示載入狀態，不提前顯示無近期議題', async () => {
    discourseMocks.getFormattedTopics.mockReturnValueOnce(new Promise(() => {}))
    const wrapper = await mountTopics()
    const recentSection = wrapper.get('[aria-labelledby="recent-topics-heading"]')

    expect(recentSection.get('[role="status"]').attributes('aria-busy')).toBe('true')
    expect(recentSection.text()).toContain('載入中')
    expect(recentSection.text()).not.toContain('暫無近期議題')
  })

  it('保留搜尋、排序、階段與書籤篩選', async () => {
    localStorage.setItem('bookmarkedTopics', JSON.stringify([1]))
    const wrapper = await mountTopics()

    expect(topicTitles(wrapper)).toEqual(['開放資料', '數位身分證', '歷史議題'])
    const recentTitles = recentTopicTitles(wrapper)

    const buttons = wrapper.findAll('button')
    await buttons.find(button => button.text() === '瀏覽數')!.trigger('click')
    expect(topicTitles(wrapper)).toEqual(['歷史議題', '數位身分證', '開放資料'])
    expect(recentTopicTitles(wrapper)).toEqual(recentTitles)

    await buttons.find(button => button.text() === '參與人數')!.trigger('click')
    expect(topicTitles(wrapper)).toEqual(['數位身分證', '歷史議題', '開放資料'])
    expect(recentTopicTitles(wrapper)).toEqual(recentTitles)

    await buttons.find(button => button.text() === '意見徵集')!.trigger('click')
    expect(topicTitles(wrapper)).toEqual(['開放資料'])
    expect(recentTopicTitles(wrapper)).toEqual(recentTitles)

    await buttons.find(button => button.text() === '意見徵集')!.trigger('click')
    await buttons.find(button => button.text() === '書籤')!.trigger('click')
    expect(topicTitles(wrapper)).toEqual(['開放資料'])
    expect(recentTopicTitles(wrapper)).toEqual(recentTitles)

    await wrapper.get('input[type="search"]').setValue('不存在')
    expect(wrapper.text()).toContain('找不到符合的議題')
    expect(recentTopicTitles(wrapper)).toEqual(recentTitles)

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
    expect(wrapper.find('[aria-labelledby="recent-topics-heading"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('暫無近期議題')
    await wrapper
      .findAll('button')
      .find(button => button.text() === '重試')!
      .trigger('click')
    await flushPromises()
    expect(topicTitles(wrapper)).toHaveLength(3)
    expect(recentTopicTitles(wrapper)).toHaveLength(2)
  })
})
