<template>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <div class="rounded-lg bg-white p-8 shadow-md">
      <h1 class="mb-8 text-center text-3xl font-bold">{{ $t('privacy.title') }}</h1>

      <div class="prose max-w-none">
        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold">{{ $t('privacy.introduction.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.introduction.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold">{{ $t('privacy.dataCollection.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataCollection.content') }}</p>
          <ul class="mb-4 list-disc pl-6">
            <li>{{ $t('privacy.dataCollection.item1') }}</li>
            <li>{{ $t('privacy.dataCollection.item2') }}</li>
            <li>{{ $t('privacy.dataCollection.item3') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold">{{ $t('privacy.dataUsage.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataUsage.content') }}</p>
          <ul class="mb-4 list-disc pl-6">
            <li>{{ $t('privacy.dataUsage.item1') }}</li>
            <li>{{ $t('privacy.dataUsage.item2') }}</li>
            <li>{{ $t('privacy.dataUsage.item3') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold">{{ $t('privacy.dataSharing.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataSharing.content') }}</p>
          <div class="mb-4 border-l-4 border-blue-400 bg-blue-50 p-4">
            <p class="font-semibold text-blue-800">{{ $t('privacy.dataSharing.highlight') }}</p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold">{{ $t('privacy.dataSecurity.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataSecurity.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold">{{ $t('privacy.userRights.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.userRights.content') }}</p>
          <ul class="mb-4 list-disc pl-6">
            <li>{{ $t('privacy.userRights.item1') }}</li>
            <li>{{ $t('privacy.userRights.item2') }}</li>
            <li>{{ $t('privacy.userRights.item3') }}</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold">{{ $t('privacy.contact.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.contact.content') }}</p>
          <div class="rounded-lg bg-gray-50 p-4">
            <p>
              <strong>{{ $t('privacy.contact.email') }}:</strong> info@vtaiwan.tw
            </p>
            <p>
              <strong>{{ $t('privacy.contact.github') }}:</strong>
              <a href="https://github.com/g0v/vue.vTaiwan-neo" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">https://github.com/g0v/vue.vTaiwan-neo</a>
            </p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-2xl font-semibold">{{ $t('privacy.updates.title') }}</h2>
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
      content: t('privacy.metaDescription'),
    },
  ],
})
</script>

<style scoped>
.prose h2 {
  @apply text-gray-900;
}

.prose p {
  @apply leading-relaxed text-gray-700;
}

.prose ul {
  @apply text-gray-700;
}

.prose li {
  @apply mb-2;
}
</style>
