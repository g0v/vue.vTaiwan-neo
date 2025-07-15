<template>
  <div v-if="topic">
    <!-- Hero Section -->
    <section class="bg-black text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl relative">
          <div class="flex items-center mb-6">
            <div class="w-16 h-16 rounded-full bg-jade-green/20 flex items-center justify-center mr-6">
              <IconWrapper name="message-circle" :size="32" />
            </div>
            <div>
              <span
                class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusClass(topic.status)"
              >
                {{ getStatusText(topic.status) }}
              </span>
            </div>
          </div>

          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            {{ topic.title }}
          </h1>

          <p v-if="topic.slogan" class="text-xl text-gray-300 mb-8 max-w-3xl">
            {{ topic.slogan }}
          </p>

          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center gap-2">
              <IconWrapper name="eye" :size="16" />
              <span>{{ topic.views || 0 }} 次瀏覽</span>
            </div>
            <div class="flex items-center gap-2">
              <IconWrapper name="message-circle" :size="16" />
              <span>{{ topic.posts_count || 0 }} 則留言</span>
            </div>
            <div class="flex items-center gap-2">
              <IconWrapper name="calendar" :size="16" />
              <span>{{ formatDate(topic.last_posted_at || topic.created_at) }}</span>
            </div>
            <div v-if="topic.owner" class="flex items-center gap-2">
              <IconWrapper name="user" :size="16" />
              <span>{{ topic.owner }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Navigation Tabs -->
          <div class="flex flex-wrap gap-4 mb-8 border-b border-gray-200">
            <button
              @click="activeTab = 'timeline'"
              :class="[
                'px-6 py-3 font-medium border-b-2 transition-colors',
                activeTab === 'timeline'
                  ? 'text-jade-green border-jade-green'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              ]"
            >
              <IconWrapper name="calendar" :size="16" class="mr-2" />
              {{ $t('topics.detail.timeline') }}
            </button>
            <button
              @click="activeTab = 'discussion'"
              :class="[
                'px-6 py-3 font-medium border-b-2 transition-colors',
                activeTab === 'discussion'
                  ? 'text-jade-green border-jade-green'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              ]"
            >
              <IconWrapper name="message-circle" :size="16" class="mr-2" />
              {{ $t('topics.detail.discussion') }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Timeline Tab -->
            <div v-if="activeTab === 'timeline' && realTopicId">
              <TopicTimeline :topic-id="realTopicId" />
            </div>

            <!-- Discussion Tab -->
            <div v-if="activeTab === 'discussion' && realTopicId">
              <TopicDiscussion :topic-id="realTopicId" />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-12 text-center">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link to="/topics" class="btn-secondary">
                ← 返回議題列表
              </router-link>
              <a
                :href="`https://talk.vtaiwan.tw/t/topic/${realTopicId}`"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary"
              >
                {{ $t('topics.detail.participate') }} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- 404 頁面 -->
  <div v-else-if="!loading" class="py-16">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl font-bold mb-4">{{ $t('topics.detail.notFound') }}</h1>
      <p class="text-lg text-gray-600 mb-8">{{ $t('topics.detail.notFound') }}</p>
      <router-link to="/topics" class="btn-primary">← 返回議題列表</router-link>
    </div>
  </div>

  <!-- Loading -->
  <div v-else class="py-16">
    <div class="container mx-auto px-4 text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-jade-green mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ $t('topics.list.loading') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import TopicTimeline from '../components/TopicTimeline.vue'
import TopicDiscussion from '../components/TopicDiscussion.vue'
import discourseApi from '../lib/discourse'

const route = useRoute()
const { t, locale } = useI18n()

// 響應式資料
const topic = ref(null)
const loading = ref(true)
const activeTab = ref('timeline')
const realTopicId = ref(null) // 真正的 Discourse topic ID

// 當前語言
const currentLanguage = computed(() => locale.value)

// 議題 ID (routeName)
const topicId = computed(() => route.params.id)

// 載入議題詳情
const loadTopic = async () => {
  try {
    loading.value = true

    // 先獲取所有議題，找到對應的真正 topic ID
    const allTopics = await discourseApi.getAllTopics()

    // 根據 routeName 找到對應的議題
    const targetTopic = allTopics.find(t => {
      const routeName = t.title.split(' ')[1]
      return routeName === topicId.value
    })

    if (!targetTopic) {
      console.error('Topic not found with routeName:', topicId.value)
      topic.value = null
      return
    }

    // 使用真正的 topic ID 獲取詳細資訊
    realTopicId.value = targetTopic.id
    const topicData = await discourseApi.getTopic(targetTopic.id)
    topic.value = discourseApi.formatTopicData(topicData)

  } catch (error) {
    console.error('Error loading topic:', error)
    topic.value = null
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

// 組件掛載時載入資料
onMounted(() => {
  loadTopic()
})
</script>

<style scoped>
.tab-content {
  min-height: 400px;
}
</style>
