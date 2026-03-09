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
      content: t('notFound.title'),
    },
    {
      property: 'og:description',
      content: t('notFound.description'),
    },
    {
      property: 'og:url',
      content: 'https://vtaiwan.tw/404',
    },
    {
      property: 'twitter:title',
      content: t('notFound.title'),
    },
    {
      property: 'twitter:description',
      content: t('notFound.description'),
    },
  ],
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md text-center">
      <!-- 404 圖示 -->
      <div class="mb-8">
        <div class="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-democratic-red/10">
          <IconWrapper name="alert-circle" type="primary" :size="64" />
        </div>
        <h1 class="mb-4 text-6xl font-bold text-gray-900">404</h1>
      </div>

      <!-- 錯誤訊息 -->
      <div class="mb-8">
        <h2 class="mb-4 text-2xl font-bold text-gray-900">
          {{ $t('notFound.title') }}
        </h2>
        <p class="mb-6 text-gray-600">
          {{ $t('notFound.description') }}
        </p>
        <p class="text-sm text-gray-500">
          {{ $t('notFound.suggestion') }}
        </p>
      </div>

      <!-- 操作按鈕 -->
      <div class="space-y-4">
        <router-link to="/" class="btn-primary block w-full rounded-md">
          {{ $t('notFound.buttons.backToHome') }}
        </router-link>

        <div class="flex gap-4">
          <router-link to="/topics" class="btn-outline flex-1 rounded-md">
            {{ $t('notFound.buttons.browseTopics') }}
          </router-link>
          <router-link to="/contact" class="btn-outline flex-1 rounded-md">
            {{ $t('notFound.buttons.contactUs') }}
          </router-link>
        </div>
      </div>

      <!-- 額外資訊 -->
      <div class="mt-12 border-t border-gray-200 pt-8">
        <p class="mb-4 text-sm text-gray-500">
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
  @apply bg-democratic-red px-6 py-3 font-medium text-white transition-colors hover:bg-democratic-red/90;
}

.btn-outline {
  @apply border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50;
}
</style>
