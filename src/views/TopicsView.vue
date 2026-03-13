<template>
  <!-- Hero Section - 更簡潔的設計 -->
  <section class="bg-black py-8 text-white">
    <div class="container mx-auto px-2">
      <div class="mx-auto max-w-7xl">
        <h1 class="mb-4 text-3xl font-bold md:text-4xl">{{ $t('topics.title') }}</h1>
        <p class="mb-6 text-lg opacity-90">
          {{ $t('topics.description') }}
        </p>
      </div>
    </div>
  </section>

  <!-- 近三個月的議題 Section -->
  <section class="bg-gray-50 py-12">
    <div class="container mx-auto px-2">
      <div class="mx-auto max-w-7xl">
        <h2 class="mb-3 text-left text-2xl font-bold md:text-3xl">{{ $t('topics.recentTitle') }}</h2>
        <p class="mb-8 max-w-2xl text-left text-gray-600">
          {{ $t('topics.recentDesc') }}
        </p>

        <!-- 近三個月議題展示 -->
        <div v-if="loading" class="py-8 text-center">
          <IconWrapper name="calendar" :size="48" color="#9CA3AF" class="mx-auto mb-4" />
          <p class="text-gray-500">{{ $t('common.loading') }}</p>
        </div>
        <div v-else-if="recentTopics.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="topic in recentTopics" :key="topic.id" class="max-w-sm cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg" @click="goToTopic(topic)">
            <!-- Status Badge -->
            <div class="mb-4 flex items-start justify-between">
              <span class="rounded-full px-3 py-1 text-xs font-medium" :class="getStatusColor(topic.status)">
                {{ t('topics.steps.' + getStatusText(topic.status)) }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatDate(topic.last_posted_at || topic.created_at) }}
              </span>
            </div>

            <!-- Topic Cover -->
            <div v-if="topic.cover" class="mb-4 h-32 w-full rounded-lg bg-cover bg-center" :style="{ backgroundImage: `url(${topic.cover})` }"></div>
            <div v-else class="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-gray-100">
              <IconWrapper name="message-circle" :size="32" color="#9CA3AF" />
            </div>

            <!-- Topic Content -->
            <h3 class="mb-2 line-clamp-2 text-lg font-bold">
              {{ topic.title }}
            </h3>

            <p v-if="topic.slogan" class="mb-4 line-clamp-2 text-sm text-gray-600">
              {{ topic.slogan }}
            </p>

            <!-- Topic Meta -->
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <IconWrapper name="users" :size="14" />
                <span>{{ topic.participant_count || 0 }}</span>
              </div>
              <div class="flex items-center gap-1">
                <IconWrapper name="message-circle" :size="14" />
                <span>{{ topic.posts_count || 0 }}</span>
              </div>
              <div class="flex items-center gap-1">
                <IconWrapper name="eye" :size="14" />
                <span>{{ topic.views || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 如果沒有近期議題 -->
        <div v-else class="py-8 text-center">
          <IconWrapper name="calendar" :size="48" color="#9CA3AF" class="mx-auto mb-4" />
          <p class="text-gray-500">{{ $t('topics.noRecent') }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 搜尋和篩選區域 -->
  <div class="mb-8 rounded-lg bg-white p-8 shadow-md">
    <div class="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
      <!-- 搜尋欄位 -->
      <div class="max-w-md flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('topics.search.placeholder')"
            class="w-full min-w-64 rounded-lg border border-gray-300 bg-white px-4 py-3 pl-12 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-jade-green"
          />
          <IconWrapper name="search" :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400" />
          <button v-if="searchQuery" @click="clearSearch" class="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600">
            <IconWrapper name="x" :size="16" />
          </button>
        </div>
      </div>

      <!-- 排序選項 -->
      <div class="flex w-full items-center justify-start gap-2 lg:justify-between">
        <div class="flex gap-2">
          <button @click="sortBy = 'latest'" :class="['rounded-lg px-4 py-2 font-medium transition-colors', sortBy === 'latest' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200']">
            {{ $t('topics.sort.latest') }}
          </button>
          <button
            @click="sortBy = 'participants'"
            :class="['rounded-lg px-4 py-2 font-medium transition-colors', sortBy === 'participants' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200']"
          >
            {{ $t('topics.sort.participants') }}
          </button>
          <button @click="sortBy = 'views'" :class="['rounded-lg px-4 py-2 font-medium transition-colors', sortBy === 'views' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200']">
            {{ $t('topics.sort.views') }}
          </button>
        </div>
        <button
          @click="toggleBookmarksOnly"
          :class="[
            'ml-2 flex items-center gap-1 rounded-lg px-4 py-2 font-medium transition-colors',
            showBookmarksOnly ? 'bg-democratic-red text-white shadow' : 'bg-gray-100 text-black hover:bg-gray-200',
          ]"
        >
          <IconWrapper name="bookmark" :size="18" :class="showBookmarksOnly ? 'fill-white' : 'fill-none'" />
          <span>{{ $t('topics.bookmarks.myBookmarks') || '我的書籤' }}</span>
        </button>
      </div>
      <!-- 下拉選單 -->
      <div class="relative mx-auto mt-4 w-64 lg:mt-0">
        <select
          v-model="selectedStep"
          @change="handleStepChange"
          class="w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-10 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
        >
          <option value="">{{ $t('topics.steps.all') }}</option>
          <option v-for="(step, index) in steps" :key="index" :value="index">
            {{ $t('topics.steps.' + step.key) }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform">
          <IconWrapper name="chevron-down" :size="20" />
        </span>
      </div>
    </div>
  </div>

  <!-- 議題列表 - 新的卡片設計 -->
  <section class="py-8">
    <div class="container mx-auto px-2">
      <div class="mx-auto max-w-7xl">
        <!-- 結果統計 -->
        <div class="mb-6 flex items-center justify-between">
          <div class="text-gray-600">
            {{ $t('topics.list.found', { count: filteredTopics.length }) }}
          </div>
          <div class="text-sm text-gray-500">{{ $t('topics.list.lastUpdated') }}: {{ lastUpdated }}</div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-12 text-center">
          <div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-democratic-red"></div>
          <p class="mt-4 text-gray-600">{{ $t('topics.list.loading') }}</p>
        </div>

        <div v-else-if="filteredTopics.length > 0">
          <!-- Topics Grid big img 大圖版本 -->
          <div v-if="filteredTopicsBigImg.length > 0" class="mb-6 flex flex-wrap justify-center gap-6">
            <div v-for="topic in filteredTopicsBigImg" :key="topic.id" class="card relative w-full max-w-sm p-6 transition-shadow hover:shadow-lg md:max-w-sm lg:max-w-md">
              <!-- Status Badge -->
              <div class="absolute right-[-8px] top-[-14px] z-10">
                <span class="rounded-full px-3 py-1 text-xs font-medium" :class="getStatusColor(topic.status)">
                  {{ t('topics.steps.' + getStatusText(topic.status)) }}
                </span>
              </div>

              <!-- Topic Cover -->
              <div v-if="topic.cover" class="mb-4 h-48 w-full rounded-lg bg-cover bg-center" :style="{ backgroundImage: `url(${topic.cover})` }"></div>
              <div v-else class="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gray-200">
                <IconWrapper name="message-circle" :size="48" color="#9CA3AF" />
              </div>

              <!-- Topic Content -->
              <div class="mb-4">
                <h3 class="mb-2 text-xl font-bold">
                  <router-link :to="`/topic/${topic.routeName}`" class="transition hover:text-jade-green">
                    {{ topic.title }}
                  </router-link>
                </h3>

                <p v-if="topic.slogan" class="mb-3 text-gray-600">
                  {{ topic.slogan }}
                </p>

                <!-- Topic Meta -->
                <div class="mb-3 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div class="flex items-center gap-1">
                    <IconWrapper name="eye" :size="16" />
                    <span>{{ topic.views || 0 }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <IconWrapper name="message-circle" :size="16" />
                    <span>{{ topic.posts_count || 0 }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <IconWrapper name="calendar" :size="16" />
                    <span>{{ formatDate(topic.last_posted_at || topic.created_at) }}</span>
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="topic.tags && topic.tags.length > 0" class="mb-3 flex flex-wrap gap-2">
                  <span v-for="tag in topic.tags" :key="tag" class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Action Button -->
              <div class="mt-auto">
                <router-link :to="`/topic/${topic.routeName || topic.id}`" class="btn-primary w-full text-center">
                  {{ $t('topics.detail.participate') }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- Topics Grid small img - 網格佈局，每行六個 -->
          <div v-if="filteredTopicsSmallImg.length > 0" class="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
            <div
              v-for="topic in filteredTopicsSmallImg"
              :key="topic.id"
              class="h-34 relative flex cursor-pointer flex-row border-b border-gray-200 bg-white px-2 py-4 transition-all duration-200 hover:shadow-md md:h-60 md:flex-col md:rounded-lg md:border md:p-4"
              @click="goToTopic(topic)"
            >
              <!-- Status Badge -->
              <div class="absolute right-[-8px] top-[-14px] z-10">
                <span class="rounded-full px-3 py-1 text-xs font-medium" :class="getStatusColor(topic.status)">
                  {{ t('topics.steps.' + getStatusText(topic.status)) }}
                </span>
              </div>

              <!-- 小圖版本 -->
              <div class="mr-2 flex items-center justify-center md:mr-0 md:items-start md:justify-start md:pb-4">
                <div v-if="topic.cover" class="h-16 w-16 rounded-lg bg-cover bg-center" :style="{ backgroundImage: `url(${topic.cover})` }"></div>
                <div v-else class="h-16 w-16 rounded-lg bg-cover bg-center">
                  <IconWrapper name="image" :size="16" class="text-gray-400" />
                </div>
              </div>

              <div class="flex max-w-[calc(100%-4rem)] flex-1 flex-col md:max-w-none">
                <!-- 標題 -->
                <div class="mb-2 flex items-start justify-between">
                  <h3 class="flex-1 truncate text-sm font-semibold text-gray-900">
                    {{ topic.title }}
                  </h3>
                </div>

                <!-- 描述 -->
                <p v-if="topic.slogan" class="mb-3 truncate text-sm text-gray-600">
                  {{ topic.slogan }}
                </p>

                <!-- 參與度指標 -->
                <div class="mb-2 flex items-center gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1">
                    <IconWrapper name="users" :size="12" />
                    <span>{{ topic.participant_count || 0 }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <IconWrapper name="message-circle" :size="12" />
                    <span>{{ topic.posts_count || 0 }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <IconWrapper name="eye" :size="12" />
                    <span>{{ topic.views || 0 }}</span>
                  </div>
                </div>

                <!-- 時間資訊 -->
                <div class="mt-auto flex items-center justify-between text-xs text-gray-400">
                  <div class="flex items-center gap-1">
                    <IconWrapper name="calendar" :size="10" />
                    <span>{{ formatDate(topic.created_at) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button @click.stop="shareTopic(topic)" class="p-1 text-gray-400 transition-colors hover:text-democratic-red" :title="$t('topics.actions.share')">
                      <IconWrapper name="share-2" :size="12" />
                    </button>
                    <button @click.stop="bookmarkTopic(topic)" class="p-1 transition-colors" :title="$t('topics.actions.bookmark')">
                      <IconWrapper name="bookmark" :size="12" :class="isBookmarked(topic) ? 'fill-democratic-red text-democratic-red' : 'text-gray-400 hover:text-democratic-red'" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="py-12 text-center">
          <IconWrapper :name="searchQuery ? 'search' : 'message-circle'" :size="64" color="#9CA3AF" class="mx-auto mb-4" />
          <p class="text-lg text-gray-500">
            {{ searchQuery ? $t('topics.search.noResults') : $t('topics.list.empty') }}
          </p>
          <button v-if="searchQuery" @click="clearSearch" class="mt-4 rounded-lg bg-democratic-red px-6 py-2 text-white transition-colors hover:bg-democratic-red/80">
            {{ $t('topics.search.clearSearch') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import IconWrapper from '../components/IconWrapper.vue'
import discourseApi from '../lib/discourse'

const router = useRouter()
const { t, locale } = useI18n()

useHead({
  title: t('topics.title') + ' | vTaiwan',
  meta: [
    {
      property: 'og:title',
      content: t('topics.title') + ' | vTaiwan',
    },
    {
      property: 'og:description',
      content: t('topics.description'),
    },
    {
      property: 'og:url',
      content: 'https://vtaiwan.tw/topics',
    },
    {
      property: 'twitter:title',
      content: t('topics.title') + ' | vTaiwan',
    },
    {
      property: 'twitter:description',
      content: t('topics.description'),
    },
  ],
})

// 響應式資料
const topics = ref([])
const loading = ref(true)
const searchQuery = ref('')
const sortBy = ref('latest')
const lastUpdated = ref('')

const steps = ref([
  {
    key: '即將開始',
    shortKey: '即將',
    active: false,
    current: false,
  },
  {
    key: '意見徵集',
    shortKey: '徵集',
    active: false,
    current: false,
  },
  {
    key: '研擬草案',
    shortKey: '草案',
    active: false,
    current: false,
  },
  {
    key: '送交院會',
    shortKey: '院會',
    active: false,
    current: false,
  },
  {
    key: '歷史案件',
    shortKey: '歷史',
    active: false,
    current: false,
  },
])

const bookmarkedIds = ref([])
const showBookmarksOnly = ref(false)

const selectedStep = ref('')

const toggleBookmarksOnly = () => {
  showBookmarksOnly.value = !showBookmarksOnly.value
}

// 篩選近三個月的議題
const recentTopics = computed(() => {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  return topics.value
    .filter(topic => {
      // 過濾掉網站基本設定
      if (topic.title === '網站基本設定') return false

      // 使用 last_posted_at 或 created_at 作為判斷依據
      const topicDate = new Date(topic.last_posted_at || topic.created_at)
      return topicDate >= threeMonthsAgo
    })
    .sort((a, b) => {
      // 按更新時間排序，最新的在前
      const dateA = new Date(a.last_posted_at || a.created_at)
      const dateB = new Date(b.last_posted_at || b.created_at)
      return dateB - dateA
    })
    .slice(0, 6) // 限制顯示最多6個議題
})

// 當前語言
const currentLanguage = computed(() => locale.value)

// 篩選議題
const filteredTopics = computed(() => {
  let filtered = topics.value.filter(topic => topic.title !== '網站基本設定')

  // 書籤過濾
  if (showBookmarksOnly.value) {
    filtered = filtered.filter(topic => bookmarkedIds.value.includes(topic.id))
  }

  // 搜尋篩選
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(topic => topic.title.toLowerCase().includes(query) || topic.slogan?.toLowerCase().includes(query) || topic.status.toLowerCase().includes(query))
  }

  // 下拉選單狀態過濾
  if (selectedStep.value !== '') {
    const stepKey = steps.value[selectedStep.value]?.key
    if (stepKey) {
      filtered = filtered.filter(topic => topic.status === stepKey)
    }
  }

  // 進度篩選（原本圈圈的）
  const activeSteps = steps.value.filter(step => step.active || step.current)
  if (activeSteps.length > 0) {
    const activeStatuses = activeSteps.map(step => step.key)
    filtered = filtered.filter(topic => activeStatuses.includes(topic.status))
  }

  // 排序
  switch (sortBy.value) {
    case 'participants':
      filtered.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))
      break
    case 'views':
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    case 'latest':
    default:
      filtered.sort((a, b) => new Date(b.last_posted_at || b.created_at) - new Date(a.last_posted_at || a.created_at))
      break
  }

  return filtered
})

const filteredTopicsBigImg = computed(() => {
  return filteredTopics.value.filter(topic => topic.status === '即將開始' || !topic.status)
})

const filteredTopicsSmallImg = computed(() => {
  return filteredTopics.value.filter(topic => topic.status !== '即將開始')
})

// 獲取步驟圓圈顏色
const getStepColor = index => {
  const activeIndex = steps.value.findIndex(step => step.active || step.current)
  if (activeIndex === -1) {
    return 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
  }

  if (index < activeIndex) {
    return 'bg-green-200 text-green-700 group-hover:bg-green-300'
  } else if (index > activeIndex) {
    return 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
  } else {
    return 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
  }
}

// 獲取步驟連接線顏色
const getStepLineColor = index => {
  const activeIndex = steps.value.findIndex(step => step.active || step.current)
  if (activeIndex === -1) {
    return 'bg-gray-300'
  }

  if (index < activeIndex) {
    return 'bg-green-300'
  } else {
    return 'bg-gray-300'
  }
}

// 獲取步驟文字顏色
const getStepTextColor = index => {
  const activeIndex = steps.value.findIndex(step => step.active || step.current)
  if (activeIndex === -1) {
    return 'text-gray-600 group-hover:text-gray-800'
  }

  if (index < activeIndex) {
    return 'text-green-600 group-hover:text-green-700'
  } else if (index > activeIndex) {
    return 'text-gray-600 group-hover:text-gray-800'
  } else {
    return 'text-gray-600 group-hover:text-gray-800'
  }
}

// 獲取狀態顏色
const getStatusColor = status => {
  const colorMap = {
    即將開始: 'bg-yellow-100 text-yellow-800',
    意見徵集: 'bg-blue-100 text-blue-800',
    研擬草案: 'bg-orange-100 text-orange-800',
    送交院會: 'bg-green-100 text-green-800',
    歷史案件: 'bg-gray-100 text-gray-800',
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

// 獲取狀態文字
const getStatusText = status => {
  const textMap = {
    即將開始: '即將開始',
    意見徵集: '意見徵集',
    研擬草案: '研擬草案',
    送交院會: '送交院會',
    歷史案件: '歷史案件',
  }
  return textMap[status] || status
}

// 格式化日期
const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 清除搜尋
const clearSearch = () => {
  searchQuery.value = ''
}

// 處理步驟點擊
const handleStepClick = index => {
  // 重設所有步驟
  steps.value.forEach((step, i) => {
    step.active = i === index
    step.current = i === index
  })
}

// 前往議題詳情
const goToTopic = topic => {
  router.push(`/topic/${topic.routeName}`)
}

// 分享議題
const shareTopic = topic => {
  if (navigator.share) {
    navigator.share({
      title: topic.title,
      text: topic.slogan,
      url: `${window.location.origin}/topic/${topic.routeName}`,
    })
  } else {
    // 複製連結到剪貼簿
    const url = `${window.location.origin}/topic/${topic.routeName}`
    navigator.clipboard.writeText(url)
    // 這裡可以加入提示訊息
  }
}

// 讀取 localStorage 書籤
const loadBookmarks = () => {
  const stored = localStorage.getItem('bookmarkedTopics')
  if (stored) {
    try {
      bookmarkedIds.value = JSON.parse(stored)
    } catch {
      bookmarkedIds.value = []
    }
  } else {
    bookmarkedIds.value = []
  }
}

// 儲存到 localStorage
const saveBookmarks = () => {
  localStorage.setItem('bookmarkedTopics', JSON.stringify(bookmarkedIds.value))
}

// 判斷是否已書籤
const isBookmarked = topic => {
  return bookmarkedIds.value.includes(topic.id)
}

// 書籤議題
const bookmarkTopic = topic => {
  const idx = bookmarkedIds.value.indexOf(topic.id)
  if (idx === -1) {
    bookmarkedIds.value.push(topic.id)
  } else {
    bookmarkedIds.value.splice(idx, 1)
  }
  saveBookmarks()
}

// 監聽 topics 載入時同步書籤
watch(topics, () => {
  loadBookmarks()
})

// 載入議題
const loadTopics = async () => {
  try {
    loading.value = true

    // 獲取議題列表
    const allTopics = await discourseApi.getAllTopics()

    // 處理每個議題的詳細資訊
    const processedTopics = []
    for (const topic of allTopics) {
      try {
        // 獲取議題詳細資訊
        const topicData = await discourseApi.getTopic(topic.id)
        const formattedTopic = discourseApi.formatTopicData(topicData)
        processedTopics.push(formattedTopic)
      } catch (error) {
        console.error('Error processing topic:', topic.id, error)
      }
    }

    topics.value = processedTopics
    lastUpdated.value = new Date().toLocaleString('zh-TW')
  } catch (error) {
    console.error('Error loading topics:', error)
  } finally {
    loading.value = false
  }
}

// 組件掛載時載入資料
onMounted(() => {
  loadTopics()
  loadBookmarks()
})

// handleStepChange 方法可選擇性保留（如有需要）
function handleStepChange() {
  // 這裡可根據需要做額外處理
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
