<template>
  <div v-if="topic">
    <!-- 進度條 -->
    <TopicProgress v-if="realTopicId" :topic-id="realTopicId" />

    <!-- 議題標題 -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            {{ topic.title }}
          </h1>
        </div>
      </div>
    </section>

    <!-- Slide 簡介區塊 -->
    <TopicSlide
      v-if="realTopicId"
      :topic-id="realTopicId"
      :show-discussion-button="showDiscussionButton"
    />

    <!-- 標籤頁區域 -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Navigation Tabs -->
          <div class="flex flex-wrap gap-4 mb-8 border-b border-gray-200 justify-center">
            <button
              @click="activeTab = 'timeline'"
              :class="[
                'px-6 py-3 font-medium border-b-2 transition-colors flex items-center',
                activeTab === 'timeline'
                  ? 'text-jade-green border-jade-green'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              ]"
            >
              <IconWrapper name="calendar" :size="16" class="mr-2" />
              <span class="hidden md:inline">{{ $t('topics.detail.timeline') }}</span>
              <span class="md:hidden">時程</span>
            </button>
            <button
              v-if="showDiscussionTab"
              @click="activeTab = 'discussion'"
              :class="[
                'px-6 py-3 font-medium border-b-2 transition-colors flex items-center',
                activeTab === 'discussion'
                  ? 'text-jade-green border-jade-green'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              ]"
            >
              <IconWrapper name="message-circle" :size="16" class="mr-2" />
              <span class="hidden md:inline">{{ $t('topics.detail.discussion') }}</span>
              <span class="md:hidden">討論</span>
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Timeline Tab -->
            <div v-if="activeTab === 'timeline' && realTopicId">
              <TopicTimeline :topic-id="realTopicId" />
            </div>

            <!-- Discussion Tab -->
            <div v-if="activeTab === 'discussion' && realTopicId && showDiscussionTab">
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

    <!-- 留言區域 -->
    <div v-if="posts.length > 0" class="mt-8">
      <h3 class="text-xl font-semibold text-gray-900 mb-6 px-4">{{ $t('topicDetail.discussion') }}</h3>

      <!-- 留言列表 -->
      <div class="space-y-6">
        <div
          v-for="post in displayedPosts"
          :key="post.id"
          class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <!-- 留言標題欄 -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <!-- 用戶頭像 -->
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <img
                  v-if="post.avatar_template"
                  :src="getAvatarUrl(post.avatar_template, 40)"
                  :alt="post.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span v-else class="text-gray-500 text-sm font-medium">
                  {{ post.name ? post.name.charAt(0).toUpperCase() : 'U' }}
                </span>
              </div>

              <!-- 用戶資訊 -->
              <div>
                <div class="font-medium text-gray-900">{{ post.name || post.username }}</div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(post.created_at) }}
                  <span v-if="post.post_number > 1" class="ml-2 text-blue-600">
                    #{{ post.post_number }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 管理員標籤 -->
            <div v-if="post.admin || post.moderator" class="flex items-center space-x-1">
              <span v-if="post.admin" class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {{ $t('topicDetail.admin') }}
              </span>
              <span v-if="post.moderator && !post.admin" class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {{ $t('topicDetail.moderator') }}
              </span>
            </div>
          </div>

          <!-- 留言內容 -->
          <div class="prose prose-sm max-w-none">
            <div v-html="post.cooked" class="text-gray-800 leading-relaxed"></div>
          </div>

          <!-- 留言統計 -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {{ post.reads || 0 }}
              </span>
              <span v-if="post.reply_count > 0" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                {{ post.reply_count }}
              </span>
            </div>

            <div v-if="post.score > 0" class="text-sm text-gray-500">
              <span class="font-medium">{{ Math.round(post.score) }}</span> 分
            </div>
          </div>
        </div>
      </div>

      <!-- 顯示更多按鈕 -->
      <div v-if="posts.length > 10 && !showAllPosts" class="mt-6 text-center">
        <button
          @click="showAllPosts = true"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {{ $t('topicDetail.showAllPosts', { count: posts.length }) }}
        </button>
      </div>

      <!-- 顯示較少按鈕 -->
      <div v-if="posts.length > 10 && showAllPosts" class="mt-6 text-center">
        <button
          @click="showAllPosts = false"
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {{ $t('topicDetail.showLess') }}
        </button>
      </div>
    </div>
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
import TopicProgress from '../components/TopicProgress.vue'
import TopicSlide from '../components/TopicSlide.vue'
import TopicTimeline from '../components/TopicTimeline.vue'
import TopicDiscussion from '../components/TopicDiscussion.vue'
import discourseApi from '../lib/discourse'

const route = useRoute()
const { t, locale } = useI18n()

// 響應式資料
const topic = ref(null)
const posts = ref([])
const loading = ref(true)
const activeTab = ref('timeline')
const realTopicId = ref(null) // 真正的 Discourse topic ID
const showAllPosts = ref(false) // 是否顯示所有留言

// 當前語言
const currentLanguage = computed(() => locale.value)

// 議題 ID (routeName)
const topicId = computed(() => route.params.id)

// 是否顯示討論按鈕
const showDiscussionButton = computed(() => {
  if (!topic.value || !topic.value.status) return false
  const allowedStages = ['意見徵集', '研擬草案']
  return allowedStages.includes(topic.value.status)
})

// 是否顯示討論標籤頁
const showDiscussionTab = computed(() => {
  return showDiscussionButton.value
})

// 顯示的留言列表（分頁處理）
const displayedPosts = computed(() => {
  if (showAllPosts.value || posts.value.length <= 10) {
    return posts.value.slice(1)
  }
  return posts.value.slice(1, 11)
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 獲取頭像 URL
const getAvatarUrl = (template, size) => {
  return `https://talk.vtaiwan.tw${template.replace('{size}', size.toString())}`
}

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

    // console.log('targetTopic', targetTopic)

    // 使用真正的 topic ID 獲取詳細資訊
    realTopicId.value = targetTopic.id
    const topicData = await discourseApi.getTopic(targetTopic.id)
    topic.value = discourseApi.formatTopicData(topicData)

    const postsData = await discourseApi.getAllPosts(`/t/${targetTopic.id}.json`)

    console.log('posts', postsData)

    posts.value = postsData

    // 根據 hash 設定預設標籤頁
    if (route.hash === '#discussion' && showDiscussionButton.value) {
      activeTab.value = 'discussion'
    } else {
      activeTab.value = 'timeline'
    }

  } catch (error) {
    console.error('Error loading topic:', error)
    topic.value = null
  } finally {
    loading.value = false
  }
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
