<template>
  <div class="topic-discussion">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-jade-green mx-auto"></div>
      <p class="mt-2 text-gray-600">載入討論內容...</p>
    </div>

    <!-- Discussion Content -->
    <div v-else-if="discussionType && discussionType.type">
      <!-- Discourse 討論串 -->
      <div
        v-if="discussionType.type === 'discourse'"
        class="space-y-6"
      >
        <div
          v-for="(disc, index) in discussionType.embeder"
          :key="index"
          class="bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div class="border-b border-gray-200 p-4">
            <h3 class="text-lg font-semibold flex items-center cursor-pointer">
              <IconWrapper name="message-circle" :size="20" class="mr-2" />
              {{ disc.title }}
            </h3>
          </div>
          <div class="p-4">
            <TopicDiscussionComment
              :comment-id="disc.id"
              :slice="false"
            />
          </div>
        </div>
      </div>

      <!-- 嵌入式內容 (polis, slido, etc.) -->
      <div
        v-else-if="discussionType.embeder"
        class="embedded-content"
      >
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div class="border-b border-gray-200 p-4">
            <h3 class="text-lg font-semibold flex items-center">
              <IconWrapper name="external-link" :size="20" class="mr-2" />
              {{ getEmbededTitle(discussionType.type) }}
            </h3>
          </div>
          <div class="p-4">
            <div v-html="discussionType.embeder"></div>
          </div>
        </div>
      </div>

      <!-- 圖片內容 -->
      <div
        v-else-if="discussionType.type === 'img'"
        class="text-center"
      >
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div class="p-4">
            <div v-html="discussionType.embeder"></div>
          </div>
        </div>
      </div>

      <!-- 預設外部連結 -->
      <div
        v-else-if="discussionType.type === 'default'"
        class="text-center"
      >
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <IconWrapper name="external-link" :size="48" color="#9CA3AF" class="mx-auto mb-4" />
          <div v-html="discussionType.embeder"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <IconWrapper name="message-circle" :size="48" color="#9CA3AF" class="mx-auto mb-4" />
      <p class="text-gray-500">目前沒有討論內容</p>
    </div>

    <!-- 參與討論按鈕 -->
    <div class="mt-8 text-center">
      <a
        :href="`https://talk.vtaiwan.tw/t/topic/${props.topicId}`"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-primary inline-flex items-center"
      >
        <IconWrapper name="message-circle" :size="20" class="mr-2" />
        {{ $t('topics.detail.participate') }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from './IconWrapper.vue'
import TopicDiscussionComment from './TopicDiscussionComment.vue'
import discourseApi from '../lib/discourse'

const { t } = useI18n()

// Props
const props = defineProps({
  topicId: {
    type: [String, Number],
    required: true
  }
})

// 響應式資料
const discussionType = ref({
  type: '',
  embeder: ''
})
const loading = ref(true)
const lastStep = ref('')

// 載入討論內容
const loadDiscussion = async () => {
  try {
    loading.value = true

    // 獲取議題詳細資訊
    const topicData = await discourseApi.getTopic(props.topicId)

    // 處理討論內容
    await processDiscussionType(topicData)

  } catch (error) {
    console.error('Error loading discussion:', error)
  } finally {
    loading.value = false
  }
}

// 處理討論類型
const processDiscussionType = async (topicData) => {
  try {
    const posts = topicData.post_stream.posts.slice(1) // 跳過第一篇貼文
    let rawlinks = []

    // 尋找最新階段的貼文
    for (const post of posts) {
      lastStep.value = post.raw.split(/\s/, 1)[0]

      // 尋找意見徵集或研擬草案階段的貼文
      if (lastStep.value === '意見徵集' || lastStep.value === '研擬草案') {
        rawlinks = post.raw.split(/\s/)
      }
    }

    // 處理外部資源連結
    const httpLinks = rawlinks.filter(link => link.indexOf('http') > -1)

    if (httpLinks.length === 0) {
      discussionType.value = { type: '', embeder: '' }
      return
    }

    // 處理最後一個連結
    const link = httpLinks[httpLinks.length - 1]

    if (link.indexOf('pol.is') > -1) {
      // polis 投票
      discussionType.value = {
        type: 'polis',
        embeder: `<iframe src="${link}" frameborder="0" width="100%" height="1000px"></iframe>`
      }
    } else if (link.indexOf('sli.do') > -1) {
      // slido 互動
      discussionType.value = {
        type: 'slido',
        embeder: `<iframe src="${link}" frameborder="0" width="100%" height="1000px"></iframe>`
      }
    } else if (link.indexOf('livehouse') > -1) {
      // livehouse 直播
      const embedUrl = link.replace('livehouse.in/', 'livehouse.in/embed/')
      discussionType.value = {
        type: 'livehouse',
        embeder: `<iframe width="100%" height="1000px" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`
      }
    } else if (link.indexOf('talk.vtaiwan.tw') > -1) {
      // discourse 討論串
      const categoryUrl = link.replace(/(.*)\/$/, '$1') // 移除末尾的斜線

      try {
        const topics = await discourseApi.getAllTopics(categoryUrl + '.json')
        const sortedTopics = topics.sort((a, b) =>
          a.title.localeCompare(b.title, 'zh-TW')
        )

        discussionType.value = {
          type: 'discourse',
          embeder: sortedTopics.map(t => ({
            title: t.title,
            id: t.id
          }))
        }
      } catch (error) {
        console.error('Error loading discourse topics:', error)
        discussionType.value = { type: '', embeder: '' }
      }
    } else if (link.indexOf('typeform') > -1) {
      // typeform 表單
      const formUrl = link.replace(/.*\((.*)\)/, '$1')
      discussionType.value = {
        type: 'typeform',
        embeder: `<iframe src="${formUrl}" frameborder="0" width="100%" height="1000px"></iframe>`
      }
    } else if (link.indexOf('hackpad') > -1) {
      // hackpad (已棄用)
      discussionType.value = {
        type: 'hackpad',
        embeder: `Hackpad 已遷移至 Dropbox Paper。請使用 <a href="${link}" target="_blank" rel="noopener noreferrer">外部連結</a> 查看。`
      }
    } else if (/.*\.jpg/.test(link)) {
      // 圖片
      const imageUrl = link.replace(/.*\((.*)\)/, '$1')
      discussionType.value = {
        type: 'img',
        embeder: `<img src="${imageUrl}" alt="議題圖片" class="max-w-full h-auto rounded-lg shadow-md" />`
      }
    } else {
      // 預設外部連結
      let linkText = link
      let linkUrl = link

      const markdownMatch = /^\[(.*?)\]\((.*)\)/.exec(link)
      if (markdownMatch) {
        linkText = markdownMatch[1]
        linkUrl = markdownMatch[2]
      }

      discussionType.value = {
        type: 'default',
        embeder: `請查看 <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-jade-green hover:text-jade-green/80">${linkText}</a>`
      }
    }

  } catch (error) {
    console.error('Error processing discussion type:', error)
    discussionType.value = { type: '', embeder: '' }
  }
}

// 取得嵌入內容的標題
const getEmbededTitle = (type) => {
  const titleMap = {
    'polis': 'Polis 意見調查',
    'slido': 'Slido 互動問答',
    'livehouse': 'Livehouse 直播',
    'typeform': 'Typeform 表單',
    'hackpad': 'Hackpad 文件',
    'img': '相關圖片'
  }

  return titleMap[type] || '外部資源'
}

// 組件掛載時載入資料
onMounted(() => {
  loadDiscussion()
})
</script>

<style scoped>
/* 嵌入式內容樣式 */
.embedded-content :deep(iframe) {
  border: none;
  border-radius: 0.5rem;
  width: 100%;
  min-height: 500px;
}

.embedded-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 確保連結在 v-html 中正確顯示 */
:deep(a) {
  color: #40B3BF;
  text-decoration: underline;
}

:deep(a:hover) {
  color: #369AA3;
}
</style>
