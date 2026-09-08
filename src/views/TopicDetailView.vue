<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div v-if="topic" class="vt-page-content-wide">
      <router-link to="/topics" class="text-vt-gray-700 hover:text-democratic-red mb-5 inline-flex items-center gap-2 font-sans text-sm transition-colors">
        {{ $t('topics.detail.backToList') }}
      </router-link>

      <div v-if="realTopicId" class="vt-glass-panel px-3 py-2 sm:px-7"><TopicProgress :topic-id="realTopicId" /></div>

      <header class="mx-auto my-10 max-w-4xl text-center sm:my-12">
        <p class="vt-section-label">{{ $t('pageLabels.topicDetail') }}</p>
        <h1 class="m-0 text-4xl leading-tight tracking-[-0.02em] sm:text-5xl">{{ topic.title }}</h1>
      </header>

      <TopicSlide v-if="realTopicId" :topic-id="realTopicId" :show-discussion-button="showDiscussionButton" />

      <div class="bg-vt-gray-800/4 border-vt-gray-800/5 mx-auto mt-12 mb-7 flex w-fit max-w-full gap-1 rounded-full border p-1" role="tablist" :aria-label="$t('topics.detail.title')">
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'timeline'"
          aria-controls="topic-timeline-panel"
          class="focus-visible:outline-democratic-red inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6"
          :class="activeTab === 'timeline' ? 'text-democratic-red bg-white shadow-sm' : 'text-vt-gray-700 hover:text-vt-gray-800'"
          @click="activeTab = 'timeline'"
        >
          <IconWrapper name="calendar" :size="15" />
          <span class="hidden sm:inline">{{ $t('topics.detail.timeline') }}</span>
          <span class="sm:hidden">{{ $t('topics.detail.timelineShort') }}</span>
        </button>
        <button
          v-if="showDiscussionTab"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'discussion'"
          aria-controls="topic-discussion-panel"
          class="focus-visible:outline-democratic-red inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6"
          :class="activeTab === 'discussion' ? 'text-democratic-red bg-white shadow-sm' : 'text-vt-gray-700 hover:text-vt-gray-800'"
          @click="activeTab = 'discussion'"
        >
          <IconWrapper name="message-circle" :size="15" />
          <span class="hidden sm:inline">{{ $t('topics.detail.discussion') }}</span>
          <span class="sm:hidden">{{ $t('topics.detail.discussionShort') }}</span>
        </button>
      </div>

      <div id="topic-timeline-panel" v-if="activeTab === 'timeline' && realTopicId" role="tabpanel" class="min-h-96"><TopicTimeline :topic-id="realTopicId" /></div>
      <div id="topic-discussion-panel" v-if="activeTab === 'discussion' && realTopicId && showDiscussionTab" role="tabpanel" class="vt-glass-panel min-h-96 p-5 sm:p-7">
        <TopicDiscussion :topic-id="realTopicId" :user-data="userData" />
      </div>

      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <router-link to="/topics" class="vt-btn vt-btn-ghost">{{ $t('topics.detail.backToList') }}</router-link>
        <a v-if="userData?.isAdmin" :href="`https://talk.vtaiwan.tw/t/topic/${realTopicId}`" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-primary"
          >{{ $t('topics.detail.participate') }} →</a
        >
      </div>
    </div>

    <div v-else-if="!loading" class="vt-page-content">
      <div class="vt-status-panel">
        <h1 class="m-0 text-3xl">{{ $t('topics.detail.notFound') }}</h1>
        <router-link to="/topics" class="vt-btn vt-btn-primary mt-3">{{ $t('topics.detail.backToList') }}</router-link>
      </div>
    </div>
    <div v-else class="vt-page-content">
      <div class="vt-status-panel" role="status">
        <span class="border-vt-border border-t-democratic-red h-9 w-9 animate-spin rounded-full border-2" aria-hidden="true" />
        <p>{{ $t('topics.list.loading') }}</p>
      </div>
    </div>
  </section>
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

// 定義 props
const props = defineProps({
  userData: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

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
const formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
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
    // console.log('posts', postsData)
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
