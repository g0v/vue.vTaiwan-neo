import discourseApi, { type DiscourseTopic } from '@/lib/discourse'

const makeTopic = (id: number, title: string): DiscourseTopic => ({
  id,
  title,
  posts_count: 4,
  views: 120,
  participant_count: 18,
  last_posted_at: '2026-08-20T00:00:00.000Z',
  created_at: '2026-08-01T00:00:00.000Z',
  tags: ['digital-democracy'],
  pinned: false,
  post_stream: {
    posts: [
      {
        id: id * 10,
        raw: 'slogan: 測試說明\n@owner\ncover: https://example.com/cover.png',
        cooked: '',
        username: 'owner',
        avatar_template: '',
        created_at: '2026-08-01T00:00:00.000Z',
        post_number: 1,
      },
    ],
  },
})

describe('Discourse 格式化議題', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('保留 participant_count', () => {
    const formatted = discourseApi.formatTopicData(makeTopic(1, '測試議題 test-topic'))
    expect(formatted.participant_count).toBe(18)
  })

  it('略過網站設定，且個別詳情失敗時仍回傳其他成功議題', async () => {
    const config = makeTopic(1, '網站基本設定')
    const successful = makeTopic(2, '成功議題 successful-topic')
    const failed = makeTopic(3, '失敗議題 failed-topic')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(discourseApi, 'getAllTopics').mockResolvedValue([config, successful, failed])
    vi.spyOn(discourseApi, 'getTopic').mockImplementation(async id => {
      if (id === failed.id) throw new Error('detail failed')
      return successful
    })

    const result = await discourseApi.getFormattedTopics()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(successful.id)
    expect(discourseApi.getTopic).toHaveBeenCalledTimes(2)
    expect(discourseApi.getTopic).not.toHaveBeenCalledWith(config.id)
  })
})
