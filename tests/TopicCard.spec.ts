import { mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import TopicCard from '@/components/TopicCard.vue'
import zhTW from '@/l10n/zh-TW.json'
import type { FormattedTopicData } from '@/lib/discourse'

const topic: FormattedTopicData = {
  id: 42,
  title: '數位民主測試議題',
  routeName: 'digital-democracy',
  status: '意見徵集',
  slogan: '一起討論數位民主的下一步。',
  owner: 'vtaiwan',
  cover: '',
  tags: ['數位民主'],
  views: 130,
  posts_count: 8,
  participant_count: 21,
  last_posted_at: '2026-08-20T00:00:00.000Z',
  created_at: '2026-08-01T00:00:00.000Z',
}

const mountCard = () => {
  const i18n = createI18n({ legacy: false, locale: 'zh-TW', messages: { 'zh-TW': zhTW } })
  return mount(TopicCard, {
    props: { topic, bookmarked: true, showActions: true },
    global: {
      plugins: [i18n],
      stubs: { RouterLink: RouterLinkStub, IconWrapper: true },
    },
  })
}

describe('TopicCard', () => {
  it('以可鍵盤操作的 RouterLink 覆蓋整張卡片', () => {
    const wrapper = mountCard()
    const link = wrapper.getComponent(RouterLinkStub)

    expect(link.props('to')).toBe('/topic/digital-democracy')
    expect(link.attributes('aria-label')).toContain(topic.title)
  })

  it('分享與書籤按鈕有名稱，且不依賴卡片 click 事件', async () => {
    const wrapper = mountCard()
    const buttons = wrapper.findAll('button')

    expect(buttons.map(button => button.attributes('aria-label'))).toEqual(['分享議題', '移除書籤'])
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('share')?.[0]).toEqual([topic])
    expect(wrapper.emitted('toggleBookmark')?.[0]).toEqual([topic])
  })
})
