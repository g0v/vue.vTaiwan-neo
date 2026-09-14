import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import HomeView from '@/views/HomeView.vue'
import zhTW from '@/l10n/zh-TW.json'
import type { FormattedTopicData } from '@/lib/discourse'

const discourseMocks = vi.hoisted(() => ({ getFormattedTopics: vi.fn() }))

vi.mock('@/lib/discourse', () => ({ default: discourseMocks }))
vi.mock('@unhead/vue', () => ({ useHead: vi.fn() }))

const makeTopic = (id: number, status: string, date: string): FormattedTopicData => ({
  id,
  title: `議題 ${id}`,
  routeName: `topic-${id}`,
  status,
  slogan: `說明 ${id}`,
  owner: '',
  cover: '',
  tags: [],
  views: id,
  posts_count: id,
  participant_count: id,
  last_posted_at: date,
  created_at: date,
})

describe('HomeView 進行中議題', () => {
  it('排除非進行中狀態並依更新時間顯示前三筆', async () => {
    discourseMocks.getFormattedTopics.mockResolvedValue([
      makeTopic(1, '意見徵集', '2026-08-01T00:00:00.000Z'),
      makeTopic(2, '研擬草案', '2026-08-04T00:00:00.000Z'),
      makeTopic(3, '歷史案件', '2026-08-10T00:00:00.000Z'),
      makeTopic(4, '送交院會', '2026-08-03T00:00:00.000Z'),
      makeTopic(5, '即將開始', '2026-08-02T00:00:00.000Z'),
      makeTopic(6, '意見徵集', '2026-08-05T00:00:00.000Z'),
      makeTopic(7, '即將開始', '2026-07-31T00:00:00.000Z'),
    ])
    const i18n = createI18n({ legacy: false, locale: 'zh-TW', messages: { 'zh-TW': zhTW } })
    const wrapper = mount(HomeView, {
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: RouterLinkStub,
          IconWrapper: true,
          TopicCard: {
            props: ['topic'],
            template: '<article class="topic-stub">{{ topic.title }}</article>',
          },
        },
      },
    })
    await flushPromises()

    expect(wrapper.findAll('.topic-stub').map(card => card.text())).toEqual(['議題 6', '議題 5', '議題 1'])
  })

  it('首頁進行中的議題卡顯示瀏覽人次而非參與人數', async () => {
    discourseMocks.getFormattedTopics.mockResolvedValue([{ ...makeTopic(7, '意見徵集', '2026-08-01T00:00:00.000Z'), views: 70 }])
    const i18n = createI18n({ legacy: false, locale: 'zh-TW', messages: { 'zh-TW': zhTW } })
    const wrapper = mount(HomeView, {
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: RouterLinkStub,
          IconWrapper: true,
        },
      },
    })
    await flushPromises()

    const metric = wrapper.get('[aria-label="瀏覽"]')
    expect(metric.text()).toBe('70')
    expect(metric.get('icon-wrapper-stub').attributes('name')).toBe('eye')
    expect(wrapper.find('[aria-label="參與者"]').exists()).toBe(false)
  })
})
