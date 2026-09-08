<template>
  <ol class="mx-auto flex max-w-3xl list-none px-0 py-5" :aria-label="t('topics.filters.stage')">
    <li
      v-for="(step, index) in steps"
      :key="step.title"
      class="relative flex-1 text-center font-sans text-[10px] font-medium sm:text-xs"
      :class="step.current ? 'text-wheat-yellow' : step.active ? 'text-jade-green' : 'text-vt-gray-400'"
      :aria-current="step.current ? 'step' : undefined"
    >
      <span v-if="index < steps.length - 1" class="absolute top-[15px] left-1/2 h-0.5 w-full" :class="step.active ? 'bg-jade-green' : 'bg-vt-border'" aria-hidden="true" />
      <span
        class="relative z-1 mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-xs font-bold"
        :class="step.current ? 'border-wheat-yellow bg-wheat-yellow ring-wheat-yellow/10 text-white ring-4' : step.active ? 'border-jade-green' : 'border-vt-gray-400'"
        aria-hidden="true"
        >{{ index + 1 }}</span
      >
      <span class="block px-0.5 leading-4">{{ t(step.title) }}</span>
    </li>
  </ol>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
const steps = ref([
  {
    title: '即將開始',
    active: false,
    current: false,
  },
  {
    title: '意見徵集',
    active: false,
    current: false,
  },
  {
    title: '研擬草案',
    active: false,
    current: false,
  },
  {
    title: '送交院會',
    active: false,
    current: false,
  },
  {
    title: '歷史案件',
    active: false,
    current: false,
  },
])

// 載入進度資料
const loadProgress = async () => {
  try {
    if (!props.topicId) return

    const response = await discourseApi.getTopic(props.topicId)

    if (response && response.post_stream && response.post_stream.posts) {
      const posts = response.post_stream.posts.slice(1) // 排除第一篇

      // 重設步驟狀態
      steps.value.forEach(step => {
        step.active = false
        step.current = false
      })

      if (posts.length > 0) {
        // 獲取最後一個 post 的原始內容
        const lastPost = posts[posts.length - 1]
        const rawContent = lastPost.raw || ''
        const currentStage = rawContent.split(' ')[0] // 取得目前階段

        // 設定步驟狀態
        let foundCurrent = false
        for (let i = 0; i < steps.value.length; i++) {
          if (steps.value[i].title === currentStage) {
            steps.value[i].current = true
            foundCurrent = true
            break
          } else {
            steps.value[i].active = true
          }
        }

        // 如果沒有找到匹配的階段，預設為第一個
        if (!foundCurrent) {
          steps.value[0].current = true
        }
      } else {
        // 如果沒有 posts，預設為第一個步驟
        steps.value[0].current = true
      }
    }
  } catch (error) {
    console.error('Error loading progress:', error)
    // 錯誤時預設為第一個步驟
    steps.value[0].current = true
  }
}

// 監聽 topicId 變化
watch(
  () => props.topicId,
  () => {
    loadProgress()
  },
  { immediate: true }
)
</script>
