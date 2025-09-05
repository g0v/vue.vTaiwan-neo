<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="bg-white rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold mb-8 text-center">{{ $t('terms.title') }}</h1>

      <div class="prose max-w-none">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.introduction.title') }}</h2>
          <p class="mb-4">{{ $t('terms.introduction.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.acceptance.title') }}</h2>
          <p class="mb-4">{{ $t('terms.acceptance.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.account.title') }}</h2>
          <p class="mb-4">{{ $t('terms.account.content') }}</p>
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p class="font-semibold text-yellow-800">{{ $t('terms.account.highlight') }}</p>
          </div>
          <ul class="list-disc pl-6 mb-4">
            <li>{{ $t('terms.account.item1') }}</li>
            <li>{{ $t('terms.account.item2') }}</li>
            <li>{{ $t('terms.account.item3') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.videoService.title') }}</h2>
          <p class="mb-4">{{ $t('terms.videoService.content') }}</p>
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p class="font-semibold text-blue-800">{{ $t('terms.videoService.highlight') }}</p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.transcriptionService.title') }}</h2>
          <p class="mb-4">{{ $t('terms.transcriptionService.content') }}</p>
          <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <p class="font-semibold text-green-800">{{ $t('terms.transcriptionService.highlight') }}</p>
          </div>
          <ul class="list-disc pl-6 mb-4">
            <li>{{ $t('terms.transcriptionService.item1') }}</li>
            <li>{{ $t('terms.transcriptionService.item2') }}</li>
            <li>{{ $t('terms.transcriptionService.item3') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.contentLicense.title') }}</h2>
          <p class="mb-4">{{ $t('terms.contentLicense.content') }}</p>
          <div class="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
            <p class="font-semibold text-purple-800">{{ $t('terms.contentLicense.highlight') }}</p>
          </div>
          <p class="mb-4">{{ $t('terms.contentLicense.details') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.userConduct.title') }}</h2>
          <p class="mb-4">{{ $t('terms.userConduct.content') }}</p>
          <ul class="list-disc pl-6 mb-4">
            <li>{{ $t('terms.userConduct.item1') }}</li>
            <li>{{ $t('terms.userConduct.item2') }}</li>
            <li>{{ $t('terms.userConduct.item3') }}</li>
            <li>{{ $t('terms.userConduct.item4') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.disclaimer.title') }}</h2>
          <p class="mb-4">{{ $t('terms.disclaimer.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.modifications.title') }}</h2>
          <p class="mb-4">{{ $t('terms.modifications.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.contact.title') }}</h2>
          <p class="mb-4">{{ $t('terms.contact.content') }}</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p><strong>{{ $t('terms.contact.email') }}:</strong> info@vtaiwan.tw</p>
            <p><strong>{{ $t('terms.contact.github') }}:</strong> <a href="https://github.com/g0v/vue.vTaiwan-neo" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">https://github.com/g0v/vue.vTaiwan-neo</a></p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('terms.effectiveDate.title') }}</h2>
          <p class="mb-4">{{ $t('terms.effectiveDate.content') }}</p>
          <p class="text-sm text-gray-600">{{ $t('terms.effectiveDate.lastUpdated') }}</p>
        </section>
      </div>

      <div class="mt-8 text-center">
        <router-link to="/" class="btn-primary rounded-md">
          {{ $t('terms.backToHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

const { t } = useI18n()

useHead({
  title: t('terms.title') + ' | vTaiwan',
  meta: [
    {
      name: 'description',
      content: t('terms.metaDescription')
    }
  ]
})
</script>

<style scoped>
.prose h2 {
  @apply text-gray-900;
}

.prose p {
  @apply text-gray-700 leading-relaxed;
}

.prose ul {
  @apply text-gray-700;
}

.prose li {
  @apply mb-2;
}
</style>
