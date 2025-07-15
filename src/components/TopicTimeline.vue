<template>
  <div class="topic-timeline">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-jade-green mx-auto"></div>
      <p class="mt-2 text-gray-600">載入時間軸...</p>
    </div>

    <!-- Timeline Table -->
    <div v-else-if="timeline.length > 0">
      <table class="w-full border-collapse border border-gray-200 bg-white">
        <thead>
          <tr class="text-center bg-gray-50">
            <th
              v-for="title in timelineTitle"
              :key="title"
              class="border border-gray-200 p-4"
            >
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in timeline" :key="index" class="border-b border-gray-200">
            <!-- 議題時間 -->
            <td class="border border-gray-200 p-4 text-center align-top">
              <div class="text-lg leading-6">{{ item.start }}</div>
              <i v-if="item.end" class="flex justify-center my-2 text-gray-400">
                <IconWrapper name="chevron-down" :size="16" />
              </i>
              <div v-if="item.end" class="text-lg leading-6">{{ item.end }}</div>
            </td>

            <!-- 議題階段 -->
            <td class="border border-gray-200 p-4 align-top">
              <div class="block md:hidden">
                <span class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                  {{ item.title }}
                </span>
              </div>
              <div class="hidden md:block">
                <span class="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded">
                  {{ item.title }}
                </span>
              </div>
              <h4 v-if="item.info" class="mt-2 text-base font-medium text-gray-900">
                {{ item.info }}
              </h4>
            </td>

            <!-- 相關外部連結 -->
            <td class="border border-gray-200 p-4 align-top">
              <ParticipationLink :urllink="item.link" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 外部連結說明 -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">外部連結說明*</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="link in plinkList"
            :key="link.title"
            class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <IconWrapper :name="link.icon" :size="20" class="text-gray-600 mt-0.5" />
            <div>
              <h5 class="font-medium text-gray-900">{{ link.title }}</h5>
              <p class="text-sm text-gray-600">{{ link.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <IconWrapper name="calendar" :size="48" color="#9CA3AF" class="mx-auto mb-4" />
      <p class="text-gray-500">目前沒有時間軸資料</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from './IconWrapper.vue'
import ParticipationLink from './ParticipationLink.vue'
import discourseApi from '../lib/discourse'

const { locale } = useI18n()

// Props
const props = defineProps({
  topicId: {
    type: [String, Number],
    required: true
  }
})

// 響應式資料
const timeline = ref([])
const loading = ref(true)

// 表格標題
const timelineTitle = ref(["議題時間", "議題階段", "相關外部連結"])

// 外部連結說明
const plinkList = ref([
  {
    icon: "link",
    title: '相關',
    desc: '與議題相關的連結'
  },
  {
    icon: "edit",
    title: '共筆',
    desc: '會議共同筆記'
  },
  {
    icon: "book",
    title: '記錄',
    desc: '當日共同筆記整理出的重點'
  },
  {
    icon: "play",
    title: '直播',
    desc: '會議直播影片'
  },
  {
    icon: "users",
    title: '討論',
    desc: '進入討論'
  },
  {
    icon: "message-circle",
    title: '留言',
    desc: '進入留言'
  }
])

// 當前語言
const currentLanguage = computed(() => locale.value)

// 載入時間軸
const loadTimeline = async () => {
  try {
    loading.value = true

    // 獲取議題詳細資訊
    const topicData = await discourseApi.getTopic(props.topicId)

    // 處理時間軸內容 (跳過第一篇貼文)
    const posts = topicData.post_stream.posts.slice(1)
    const timelineItems = []

    posts.forEach(post => {
      const timelineItem = parseTimelinePost(post.raw)
      if (timelineItem) {
        timelineItems.push(timelineItem)
      }
    })

    // 按開始時間排序 (最新的在前)
    timeline.value = timelineItems.sort((a, b) =>
      new Date(b.start) - new Date(a.start)
    )

  } catch (error) {
    console.error('Error loading timeline:', error)
    timeline.value = []
  } finally {
    loading.value = false
  }
}

// 解析時間軸貼文
const parseTimelinePost = (raw) => {
  try {
    // 完全按照原始邏輯來解析
    const regex = /(?: (?:init )?)|\n/g // 用來分開字串
    const dateRegex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/ // yyyy-mm-dd
    const timeRegex = /^(2[0-3]|1[0-9]|0[0-9]|[^0-9][0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9])$/ // hh:mm:ss

    const comment = raw.split(regex) // 分割回覆內容
    const links = [] // 回覆中的連結

    if (comment.length < 2) return null

    const timelineContent = {
      title: comment[0], // 進度
      start: comment[1], // 開始日期
      end: null,
      info: '',
      link: []
    }

    // 檢查第三個元素是結束日期還是時間
    if (comment[2] && dateRegex.test(comment[2])) {
      timelineContent.end = comment[2] // 結束日期
    } else if (comment[2] && timeRegex.test(comment[2])) {
      timelineContent.start += ' ' + comment[2]
      timelineContent.end = null
    }

    // 處理剩餘的項目 - 完全按照原始邏輯
    comment.slice(1).forEach((item) => {
      if (item && item.indexOf('http') > -1) {
        links.push(item)
      } else if (item && !dateRegex.test(item) && !timeRegex.test(item) && item.trim() !== '') {
        if (!timelineContent.info) {
          timelineContent.info = item
        }
      }
    })

    timelineContent.link = links

    return timelineContent.title ? timelineContent : null
  } catch (error) {
    console.error('Error parsing timeline post:', error)
    return null
  }
}

// 組件掛載時載入資料
onMounted(() => {
  loadTimeline()
})
</script>

<style scoped>
/* 響應式表格 */
@media (max-width: 767px) {
  table {
    font-size: 0.875rem;
  }
}

/* 確保表格在小螢幕上可以滾動 */
.topic-timeline {
  overflow-x: auto;
}
</style>
