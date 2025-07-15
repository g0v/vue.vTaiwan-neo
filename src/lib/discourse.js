import axios from 'axios'

const DISCOURSE_BASE_URL = 'https://talk.vtaiwan.tw'

// 創建 axios 實例
const discourseApi = axios.create({
  baseURL: DISCOURSE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 快取機制
const cache = new Map()

// 帶快取的 GET 請求
const cachedGet = async (url, options = {}) => {
  const cacheKey = url + JSON.stringify(options)

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
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
const clearCache = (url) => {
  if (url) {
    const keysToDelete = Array.from(cache.keys()).filter(key => key.startsWith(url))
    keysToDelete.forEach(key => cache.delete(key))
  } else {
    cache.clear()
  }
}

export default {
  // 取得所有議題
  async getAllTopics(categoryUri = '/c/meta-data.json') {
    try {
      const response = await cachedGet(categoryUri)
      const topics = response.data.topic_list.topics.slice(1) // 跳過第一個
      return topics
    } catch (error) {
      console.error('Failed to fetch topics:', error)
      throw error
    }
  },

  // 取得特定議題詳細資訊
  async getTopic(topicId) {
    try {
      const response = await cachedGet(`/t/${topicId}.json?include_raw=1`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch topic:', error)
      throw error
    }
  },

  // 取得特定分類的討論
  async getCategoryDiscussion(category) {
    try {
      const response = await cachedGet(`/c/${category}/l/latest.json`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch category discussion:', error)
      throw error
    }
  },

  // 搜尋特定分類的內容
  async searchTopics(category, query = '') {
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
  async getAllPosts(topicId) {
    const allPosts = []
    let page = 0

    try {
      while (true) {
        const response = await cachedGet(`/t/${topicId}.json?include_raw=1&page=${page}`)
        const posts = response.data.post_stream.posts

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
  async getTopicStats(topicId) {
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
  formatTopicData(topicData) {
    const firstPost = topicData.post_stream.posts[0]
    const lastPost = topicData.post_stream.posts.slice(-1)[0]

    // 解析第一篇貼文的 raw 內容
    const parseFirstPost = (raw) => {
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
  getDiscourseUrl() {
    return DISCOURSE_BASE_URL
  }
}
