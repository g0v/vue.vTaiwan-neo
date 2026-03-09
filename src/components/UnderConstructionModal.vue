<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 半透明背景 -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <!-- 彈出內容 -->
    <div class="relative mx-4 max-w-md rounded-lg bg-white p-8 shadow-xl">
      <!-- 關閉按鈕 -->
      <button @click="closeModal" class="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600" aria-label="關閉">
        <IconWrapper name="x" :size="24" />
      </button>

      <!-- 施工圖示 -->
      <div class="mb-6 flex justify-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <IconWrapper name="construction" type="amber" :size="48" />
        </div>
      </div>

      <!-- 標題 -->
      <h2 class="mb-4 text-center text-2xl font-bold text-gray-800">
        {{ $t('underConstruction.title') }}
      </h2>

      <!-- 訊息內容 -->
      <div class="mb-6 text-center">
        <p class="mb-2 text-gray-600">{{ $t('underConstruction.message') }}</p>
        <p class="text-sm text-gray-600">{{ $t('underConstruction.messageEn') }}</p>
      </div>

      <!-- GitHub 連結 -->
      <div class="text-center">
        <a
          href="https://github.com/g0v/vue.vTaiwan-neo/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          <IconWrapper name="github" :size="20" type="gray" />
          {{ $t('underConstruction.githubIssues') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconWrapper from './IconWrapper.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}
</script>
