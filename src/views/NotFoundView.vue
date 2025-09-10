<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import IconWrapper from '../components/IconWrapper.vue'

const { t } = useI18n()

useHead({
  title: t('notFound.title'),
  meta: [
    {
      property: 'og:title',
      content: t('notFound.title')
    },
    {
      property: 'og:description',
      content: t('notFound.description')
    },
    {
      property: 'og:url',
      content: 'https://vtaiwan.tw/404'
    },
    {
      property: 'twitter:title',
      content: t('notFound.title')
    },
    {
      property: 'twitter:description',
      content: t('notFound.description')
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 圖示 -->
      <div class="mb-8">
        <div class="w-32 h-32 bg-democratic-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconWrapper name="alert-circle" type="primary" :size="64" />
        </div>
        <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      </div>

      <!-- 錯誤訊息 -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ $t('notFound.title') }}
        </h2>
        <p class="text-gray-600 mb-6">
          {{ $t('notFound.description') }}
        </p>
        <p class="text-sm text-gray-500">
          {{ $t('notFound.suggestion') }}
        </p>
      </div>

      <!-- 操作按鈕 -->
      <div class="space-y-4">
        <router-link
          to="/"
          class="btn-primary rounded-md w-full block"
        >
          {{ $t('notFound.buttons.backToHome') }}
        </router-link>

        <div class="flex gap-4">
          <router-link
            to="/topics"
            class="btn-outline rounded-md flex-1"
          >
            {{ $t('notFound.buttons.browseTopics') }}
          </router-link>
          <router-link
            to="/contact"
            class="btn-outline rounded-md flex-1"
          >
            {{ $t('notFound.buttons.contactUs') }}
          </router-link>
        </div>
      </div>

      <!-- 額外資訊 -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">
          {{ $t('notFound.help.title') }}
        </p>
        <div class="space-y-2 text-sm text-gray-600">
          <p>{{ $t('notFound.help.checkUrl') }}</p>
          <p>{{ $t('notFound.help.useNavigation') }}</p>
          <p>{{ $t('notFound.help.contactSupport') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-primary {
  @apply bg-democratic-red text-white px-6 py-3 font-medium hover:bg-democratic-red/90 transition-colors;
}

.btn-outline {
  @apply border border-gray-300 text-gray-700 px-6 py-3 font-medium hover:bg-gray-50 transition-colors;
}
</style>
