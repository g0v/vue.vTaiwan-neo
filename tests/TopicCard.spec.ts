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
  cover: 'https://example.com/topic-cover.jpg',
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
  it('只在啟用封面時顯示議題圖片', async () => {
    const wrapper = mountCard()
    expect(wrapper.find('img').exists()).toBe(false)

    await wrapper.setProps({ showCover: true })
    const cover = wrapper.get('img')
    expect(cover.attributes('src')).toBe(topic.cover)
    expect(cover.attributes('alt')).toBe(topic.title)
    expect(cover.classes()).toContain('aspect-video')
    expect(cover.classes()).toContain('object-cover')
  })

  it('近期議題沒有封面時不留下空白圖片區', async () => {
    const wrapper = mountCard()
    await wrapper.setProps({ showCover: true, topic: { ...topic, cover: '' } })
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('可顯示眼睛圖示與瀏覽人次，不顯示參與人數', async () => {
    const wrapper = mountCard()
    await wrapper.setProps({ metric: 'views' })

    const metric = wrapper.get('[aria-label="瀏覽"]')
    expect(metric.text()).toBe('130')
    expect(metric.get('icon-wrapper-stub').attributes('name')).toBe('eye')
    expect(wrapper.find('[aria-label="參與者"]').exists()).toBe(false)
    expect(wrapper.find('icon-wrapper-stub[name="users"]').exists()).toBe(false)

    await wrapper.setProps({ topic: { ...topic, views: 0 } })
    expect(metric.text()).toBe('0')
  })

  it('未指定指標時保留首頁原本的參與人數', () => {
    const wrapper = mountCard()
    expect(wrapper.get('[aria-label="參與者"]').text()).toBe('21')
    expect(wrapper.get('icon-wrapper-stub[name="users"]').attributes('name')).toBe('users')
  })

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
