<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-8 text-3xl font-bold">{{ t('about.title') }}</h1>

      <div class="prose max-w-none">
        <h2 class="mb-4 text-2xl font-bold">{{ t('about.mission.title') }}</h2>
        <p class="mb-6 text-lg">
          {{ t('about.mission.description') }}
        </p>

        <h2 class="mb-4 text-2xl font-bold">{{ t('about.values.title') }}</h2>
        <div class="mb-8 grid gap-6 md:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-democratic-red/10">
              <IconWrapper name="globe" type="primary" :size="32" />
            </div>
            <h3 class="mb-2 text-xl font-bold">{{ t('about.values.open.title') }}</h3>
            <p class="text-gray-600">{{ t('about.values.open.description') }}</p>
          </div>
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-jade-green/10">
              <IconWrapper name="users" type="teal" :size="32" />
            </div>
            <h3 class="mb-2 text-xl font-bold">{{ t('about.values.collaborate.title') }}</h3>
            <p class="text-gray-600">{{ t('about.values.collaborate.description') }}</p>
          </div>
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wheat-yellow/10">
              <IconWrapper name="lightbulb" type="amber" :size="32" />
            </div>
            <h3 class="mb-2 text-xl font-bold">{{ t('about.values.coCreate.title') }}</h3>
            <p class="text-gray-600">{{ t('about.values.coCreate.description') }}</p>
          </div>
        </div>

        <h2 class="mb-4 text-2xl font-bold">{{ t('about.contact.title') }}</h2>
        <p class="mb-4">
          {{ t('about.contact.description') }}
          <router-link to="/contact" class="text-democratic-red hover:underline">{{ t('about.contact.contactUs') }}</router-link>
        </p>
        <ul class="space-y-2">
          <li class="flex items-center gap-2">
            <IconWrapper name="mail" :size="16" />
            <a href="mailto:info@vtaiwan.tw" class="text-democratic-red hover:underline"> info@vtaiwan.tw </a>
          </li>
          <li class="flex items-center gap-2">
            <IconWrapper name="facebook" :size="16" />
            <a href="https://www.facebook.com/vtaiwan.tw/" target="_blank" class="text-democratic-red hover:underline">
              {{ t('about.contact.facebook') }}
            </a>
          </li>
          <li class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 16px; height: 16px">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v10H6V3h7z" />
              <path d="M8 12h8v2H8zm0 4h5v2H8z" />
            </svg>
            <a href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">
              <span>HackMD</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconWrapper from '@/components/IconWrapper.vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

const { t } = useI18n()

useHead({
  title: t('about.title') + ' | vTaiwan',
  meta: [
    {
      property: 'og:title',
      content: t('about.title') + ' | vTaiwan',
    },
    {
      property: 'og:description',
      content: t('about.mission.description'),
    },
    {
      property: 'og:url',
      content: 'https://vtaiwan.tw/about',
    },
    {
      property: 'twitter:title',
      content: t('about.title') + ' | vTaiwan',
    },
    {
      property: 'twitter:description',
      content: t('about.mission.description'),
    },
  ],
})
</script>
