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
import TopicProgress from '../components/TopicProgress.vue'
import TopicSlide from '../components/TopicSlide.vue'
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

    // 根據 hash 設定預設標籤頁
    if (route.hash === '#discussion' && showDiscussionTab.value) {
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
