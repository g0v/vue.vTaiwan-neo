<template>
  <div>
    <div v-if="loading" class="py-6 text-center" role="status">
      <div class="border-vt-border border-t-democratic-red mx-auto h-7 w-7 animate-spin rounded-full border-2"></div>
      <p class="text-vt-gray-700 mt-2 text-sm">{{ t('topics.detail.loading') }}</p>
    </div>

    <!-- Comments -->
    <div v-else-if="comments.length > 0" class="space-y-6">
      <!-- Stats -->
      <div class="border-vt-border text-vt-gray-700 flex flex-wrap items-center gap-4 border-b pb-4 font-sans text-sm">
        <div class="flex items-center gap-1">
          <IconWrapper name="message-circle" :size="16" />
          <span>{{ t('topicDetail.commentsCount', { count: comments.length }) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <IconWrapper name="eye" :size="16" />
          <span>{{ t('topicDetail.viewsCount', { count: views.views || 0 }) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <IconWrapper name="users" :size="16" />
          <span>{{ t('topicDetail.participantsCount', { count: views.participant_count || 0 }) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <IconWrapper name="calendar" :size="16" />
          <span>{{ formatDate(views.last_posted_at) }}</span>
        </div>
      </div>

      <!-- Comment List -->
      <div class="space-y-4">
        <article v-for="(comment, index) in comments" :key="index" class="flex gap-3">
          <!-- Avatar -->
          <div class="shrink-0">
            <img :src="comment.avatar_template" :alt="comment.username" class="h-10 w-10 rounded-full" />
          </div>

          <!-- Comment Content -->
          <div class="min-w-0 flex-1">
            <div class="mb-1 flex items-center gap-2">
              <span class="text-vt-gray-800 font-semibold">
                {{ comment.username }}
              </span>
              <span class="text-vt-gray-400 font-sans text-sm">
                {{ formatDate(comment.created_at) }}
              </span>
            </div>

            <div class="prose text-vt-gray-700 max-w-none text-sm" v-html="comment.cooked"></div>
          </div>
        </article>
      </div>

      <!-- Join Discussion Button -->
      <div class="border-vt-border border-t pt-6 text-center">
        <a :href="`https://talk.vtaiwan.tw/t/topic/${commentId}`" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-primary">
          <IconWrapper name="edit" :size="17" />
          {{ t('topicDetail.postComment') }}
        </a>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-vt-gray-700 py-8 text-center">
      <IconWrapper name="message-circle" :size="36" class="text-vt-gray-400 mx-auto mb-4" />
      <p>{{ t('topics.detail.noDiscussion') }}</p>
      <a :href="`https://talk.vtaiwan.tw/t/topic/${commentId}`" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-primary mt-4">
        <IconWrapper name="edit" :size="17" />
        {{ t('topicDetail.firstComment') }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from './IconWrapper.vue'
import discourseApi from '../lib/discourse'
import { sanitizeHtml } from '../lib/sanitize'

const { t, locale } = useI18n()

// Props
const props = defineProps({
  commentId: {
    type: [String, Number],
    required: true,
  },
  slice: {
    type: Boolean,
    default: false,
  },
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
      last_posted_at: topicData.last_posted_at,
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
      cooked: formatPostContent(post.cooked),
    }))
  } catch (error) {
    console.error('Error loading comments:', error)
    comments.value = []
  } finally {
    loading.value = false
  }
}

// 格式化頭像 URL
const formatAvatarUrl = avatarTemplate => {
  if (!avatarTemplate) return ''

  // 如果已經是完整 URL，直接返回
  if (avatarTemplate.startsWith('https:')) {
    return avatarTemplate.replace(/{size}/, '100')
  }

  // 補充完整的 URL
  return `https://talk.vtaiwan.tw${avatarTemplate}`.replace(/{size}/, '100')
}

// 格式化貼文日期
const formatPostDate = dateString => {
  if (!dateString) return ''
  return dateString.replace(/T.*/, '') // 只保留日期部分
}

// 格式化貼文內容
const formatPostContent = content => {
  if (!content) return ''

  // 處理圖片 URL
  let processedContent = content

  // 修復不完整的圖片 URL
  if (processedContent.includes('src="/') && !processedContent.includes('src="https://')) {
    processedContent = processedContent.replace(/src="(?!https:)/g, 'src="https://talk.vtaiwan.tw')
  }

  return sanitizeHtml(processedContent)
}

// 格式化日期
const formatDate = dateString => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return t('topicDetail.today')
    } else if (diffDays === 1) {
      return t('topicDetail.yesterday')
    } else if (diffDays < 7) {
      return t('topicDetail.daysAgo', { count: diffDays })
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
  color: var(--color-vt-jade-green);
  text-decoration: underline;
}

:deep(.prose a:hover) {
  color: var(--color-vt-democratic-red);
}

:deep(.prose blockquote) {
  border-left: 4px solid var(--color-vt-border);
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: var(--color-vt-fg-2);
}

:deep(.prose code) {
  background-color: var(--color-vt-bg-2);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

:deep(.prose pre) {
  background-color: var(--color-vt-bg-2);
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
