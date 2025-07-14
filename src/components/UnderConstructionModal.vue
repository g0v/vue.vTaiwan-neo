<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 半透明背景 -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <!-- 彈出內容 -->
    <div class="relative bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
      <!-- 關閉按鈕 -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="關閉"
      >
        <IconWrapper name="x" :size="24" />
      </button>

      <!-- 施工圖示 -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
          <IconWrapper name="construction" type="amber" :size="48" />
        </div>
      </div>

      <!-- 標題 -->
      <h2 class="text-2xl font-bold text-center mb-4 text-gray-800">
        {{ $t('underConstruction.title') }}
      </h2>

      <!-- 訊息內容 -->
      <div class="text-center mb-6">
        <p class="text-gray-600 mb-2">{{ $t('underConstruction.message') }}</p>
        <p class="text-gray-600 text-sm">{{ $t('underConstruction.messageEn') }}</p>
      </div>

      <!-- GitHub 連結 -->
      <div class="text-center">
        <a
          href="https://github.com/g0v/vue.vTaiwan-neo/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
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
