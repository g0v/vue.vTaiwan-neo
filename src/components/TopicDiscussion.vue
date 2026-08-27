<template>
  <div>
    <div v-if="loading" class="py-8 text-center" role="status">
      <div class="border-vt-border border-t-democratic-red mx-auto h-8 w-8 animate-spin rounded-full border-2"></div>
      <p class="text-vt-gray-700 mt-2">{{ $t('topics.detail.loading') }}</p>
    </div>

    <!-- Discussion Content -->
    <div v-else-if="discussionType && discussionType.type">
      <!-- Discourse 討論串 -->
      <div v-if="discussionType.type === 'discourse'" class="space-y-6">
        <section v-for="(disc, index) in discussionType.embeder" :key="index" class="border-vt-border overflow-hidden rounded-2xl border bg-white/70">
          <div class="border-vt-border border-b p-4">
            <h3 class="m-0 flex items-center gap-2 text-lg font-semibold">
              <IconWrapper name="message-circle" :size="18" />
              {{ disc.title }}
            </h3>
          </div>
          <div class="p-4">
            <TopicDiscussionComment v-if="disc.id" :comment-id="disc.id" :slice="false" />
            <div v-else class="text-vt-gray-400 py-4 text-center">
              {{ $t('topics.detail.loading') }}
            </div>
          </div>
        </section>
      </div>

      <!-- 嵌入式內容 (polis, slido, etc.) -->
      <div v-else-if="discussionType.embeder" class="embedded-content">
        <div class="border-vt-border overflow-hidden rounded-2xl border bg-white/70">
          <div class="border-vt-border border-b p-4">
            <h3 class="m-0 flex items-center gap-2 text-lg font-semibold">
              <IconWrapper name="external-link" :size="18" />
              {{ getEmbededTitle(discussionType.type) }}
            </h3>
          </div>
          <div class="p-4">
            <div v-html="sanitizeEmbedHtml(discussionType.embeder)"></div>
          </div>
        </div>
      </div>

      <!-- 圖片內容 -->
      <div v-else-if="discussionType.type === 'img'" class="text-center">
        <div class="border-vt-border overflow-hidden rounded-2xl border bg-white/70">
          <div class="p-4">
            <div v-html="sanitizeEmbedHtml(discussionType.embeder)"></div>
          </div>
        </div>
      </div>

      <!-- 預設外部連結 -->
      <div v-else-if="discussionType.type === 'default'" class="text-center">
        <div class="border-vt-border rounded-2xl border bg-white/70 p-6">
          <IconWrapper name="external-link" :size="36" class="text-vt-gray-400 mx-auto mb-4" />
          <div v-html="sanitizeEmbedHtml(discussionType.embeder)"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-vt-gray-700 py-8 text-center">
      <IconWrapper name="message-circle" :size="36" class="text-vt-gray-400 mx-auto mb-4" />
      <p>{{ $t('topics.detail.noDiscussion') }}</p>
    </div>

    <!-- 參與討論按鈕 -->
    <div class="mt-8 text-center">
      <a v-if="userData?.isAdmin" :href="`https://talk.vtaiwan.tw/t/topic/${props.topicId}`" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-primary">
        <IconWrapper name="message-circle" :size="17" />
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
import { sanitizeEmbedHtml } from '../lib/sanitize'

const { t } = useI18n()

// Props
const props = defineProps({
  topicId: {
    type: [String, Number],
    required: true,
  },
  userData: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

// 響應式資料
const discussionType = ref({
  type: '',
  embeder: '',
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
const processDiscussionType = async topicData => {
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
        embeder: `<iframe src="${link}" frameborder="0" width="100%" height="1000px"></iframe>`,
      }
    } else if (link.indexOf('sli.do') > -1) {
      // slido 互動
      discussionType.value = {
        type: 'slido',
        embeder: `<iframe src="${link}" frameborder="0" width="100%" height="1000px"></iframe>`,
      }
    } else if (link.indexOf('livehouse') > -1) {
      // livehouse 直播
      const embedUrl = link.replace('livehouse.in/', 'livehouse.in/embed/')
      discussionType.value = {
        type: 'livehouse',
        embeder: `<iframe width="100%" height="1000px" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`,
      }
    } else if (link.indexOf('talk.vtaiwan.tw') > -1) {
      // discourse 討論串
      const categoryUrl = link.replace(/(.*)\/$/, '$1') // 移除末尾的斜線

      try {
        // 使用專門的方法獲取分類下的所有討論串
        const topics = await discourseApi.getAllCategoryTopics(categoryUrl + '.json')

        // 使用中文排序邏輯，複刻舊網站行為
        const sortedTopics = topics.sort((a, b) => {
          // 使用discourse.js中的chineseSort邏輯
          const c2n = { 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 十: '10' }

          const chineseToNumber = str => {
            return str.replace(/一|二|三|四|五|六|七|八|九|十/gi, matched => {
              return c2n[matched]
            })
          }

          return chineseToNumber(a.title).localeCompare(chineseToNumber(b.title), 'zh-TW', { numeric: true })
        })

        discussionType.value = {
          type: 'discourse',
          embeder: sortedTopics
            .filter(t => t.id && t.title) // 只包含有效的topic
            .map(t => ({
              title: t.title,
              id: t.id,
            })),
        }
      } catch (error) {
        console.error('Error loading discourse category topics:', error)
        discussionType.value = { type: '', embeder: '' }
      }
    } else if (link.indexOf('typeform') > -1) {
      // typeform 表單
      const formUrl = link.replace(/.*\((.*)\)/, '$1')
      discussionType.value = {
        type: 'typeform',
        embeder: `<iframe src="${formUrl}" frameborder="0" width="100%" height="1000px"></iframe>`,
      }
    } else if (link.indexOf('hackpad') > -1) {
      // hackpad (已棄用)
      discussionType.value = {
        type: 'hackpad',
        embeder: `${t('topics.detail.hackpadMoved')} <a href="${link}" target="_blank" rel="noopener noreferrer">${t('topics.detail.externalResource')}</a>`,
      }
    } else if (/.*\.jpg/.test(link)) {
      // 圖片
      const imageUrl = link.replace(/.*\((.*)\)/, '$1')
      discussionType.value = {
        type: 'img',
        embeder: `<img src="${imageUrl}" alt="${t('topics.detail.topicImageAlt')}" class="max-w-full h-auto rounded-lg shadow-md" />`,
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
        embeder: `${t('topics.detail.viewExternal')} <a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`,
      }
    }
  } catch (error) {
    console.error('Error processing discussion type:', error)
    discussionType.value = { type: '', embeder: '' }
  }
}

// 取得嵌入內容的標題
const getEmbededTitle = type => {
  const titleMap = {
    polis: t('topics.detail.embedTitles.polis'),
    slido: t('topics.detail.embedTitles.slido'),
    livehouse: t('topics.detail.embedTitles.livehouse'),
    typeform: t('topics.detail.embedTitles.typeform'),
    hackpad: t('topics.detail.embedTitles.hackpad'),
    img: t('topics.detail.embedTitles.image'),
  }

  return titleMap[type] || t('topics.detail.externalResource')
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
  color: var(--color-vt-jade-green);
  text-decoration: underline;
}

:deep(a:hover) {
  color: var(--color-vt-democratic-red);
}
</style>
