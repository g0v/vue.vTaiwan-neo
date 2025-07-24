<template>
  <div class="topic-discussion-comment">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-jade-green mx-auto"></div>
      <p class="mt-2 text-sm text-gray-600">載入留言...</p>
    </div>

    <!-- Comments -->
    <div v-else-if="comments.length > 0" class="space-y-6">
      <!-- Stats -->
      <div class="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-4">
        <div class="flex items-center gap-1">
          <IconWrapper name="message-circle" :size="16" />
          <span>{{ comments.length }} 則留言</span>
        </div>
        <div class="flex items-center gap-1">
          <IconWrapper name="eye" :size="16" />
          <span>{{ views.views || 0 }} 次瀏覽</span>
        </div>
        <div class="flex items-center gap-1">
          <IconWrapper name="users" :size="16" />
          <span>{{ views.participant_count || 0 }} 位參與者</span>
        </div>
        <div class="flex items-center gap-1">
          <IconWrapper name="calendar" :size="16" />
          <span>{{ formatDate(views.last_posted_at) }}</span>
        </div>
      </div>

      <!-- Comment List -->
      <div class="space-y-4">
        <div
          v-for="(comment, index) in comments"
          :key="index"
          class="flex space-x-3"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img
              :src="comment.avatar_template"
              :alt="comment.username"
              class="w-10 h-10 rounded-full"
            />
          </div>

          <!-- Comment Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900">
                {{ comment.username }}
              </span>
              <span class="text-sm text-gray-500">
                {{ formatDate(comment.created_at) }}
              </span>
            </div>

            <div
              class="prose prose-sm max-w-none text-gray-700"
              v-html="comment.cooked"
            ></div>
          </div>
        </div>
      </div>

      <!-- Join Discussion Button -->
      <div class="border-t border-gray-200 pt-6 text-center">
        <a
          :href="`https://talk.vtaiwan.tw/t/topic/${commentId}`"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary inline-flex items-center"
        >
          <IconWrapper name="edit" :size="20" class="mr-2" />
          我要留言
        </a>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <IconWrapper name="message-circle" :size="48" color="#9CA3AF" class="mx-auto mb-4" />
      <p class="text-gray-500">目前沒有留言</p>
      <a
        :href="`https://talk.vtaiwan.tw/t/topic/${commentId}`"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-primary mt-4 inline-flex items-center"
      >
        <IconWrapper name="edit" :size="20" class="mr-2" />
        成為第一個留言的人
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from './IconWrapper.vue'
import discourseApi from '../lib/discourse'

const { locale } = useI18n()

// Props
const props = defineProps({
  commentId: {
    type: [String, Number],
    required: true
  },
  slice: {
    type: Boolean,
    default: false
  }
})

// 響應式資料
const comments = ref([])
const views = ref({})
const loading = ref(true)

// 當前語言
const currentLanguage = computed(() => locale.value)

// 載入留言
const loadComments = async () => {
  try {
    loading.value = true

    // 獲取議題詳細資訊
    const topicData = await discourseApi.getTopic(props.commentId)

    // 設定統計資訊
    views.value = {
      views: topicData.views,
      participant_count: topicData.participant_count,
      last_posted_at: topicData.last_posted_at
    }

    // 處理留言
    const posts = props.slice
      ? topicData.post_stream.posts.slice(1) // 跳過第一篇
      : topicData.post_stream.posts

    // 格式化留言資料
    comments.value = posts.map(post => ({
      ...post,
      avatar_template: formatAvatarUrl(post.avatar_template),
      created_at: formatPostDate(post.created_at),
      cooked: formatPostContent(post.cooked)
    }))

  } catch (error) {
    console.error('Error loading comments:', error)
    comments.value = []
  } finally {
    loading.value = false
  }
}

// 格式化頭像 URL
const formatAvatarUrl = (avatarTemplate) => {
  if (!avatarTemplate) return ''

  // 如果已經是完整 URL，直接返回
  if (avatarTemplate.startsWith('https:')) {
    return avatarTemplate.replace(/{size}/, '100')
  }

  // 補充完整的 URL
  return `https://talk.vtaiwan.tw${avatarTemplate}`.replace(/{size}/, '100')
}

// 格式化貼文日期
const formatPostDate = (dateString) => {
  if (!dateString) return ''
  return dateString.replace(/T.*/, '') // 只保留日期部分
}

// 格式化貼文內容
const formatPostContent = (content) => {
  if (!content) return ''

  // 處理圖片 URL
  let processedContent = content

  // 修復不完整的圖片 URL
  if (processedContent.includes('src="/') && !processedContent.includes('src="https://')) {
    processedContent = processedContent.replace(
      /src="(?!https:)/g,
      'src="https://talk.vtaiwan.tw'
    )
  }

  return processedContent
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays} 天前`
    } else {
      return date.toLocaleDateString(currentLanguage.value)
    }
  } catch (error) {
    return dateString
  }
}

// 組件掛載時載入資料
onMounted(() => {
  loadComments()
})
</script>

<style scoped>
/* 確保 prose 內容正確顯示 */
:deep(.prose) {
  max-width: none;
}

:deep(.prose p) {
  margin-bottom: 1rem;
}

:deep(.prose a) {
  color: #40B3BF;
  text-decoration: underline;
}

:deep(.prose a:hover) {
  color: #369AA3;
}

:deep(.prose blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
}

:deep(.prose code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

:deep(.prose pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

:deep(.prose img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
