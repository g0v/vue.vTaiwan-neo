<template>
  <div>
    <div v-if="loading" class="vt-status-panel" role="status">
      <span class="border-vt-border border-t-democratic-red h-8 w-8 animate-spin rounded-full border-2" aria-hidden="true" />
      <p>{{ t('topics.timeline.loading') }}</p>
    </div>

    <div v-else-if="timeline.length > 0" class="vt-glass-panel overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full border-collapse bg-transparent">
          <thead>
            <tr class="bg-vt-gray-800/3">
              <th class="border-vt-border/70 w-40 border-b px-5 py-4 text-left font-sans text-xs font-semibold tracking-[0.1em] uppercase">{{ t('topics.timeline.columns.time') }}</th>
              <th class="border-vt-border/70 border-b px-5 py-4 text-left font-sans text-xs font-semibold tracking-[0.1em] uppercase">{{ t('topics.timeline.columns.stage') }}</th>
              <th class="border-vt-border/70 w-52 border-b px-5 py-4 text-left font-sans text-xs font-semibold tracking-[0.1em] uppercase">{{ t('topics.timeline.columns.links') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in timeline" :key="index" class="border-vt-border/60 border-b last:border-b-0">
              <td class="px-5 py-5 align-top font-sans text-sm tabular-nums">
                <div>{{ item.start }}</div>
                <i v-if="item.end" class="text-vt-gray-400 my-1 flex">
                  <IconWrapper name="chevron-down" :size="16" />
                </i>
                <div v-if="item.end">{{ item.end }}</div>
              </td>
              <td class="px-5 py-5 align-top">
                <span class="vt-pill">{{ t(item.title) }}</span>
                <p v-if="item.info" class="text-vt-gray-800 mt-2 font-medium">{{ item.info }}</p>
              </td>
              <td class="px-5 py-5 align-top"><ParticipationLink :urllink="item.link" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-vt-border/70 divide-y md:hidden">
        <article v-for="(item, index) in timeline" :key="index" class="p-5">
          <div class="vt-meta-row mb-3">
            <span>{{ item.start }}</span
            ><span v-if="item.end">→ {{ item.end }}</span>
          </div>
          <span class="vt-pill">{{ t(item.title) }}</span>
          <p v-if="item.info" class="text-vt-gray-800 mt-3 font-medium">{{ item.info }}</p>
          <div class="mt-4"><ParticipationLink :urllink="item.link" /></div>
        </article>
      </div>

      <div class="border-vt-border/70 border-t p-5 sm:p-6">
        <h3 class="m-0 font-sans text-xs font-semibold tracking-[0.1em] uppercase">{{ t('topics.timeline.externalLinksTitle') }}</h3>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="link in plinkList" :key="link.key" class="flex items-start gap-3">
            <IconWrapper :name="link.icon" :size="16" class="text-jade-green mt-0.5" />
            <p class="text-vt-gray-700 text-sm">
              <strong class="text-vt-gray-800">{{ t(`topics.timeline.linkTypes.${link.key}`) }}</strong> · {{ t(`topics.timeline.linkTypes.${link.key}Desc`) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="vt-status-panel">
      <IconWrapper name="calendar" :size="36" class="text-vt-gray-400" />
      <p>{{ t('topics.detail.noTimeline') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from './IconWrapper.vue'
import ParticipationLink from './ParticipationLink.vue'
import discourseApi from '../lib/discourse'

const { t } = useI18n()

// Props
const props = defineProps({
  topicId: {
    type: [String, Number],
    required: true,
  },
})

// 響應式資料
const timeline = ref([])
const loading = ref(true)

// 外部連結說明
const plinkList = [
  { icon: 'link', key: 'related' },
  { icon: 'edit', key: 'hackpad' },
  { icon: 'book', key: 'record' },
  { icon: 'play', key: 'live' },
  { icon: 'users', key: 'discuss' },
  { icon: 'message-circle', key: 'comment' },
]

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
    timeline.value = timelineItems.sort((a, b) => new Date(b.start) - new Date(a.start))
  } catch (error) {
    console.error('Error loading timeline:', error)
    timeline.value = []
  } finally {
    loading.value = false
  }
}

// 解析時間軸貼文
const parseTimelinePost = raw => {
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
      link: [],
    }

    // 檢查第三個元素是結束日期還是時間
    if (comment[2] && dateRegex.test(comment[2])) {
      timelineContent.end = comment[2] // 結束日期
    } else if (comment[2] && timeRegex.test(comment[2])) {
      timelineContent.start += ' ' + comment[2]
      timelineContent.end = null
    }

    // 處理剩餘的項目 - 完全按照原始邏輯
    comment.slice(1).forEach(item => {
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
