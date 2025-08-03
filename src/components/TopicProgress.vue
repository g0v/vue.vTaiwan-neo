<template>
  <div class="topic-progress py-6">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="step-progress-bar">
          <ul class="progress-bar">
            <li
              v-for="(step, index) in steps"
              :key="index"
              :class="{
                active: step.active,
                current: step.current
              }"
            >
              {{ t(step.title) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
const steps = ref([
  {
    title: '即將開始',
    active: false,
    current: false
  },
  {
    title: '意見徵集',
    active: false,
    current: false
  },
  {
    title: '研擬草案',
    active: false,
    current: false
  },
  {
    title: '送交院會',
    active: false,
    current: false
  },
  {
    title: '歷史案件',
    active: false,
    current: false
  }
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
watch(() => props.topicId, () => {
  loadProgress()
}, { immediate: true })

// 組件掛載時載入資料
onMounted(() => {
  loadProgress()
})
</script>

<style scoped>
.step-progress-bar {
  margin: 0 auto;
  display: block;
  padding: 10px 0;
  width: 100%;
  max-width: 600px;
}

.progress-bar {
  counter-reset: step;
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
}

.progress-bar li {
  color: #6b7280;
  width: 20%;
  position: relative;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
}

.progress-bar li:before {
  content: counter(step);
  counter-increment: step;
  width: 32px;
  height: 32px;
  border: 2px solid #6b7280;
  border-radius: 50%;
  display: block;
  text-align: center;
  line-height: 28px;
  margin: 0 auto 10px auto;
  z-index: 9;
  background-color: white;
  font-weight: 600;
  position: relative;
}

.progress-bar li:after {
  content: "";
  width: 100%;
  position: absolute;
  height: 2px;
  background-color: #6b7280;
  top: 16px;
  left: 50%;
  z-index: -1;
}

.progress-bar li:last-child:after {
  content: none;
}

.progress-bar li.active {
  color: #10b981;
}

.progress-bar li.active:before {
  border-color: #10b981;
}

.progress-bar li.active:after {
  background-color: #10b981;
}

.progress-bar li.current {
  color: #f59e0b;
}

.progress-bar li.current:before {
  border-color: #f59e0b;
  background-color: #f59e0b;
  color: white;
}

.progress-bar li.current:after {
  background-color: #f59e0b;
}

@media (max-width: 767px) {
  .progress-bar li {
    font-size: 0.875rem;
  }

  .progress-bar li:before {
    width: 28px;
    height: 28px;
    line-height: 24px;
  }

  .progress-bar li:after {
    top: 14px;
  }
}
</style>
