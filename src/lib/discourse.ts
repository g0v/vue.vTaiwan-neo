import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

const DISCOURSE_BASE_URL = 'https://talk.vtaiwan.tw'

// 類型定義
interface DiscoursePost {
  id: number
  raw: string
  cooked: string
  username: string
  avatar_template: string
  created_at: string
  post_number: number
}

interface DiscourseTopic {
  id: number
  title: string
  posts_count: number
  views: number
  participant_count: number
  last_posted_at: string
  created_at: string
  tags: string[]
  pinned: boolean
  post_stream: {
    posts: DiscoursePost[]
  }
}

interface DiscourseTopicList {
  topic_list: {
    topics: DiscourseTopic[]
  }
}

interface DiscourseSearchResult {
  topics: DiscourseTopic[]
  posts: DiscoursePost[]
}

interface TopicStats {
  views: number
  posts_count: number
  participant_count: number
  last_posted_at: string
  created_at: string
}

interface FormattedTopicData {
  id: number
  title: string
  routeName: string
  status: string
  slogan: string
  owner: string
  cover: string
  tags: string[]
  views: number
  posts_count: number
  last_posted_at: string
  created_at: string
}

interface ParsedPostData {
  slogan: string
  owner: string
  cover: string
}

// 創建 axios 實例
const discourseApi = axios.create({
  baseURL: DISCOURSE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 中文排序函數 (複刻舊網站邏輯)
const chineseSort = (a: string, b: string): number => {
  const c2n: Record<string, string> = {
    "一": "1", "二": "2", "三": "3", "四": "4", "五": "5",
    "六": "6", "七": "7", "八": "8", "九": "9", "十": "10"
  }

  const chineseToNumber = (str: string): string => {
    return str.replace(/一|二|三|四|五|六|七|八|九|十/gi, (matched: string) => {
      return c2n[matched] || matched
    })
  }

  return chineseToNumber(a).localeCompare(chineseToNumber(b), 'zh-TW', { numeric: true })
}

// 快取機制
const cache = new Map<string, AxiosResponse>()

// 帶快取的 GET 請求
const cachedGet = async (url: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  const cacheKey = url + JSON.stringify(options)

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!
  }

  try {
    const response = await discourseApi.get(url, options)
    cache.set(cacheKey, response)
    return response
  } catch (error) {
    console.error('Discourse API Error:', error)
    throw error
  }
}

// 清除快取
const clearCache = (url?: string): void => {
  if (url) {
    const keysToDelete = Array.from(cache.keys()).filter(key => key.startsWith(url))
    keysToDelete.forEach(key => cache.delete(key))
  } else {
    cache.clear()
  }
}

interface DiscourseAPI {
  getAllTopics(categoryUri?: string): Promise<DiscourseTopic[]>
  getAllCategoryTopics(categoryUri: string): Promise<DiscourseTopic[]>
  getTopic(topicId: string | number): Promise<DiscourseTopic>
  getCategoryDiscussion(category: string): Promise<DiscourseTopicList>
  searchTopics(category: string, query?: string): Promise<DiscourseSearchResult>
  getAllPosts(topicId: string | number): Promise<DiscoursePost[]>
  getTopicStats(topicId: string | number): Promise<TopicStats>
  formatTopicData(topicData: DiscourseTopic): FormattedTopicData
  clearCache(url?: string): void
  getDiscourseUrl(): string
}

const discourseAPI: DiscourseAPI = {
  // 取得所有議題 (帶分頁處理，複刻舊網站邏輯)
  async getAllTopics(categoryUri: string = '/c/meta-data.json'): Promise<DiscourseTopic[]> {
    const allTopics: DiscourseTopic[] = []
    let page = 0

    // 處理完整URL的情況（如 https://talk.vtaiwan.tw/c/category.json）
    const processUrl = (url: string): string => {
      if (url.startsWith('https://talk.vtaiwan.tw')) {
        // 移除 baseURL 部分，只保留路徑
        return url.replace('https://talk.vtaiwan.tw', '')
      }
      return url
    }

    const getTopics = async (categoryUri: string, page: number): Promise<DiscourseTopic[]> => {
      try {
        const processedUri = processUrl(categoryUri)
        const url = processedUri + (processedUri.includes('?') ? '&' : '?') + `include_raw=1&page=${page}`
        const response = await cachedGet(url)

        // 確保回應格式正確
        if (!response.data || !response.data.topic_list || !response.data.topic_list.topics) {
          console.warn('Invalid response format for topics')
          return allTopics
        }

        const topics: DiscourseTopic[] = response.data.topic_list.topics

        if (topics && topics.length > 0) {
          allTopics.push(...topics)
          page++
          return await getTopics(categoryUri, page)
        } else {
          return allTopics
        }
      } catch (error) {
        console.error('Failed to fetch topics page', page, ':', error)
        // 如果是第一頁就失敗，則拋出錯誤；否則返回已獲取的數據
        if (page === 0) {
          throw error
        }
        return allTopics
      }
    }

    try {
      const result = await getTopics(categoryUri, 0)
      return result
    } catch (error) {
      console.error('Failed to fetch all topics:', error)
      throw error
    }
  },

  // 取得特定分類下的所有討論串 (複刻舊網站getAllPosts邏輯，但用於topics)
  async getAllCategoryTopics(categoryUri: string): Promise<DiscourseTopic[]> {
    const allTopics: DiscourseTopic[] = []
    let page = 0

    // 處理完整URL的情況
    const processUrl = (url: string): string => {
      if (url.startsWith('https://talk.vtaiwan.tw')) {
        return url.replace('https://talk.vtaiwan.tw', '')
      }
      return url
    }

    const getTopics = async (categoryUri: string, page: number): Promise<DiscourseTopic[]> => {
      try {
        const processedUri = processUrl(categoryUri)
        const url = processedUri + (processedUri.includes('?') ? '&' : '?') + `include_raw=1&page=${page}`
        const response = await cachedGet(url)

        // 確保回應格式正確
        if (!response.data || !response.data.topic_list || !response.data.topic_list.topics) {
          console.warn('Invalid response format for category topics')
          return allTopics
        }

        const topics: DiscourseTopic[] = response.data.topic_list.topics

        if (topics && topics.length > 0) {
          allTopics.push(...topics)
          page++
          return await getTopics(categoryUri, page)
        } else {
          return allTopics
        }
      } catch (error) {
        console.error('Failed to fetch category topics page', page, ':', error)
        if (page === 0) {
          throw error
        }
        return allTopics
      }
    }

    try {
      const result = await getTopics(categoryUri, 0)
      return result
    } catch (error) {
      console.error('Failed to fetch all category topics:', error)
      throw error
    }
  },

  // 取得特定議題詳細資訊
  async getTopic(topicId: string | number): Promise<DiscourseTopic> {
    try {
      const response = await cachedGet(`/t/${topicId}.json?include_raw=1`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch topic:', error)
      throw error
    }
  },

  // 取得特定分類的討論
  async getCategoryDiscussion(category: string): Promise<DiscourseTopicList> {
    try {
      const response = await cachedGet(`/c/${category}/l/latest.json`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch category discussion:', error)
      throw error
    }
  },

  // 搜尋特定分類的內容
  async searchTopics(category: string, query: string = ''): Promise<DiscourseSearchResult> {
    try {
      const searchQuery = query ? `category:${category} ${query}` : `category:${category}`
      const response = await cachedGet(`/search.json?q=${encodeURIComponent(searchQuery)}`)
      return response.data
    } catch (error) {
      console.error('Failed to search topics:', error)
      throw error
    }
  },

  // 取得議題的所有貼文
  async getAllPosts(topicId: string | number): Promise<DiscoursePost[]> {
    const allPosts: DiscoursePost[] = []
    let page = 0

    try {
      while (true) {
        const response = await cachedGet(`/t/${topicId}.json?include_raw=1&page=${page}`)
        const posts: DiscoursePost[] = response.data.post_stream.posts

        if (posts && posts.length > 0) {
          allPosts.push(...posts)
          page++
        } else {
          break
        }
      }

      return allPosts
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      throw error
    }
  },

  // 取得議題統計資訊
  async getTopicStats(topicId: string | number): Promise<TopicStats> {
    try {
      const response = await cachedGet(`/t/${topicId}.json`)
      return {
        views: response.data.views,
        posts_count: response.data.posts_count,
        participant_count: response.data.participant_count,
        last_posted_at: response.data.last_posted_at,
        created_at: response.data.created_at
      }
    } catch (error) {
      console.error('Failed to fetch topic stats:', error)
      throw error
    }
  },

  // 格式化議題資料
  formatTopicData(topicData: DiscourseTopic): FormattedTopicData {
    const firstPost = topicData.post_stream.posts[0]
    const lastPost = topicData.post_stream.posts.slice(-1)[0]

    // 解析第一篇貼文的 raw 內容
    const parseFirstPost = (raw: string): ParsedPostData => {
      const sloganMatch = /slogan *: *(.*)/g.exec(raw)
      const ownerMatch = /@(\w+)/g.exec(raw)
      const coverMatch = /cover *: *(.*)/g.exec(raw)

      return {
        slogan: sloganMatch ? sloganMatch[1] : '',
        owner: ownerMatch ? ownerMatch[1] : '',
        cover: coverMatch ? coverMatch[1] : ''
      }
    }

    const parsedData = parseFirstPost(firstPost.raw)

    return {
      id: topicData.id,
      title: topicData.title.split(' ')[0],
      routeName: topicData.title.split(' ')[1],
      status: firstPost.id === lastPost.id ? '即將開始' : lastPost.raw.split(' ')[0],
      slogan: parsedData.slogan,
      owner: parsedData.owner,
      cover: parsedData.cover,
      tags: topicData.tags,
      views: topicData.views,
      posts_count: topicData.posts_count,
      last_posted_at: topicData.last_posted_at,
      created_at: topicData.created_at
    }
  },

  // 清除快取
  clearCache,

  // 取得 Discourse 伺服器 URL
  getDiscourseUrl(): string {
    return DISCOURSE_BASE_URL
  }
}

export default discourseAPI

// 導出類型供其他文件使用
export type {
  DiscoursePost,
  DiscourseTopic,
  DiscourseTopicList,
  DiscourseSearchResult,
  TopicStats,
  FormattedTopicData,
  ParsedPostData,
  DiscourseAPI
}
