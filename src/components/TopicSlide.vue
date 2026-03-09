<template>
  <div class="topic-slide">
    <!-- 簡介標題 -->
    <div class="bg-gray-100 py-8">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-4xl">
          <h3 class="mb-8 flex items-center justify-center text-center text-2xl font-bold">
            <IconWrapper name="info" :size="24" class="mr-3" />
            {{ $t('topics.detail.introduction') }}
          </h3>

          <div class="flex flex-col gap-8 lg:flex-row">
            <!-- Iframe 區域 -->
            <div class="lg:flex-1">
              <div v-if="slide.iframe" v-html="slide.iframe" class="iframe-container"></div>
              <div v-else class="rounded-lg bg-white p-8 text-center text-gray-500">
                {{ $t('topics.detail.noSlide') }}
              </div>
            </div>

            <!-- 詳細資訊區域 -->
            <div class="lg:flex-1 lg:pl-8">
              <div class="h-full max-h-96 overflow-auto rounded-lg bg-white p-6">
                <div v-if="slide.info" v-html="slide.info" class="prose prose-lg max-w-none"></div>
                <div v-else class="text-center text-gray-500">
                  {{ $t('topics.detail.noInfo') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from './IconWrapper.vue'
import discourseApi from '../lib/discourse'

const { t } = useI18n()

// Props
const props = defineProps({
  topicId: {
    type: [String, Number],
    required: true,
  },
  showDiscussionButton: {
    type: Boolean,
    default: true,
  },
})

// 響應式資料
const slide = ref({
  iframe: '',
  info: '',
})

// 是否顯示討論連結
const showDiscussionLink = computed(() => {
  return props.showDiscussionButton && props.topicId
})

// 討論連結
const discussionLink = computed(() => {
  return `/topic/${props.topicId}#discussion`
})

// 載入 Slide 資料
const loadSlide = async () => {
  try {
    if (!props.topicId) return

    const response = await discourseApi.getTopic(props.topicId)

    if (response && response.post_stream && response.post_stream.posts.length > 0) {
      const firstPost = response.post_stream.posts[0]
      const cooked = firstPost.cooked || ''

      // 提取 iframe
      const parser = new DOMParser()
      const doc = parser.parseFromString(cooked, 'text/html')
      const iframeElement = doc.querySelector('iframe')

      if (iframeElement) {
        iframeElement.allowFullscreen = true
        slide.value.iframe = iframeElement.outerHTML
      }

      // 提取詳細資訊（hr 分割後的第二部分）
      const parts = cooked.split('<hr>')
      if (parts.length > 1) {
        let info = parts[1]
        // 移除 slideshare 相關內容
        info = info.replace(/<iframe.*?slideshare.*?<\/iframe>/gi, '')
        slide.value.info = info
      }
    }
  } catch (error) {
    console.error('Error loading slide:', error)
  }
}

// 監聽 topicId 變化
watch(
  () => props.topicId,
  () => {
    loadSlide()
  },
  { immediate: true }
)

// 組件掛載時載入資料
onMounted(() => {
  loadSlide()
})
</script>

<style scoped>
.topic-slide {
  /* min-height: 400px; */
}

.iframe-container :deep(iframe) {
  width: 100%;
  min-height: 350px;
  border: none;
  border-radius: 8px;
}

.prose :deep(h1) {
  @apply mb-4 text-2xl font-bold;
}

.prose :deep(h2) {
  @apply mb-3 text-xl font-bold;
}

.prose :deep(h3) {
  @apply mb-2 text-lg font-bold;
}

.prose :deep(p) {
  @apply mb-4 leading-relaxed;
}

.prose :deep(ul) {
  @apply mb-4 list-inside list-disc;
}

.prose :deep(ol) {
  @apply mb-4 list-inside list-decimal;
}

.prose :deep(li) {
  @apply mb-1;
}

.prose :deep(a) {
  @apply text-jade-green hover:underline;
}

.prose :deep(strong) {
  @apply font-bold;
}

.prose :deep(em) {
  @apply italic;
}

.btn-lg {
  @apply px-8 py-4 text-lg;
}
</style>
