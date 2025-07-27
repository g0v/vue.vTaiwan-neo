<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">{{ $t('about.title') }}</h1>

      <div class="prose max-w-none">
        <h2 class="text-2xl font-bold mb-4">{{ $t('about.mission.title') }}</h2>
        <p class="text-lg mb-6">
          {{ $t('about.mission.description') }}
        </p>

        <h2 class="text-2xl font-bold mb-4">{{ $t('about.values.title') }}</h2>
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-democratic-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconWrapper name="globe" type="primary" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('about.values.open.title') }}</h3>
            <p class="text-gray-600">{{ $t('about.values.open.description') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-jade-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconWrapper name="users" type="teal" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('about.values.collaborate.title') }}</h3>
            <p class="text-gray-600">{{ $t('about.values.collaborate.description') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-wheat-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconWrapper name="lightbulb" type="amber" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('about.values.coCreate.title') }}</h3>
            <p class="text-gray-600">{{ $t('about.values.coCreate.description') }}</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold mb-4">{{ $t('about.contact.title') }}</h2>
        <p class="mb-4">
          {{ $t('about.contact.description') }}
          <router-link to="/contact" class="text-democratic-red hover:underline">{{ $t('about.contact.contactUs') }}</router-link>
        </p>
        <ul class="space-y-2">
          <li class="flex items-center gap-2">
            <IconWrapper name="mail" :size="16" />
            <a href="mailto:contact@vtaiwan.org" class="text-democratic-red hover:underline">
              contact@vtaiwan.org
            </a>
          </li>
          <li class="flex items-center gap-2">
            <IconWrapper name="facebook" :size="16" />
            <a href="https://www.facebook.com/vtaiwan.tw/" target="_blank" class="text-democratic-red hover:underline">
              {{ $t('about.contact.facebook') }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconWrapper from '../components/IconWrapper.vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
const { t } = useI18n()
useHead({
  title: t('about.title') + ' | vTaiwan',
  meta: [
    {
      property: 'og:title',
      content: t('about.title') + ' | vTaiwan'
    },
    {
      property: 'og:description',
      content: t('about.mission.description')
    },
    {
      property: 'og:url',
      content: 'https://vtaiwan.tw/about'
    },
    {
      property: 'twitter:title',
      content: t('about.title') + ' | vTaiwan'
    },
    {
      property: 'twitter:description',
      content: t('about.mission.description')
    }
  ]
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
