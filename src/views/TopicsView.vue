<template>
  <!-- Hero Section -->
  <section class="bg-black text-white py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ $t('topics.title') }}</h1>
      <p class="text-xl max-w-3xl mb-8">
        {{ $t('topics.description') }}
      </p>

      <!-- Search Bar -->
      <div class="max-w-md mx-auto lg:mx-0">
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
    </div>
  </section>

  <!-- Topics List -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <!-- Search Results Header -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold">
          <span class="title-underline">{{ $t('topics.list.title') }}</span>
        </h2>

        <!-- Search Status -->
        <div v-if="searchQuery" class="text-sm text-gray-600">
          {{ $t('topics.search.results', { count: filteredTopics.length, query: searchQuery }) }}
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-jade-green mx-auto"></div>
        <p class="mt-4 text-gray-600">{{ $t('topics.list.loading') }}</p>
      </div>

      <!-- Topics Grid -->
      <div v-else-if="filteredTopics.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="topic in filteredTopics"
          :key="topic.id"
          class="card p-6 relative hover:shadow-lg transition-shadow"
        >
          <!-- Status Badge -->
          <div class="absolute top-4 right-4">
            <span
              class="px-3 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(topic.status)"
            >
              {{ getStatusText(topic.status) }}
            </span>
          </div>

          <!-- Topic Cover -->
          <div
            v-if="topic.cover"
            class="w-full h-48 bg-cover bg-center rounded-lg mb-4"
            :style="{ backgroundImage: `url(${topic.cover})` }"
          ></div>
          <div v-else class="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <IconWrapper name="message-circle" :size="48" color="#9CA3AF" />
          </div>

          <!-- Topic Content -->
          <div class="mb-4">
            <h3 class="text-xl font-bold mb-2">
              <router-link
                :to="`/topics/${topic.id}`"
                class="hover:text-jade-green transition"
              >
                {{ topic.title }}
              </router-link>
            </h3>

            <p v-if="topic.slogan" class="text-gray-600 mb-3">
              {{ topic.slogan }}
            </p>

            <!-- Topic Meta -->
            <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
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
            <div v-if="topic.tags && topic.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tag in topic.tags"
                :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Action Button -->
          <div class="mt-auto">
            <router-link
              :to="`/topics/${topic.routeName || topic.id}`"
              class="btn-primary w-full text-center"
            >
              {{ $t('topics.detail.participate') }}
            </router-link>
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
          class="mt-4 px-4 py-2 bg-jade-green text-white rounded-lg hover:bg-jade-green/80 transition-colors"
        >
          {{ $t('topics.search.clearSearch') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import discourseApi from '../lib/discourse'

const { t, locale } = useI18n()

// 響應式資料
const topics = ref([])
const loading = ref(true)
const searchQuery = ref('')

// 當前語言
const currentLanguage = computed(() => locale.value)

// 篩選議題
const filteredTopics = computed(() => {
  if (!searchQuery.value.trim()) {
    return topics.value.filter(topic => topic.title !== '網站基本設定')
  }

  const query = searchQuery.value.toLowerCase().trim()

  return topics.value.filter(topic => {

    if (topic.title === '網站基本設定') {
      return false
    }

    // 搜尋標題
    if (topic.title && topic.title.toLowerCase().includes(query)) {
      return true
    }

    // 搜尋說明
    if (topic.slogan && topic.slogan.toLowerCase().includes(query)) {
      return true
    }

    // 搜尋狀態
    if (topic.status && topic.status.toLowerCase().includes(query)) {
      return true
    }

    // 搜尋標籤
    if (topic.tags && topic.tags.some(tag => tag.toLowerCase().includes(query))) {
      return true
    }

    // 搜尋作者
    if (topic.owner && topic.owner.toLowerCase().includes(query)) {
      return true
    }

    return false
  })
})

// 載入議題
const loadTopics = async () => {
  try {
    loading.value = true

    // 獲取議題列表
    const topicsData = await discourseApi.getAllTopics()

    // 處理每個議題的詳細資訊
    const processedTopics = await Promise.all(
      topicsData.map(async (topic) => {
        try {
          // 獲取議題詳細資訊
          const topicDetail = await discourseApi.getTopic(topic.id)
          return discourseApi.formatTopicData(topicDetail)
        } catch (error) {
          console.error(`Error processing topic ${topic.id}:`, error)
          // 返回基本資訊
          return {
            id: topic.id,
            title: topic.title,
            status: '準備中',
            views: topic.views || 0,
            posts_count: topic.posts_count || 0,
            last_posted_at: topic.last_posted_at,
            created_at: topic.created_at
          }
        }
      })
    )

    topics.value = processedTopics
  } catch (error) {
    console.error('Error loading topics:', error)
  } finally {
    loading.value = false
  }
}

// 取得狀態樣式
const getStatusClass = (status) => {
  const statusMap = {
    '準備中': 'bg-gray-100 text-gray-800',
    '即將開始': 'bg-yellow-100 text-yellow-800',
    '意見徵集': 'bg-blue-100 text-blue-800',
    '研擬草案': 'bg-orange-100 text-orange-800',
    '討論中': 'bg-green-100 text-green-800',
    '投票中': 'bg-purple-100 text-purple-800',
    '已完成': 'bg-gray-100 text-gray-800'
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

// 取得狀態文字
const getStatusText = (status) => {
  const statusKey = Object.keys(t('topics.status')).find(key =>
    t(`topics.status.${key}`) === status
  )
  return statusKey ? t(`topics.status.${statusKey}`) : status
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(currentLanguage.value)
}

// 清除搜尋
const clearSearch = () => {
  searchQuery.value = ''
}

// 組件掛載時載入資料
onMounted(() => {
  loadTopics()
})
</script>

<style scoped>
.title-underline {
  position: relative;
}

.title-underline::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #D80000;
}
</style>
