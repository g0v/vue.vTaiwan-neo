<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="bg-white rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold mb-8 text-center">{{ $t('privacy.title') }}</h1>

      <div class="prose max-w-none">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('privacy.introduction.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.introduction.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('privacy.dataCollection.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataCollection.content') }}</p>
          <ul class="list-disc pl-6 mb-4">
            <li>{{ $t('privacy.dataCollection.item1') }}</li>
            <li>{{ $t('privacy.dataCollection.item2') }}</li>
            <li>{{ $t('privacy.dataCollection.item3') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('privacy.dataUsage.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataUsage.content') }}</p>
          <ul class="list-disc pl-6 mb-4">
            <li>{{ $t('privacy.dataUsage.item1') }}</li>
            <li>{{ $t('privacy.dataUsage.item2') }}</li>
            <li>{{ $t('privacy.dataUsage.item3') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('privacy.dataSharing.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataSharing.content') }}</p>
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p class="font-semibold text-blue-800">{{ $t('privacy.dataSharing.highlight') }}</p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('privacy.dataSecurity.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataSecurity.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('privacy.userRights.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.userRights.content') }}</p>
          <ul class="list-disc pl-6 mb-4">
            <li>{{ $t('privacy.userRights.item1') }}</li>
            <li>{{ $t('privacy.userRights.item2') }}</li>
            <li>{{ $t('privacy.userRights.item3') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('privacy.contact.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.contact.content') }}</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p><strong>{{ $t('privacy.contact.email') }}:</strong> info@vtaiwan.tw</p>
            <p><strong>{{ $t('privacy.contact.github') }}:</strong> <a href="https://github.com/g0v/vue.vTaiwan-neo" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">https://github.com/g0v/vue.vTaiwan-neo</a></p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('privacy.updates.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.updates.content') }}</p>
          <p class="text-sm text-gray-600">{{ $t('privacy.updates.lastUpdated') }}</p>
        </section>
      </div>

      <div class="mt-8 text-center">
        <router-link to="/" class="btn-primary rounded-md">
          {{ $t('privacy.backToHome') }}
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
  title: t('privacy.title') + ' | vTaiwan',
  meta: [
    {
      name: 'description',
      content: t('privacy.metaDescription')
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
