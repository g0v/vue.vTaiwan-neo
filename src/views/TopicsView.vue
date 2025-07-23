<template>
  <!-- Hero Section - 更簡潔的設計 -->
  <section class="bg-black text-white py-8">
    <div class="container mx-auto px-2">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ $t('topics.title') }}</h1>
        <p class="text-lg opacity-90 mb-6">
          {{ $t('topics.description') }}
        </p>

        <!-- 搜尋和篩選區域 -->
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <!-- 搜尋欄位 -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('topics.search.placeholder')"
                class="w-full px-4 py-3 pl-12 pr-12 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-green"
              />
              <IconWrapper
                name="search"
                :size="20"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IconWrapper name="x" :size="16" />
              </button>
            </div>
          </div>

          <!-- 排序選項 -->
          <div class="flex gap-2">
            <button
              @click="sortBy = 'latest'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                                 sortBy === 'latest'
                   ? 'bg-white text-black'
                   : 'bg-white/20 text-white hover:bg-white/30'
              ]"
            >
              {{ $t('topics.sort.latest') }}
            </button>
            <button
              @click="sortBy = 'participants'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                                 sortBy === 'participants'
                   ? 'bg-white text-black'
                   : 'bg-white/20 text-white hover:bg-white/30'
              ]"
            >
              {{ $t('topics.sort.participants') }}
            </button>
            <button
              @click="sortBy = 'views'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                                 sortBy === 'views'
                   ? 'bg-white text-black'
                   : 'bg-white/20 text-white hover:bg-white/30'
              ]"
            >
              {{ $t('topics.sort.views') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

    <!-- 進度篩選器 - 圓圈連接線設計 -->
  <div class="bg-white border-b border-gray-200 py-8">
    <div class="container mx-auto px-2">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-center items-center">
          <div class="flex items-center space-x-8 md:space-x-12">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex flex-col items-center cursor-pointer group"
              @click="handleStepClick(index)"
            >
              <!-- 圓圈 -->
              <div
                :class="[
                  'relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300',
                  step.active || step.current
                    ? 'bg-democratic-red text-white shadow-md'
                    : getStepColor(index)
                ]"
              >
                {{ index + 1 }}
                <!-- 連接線 -->
                <div
                  v-if="index < steps.length - 1"
                  :class="[
                    'absolute left-full top-1/2 -translate-y-1/2 h-0.5 w-8 md:w-12 transition-colors duration-300',
                    step.active ? 'bg-democratic-red' : getStepLineColor(index)
                  ]"
                ></div>
              </div>
              <!-- 文字標籤 -->
              <span
                :class="[
                  'mt-3 text-sm md:text-base font-medium text-center transition-colors duration-300',
                  step.active || step.current ? 'text-democratic-red' : getStepTextColor(index)
                ]"
              >
                {{ step.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 議題列表 - 新的卡片設計 -->
  <section class="py-8">
    <div class="container mx-auto px-2">
      <div class="max-w-7xl mx-auto">
        <!-- 結果統計 -->
        <div class="flex justify-between items-center mb-6">
          <div class="text-gray-600">
            {{ $t('topics.list.found', { count: filteredTopics.length }) }}
          </div>
          <div class="text-sm text-gray-500">
            {{ $t('topics.list.lastUpdated') }}: {{ lastUpdated }}
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
                     <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-democratic-red mx-auto"></div>
          <p class="mt-4 text-gray-600">{{ $t('topics.list.loading') }}</p>
        </div>

                 <!-- Topics Grid - 網格佈局，每行六個 -->
         <div v-else-if="filteredTopics.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3">
           <div
             v-for="topic in filteredTopics"
             :key="topic.id"
             class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer h-48 flex flex-col"
             @click="goToTopic(topic)"
           >
                         <!-- 標題和狀態 -->
             <div class="flex items-start justify-between mb-2">
               <h3 class="text-sm font-semibold text-gray-900 truncate flex-1">
                 {{ topic.title }}
               </h3>
               <span
                 :class="[
                   'px-2 py-1 text-xs font-medium rounded-full ml-2',
                   getStatusColor(topic.status)
                 ]"
               >
                 {{ topic.status }}
               </span>
             </div>

             <!-- 描述 -->
             <p v-if="topic.slogan" class="text-gray-600 text-xs mb-3 line-clamp-3 flex-1">
               {{ topic.slogan }}
             </p>

             <!-- 參與度指標 -->
             <div class="flex items-center gap-3 text-xs text-gray-500 mb-2">
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
             <div class="flex items-center justify-between text-xs text-gray-400 mt-auto">
               <div class="flex items-center gap-1">
                 <IconWrapper name="calendar" :size="10" />
                 <span>{{ formatDate(topic.created_at) }}</span>
               </div>
               <div class="flex items-center gap-1">
                 <button
                   @click.stop="shareTopic(topic)"
                   class="p-1 text-gray-400 hover:text-democratic-red transition-colors"
                   :title="$t('topics.actions.share')"
                 >
                   <IconWrapper name="share-2" :size="12" />
                 </button>
                 <button
                   @click.stop="bookmarkTopic(topic)"
                   class="p-1 text-gray-400 hover:text-democratic-red transition-colors"
                   :title="$t('topics.actions.bookmark')"
                 >
                   <IconWrapper name="bookmark" :size="12" />
                 </button>
               </div>
             </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <IconWrapper
            :name="searchQuery ? 'search' : 'message-circle'"
            :size="64"
            color="#9CA3AF"
            class="mx-auto mb-4"
          />
          <p class="text-gray-500 text-lg">
            {{ searchQuery ? $t('topics.search.noResults') : $t('topics.list.empty') }}
          </p>
          <button
            v-if="searchQuery"
            @click="clearSearch"
                         class="mt-4 px-6 py-2 bg-democratic-red text-white rounded-lg hover:bg-democratic-red/80 transition-colors"
          >
            {{ $t('topics.search.clearSearch') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import discourseApi from '../lib/discourse'

const router = useRouter()
const { t, locale } = useI18n()

// 響應式資料
const topics = ref([])
const loading = ref(true)
const searchQuery = ref('')
const sortBy = ref('latest')
const lastUpdated = ref('')

const steps = ref([
  {
    title: '即將開始',
    shortTitle: '即將',
    active: false,
    current: false
  },
  {
    title: '意見徵集',
    shortTitle: '徵集',
    active: false,
    current: false
  },
  {
    title: '研擬草案',
    shortTitle: '草案',
    active: false,
    current: false
  },
  {
    title: '送交院會',
    shortTitle: '院會',
    active: false,
    current: false
  },
  {
    title: '歷史案件',
    shortTitle: '歷史',
    active: false,
    current: false
  }
])

// 當前語言
const currentLanguage = computed(() => locale.value)

// 篩選議題
const filteredTopics = computed(() => {
  let filtered = topics.value

  // 搜尋篩選
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(topic =>
      topic.title.toLowerCase().includes(query) ||
      topic.slogan?.toLowerCase().includes(query) ||
      topic.status.toLowerCase().includes(query)
    )
  }

  // 進度篩選
  const activeSteps = steps.value.filter(step => step.active || step.current)
  if (activeSteps.length > 0) {
    const activeStatuses = activeSteps.map(step => step.title)
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

// 獲取步驟圓圈顏色
const getStepColor = (index) => {
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
const getStepLineColor = (index) => {
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
const getStepTextColor = (index) => {
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
const getStatusColor = (status) => {
  const colorMap = {
    '即將開始': 'bg-yellow-100 text-yellow-800',
    '意見徵集': 'bg-blue-100 text-blue-800',
    '研擬草案': 'bg-orange-100 text-orange-800',
    '送交院會': 'bg-green-100 text-green-800',
    '歷史案件': 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 清除搜尋
const clearSearch = () => {
  searchQuery.value = ''
}

// 處理步驟點擊
const handleStepClick = (index) => {
  // 重設所有步驟
  steps.value.forEach((step, i) => {
    step.active = i === index
    step.current = i === index
  })
}

// 前往議題詳情
const goToTopic = (topic) => {
  router.push(`/topic/${topic.routeName}`)
}

// 分享議題
const shareTopic = (topic) => {
  if (navigator.share) {
    navigator.share({
      title: topic.title,
      text: topic.slogan,
      url: `${window.location.origin}/topic/${topic.routeName}`
    })
  } else {
    // 複製連結到剪貼簿
    const url = `${window.location.origin}/topic/${topic.routeName}`
    navigator.clipboard.writeText(url)
    // 這裡可以加入提示訊息
  }
}

// 書籤議題
const bookmarkTopic = (topic) => {
  // 實作書籤功能
  console.log('Bookmark topic:', topic.title)
}

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
})
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
