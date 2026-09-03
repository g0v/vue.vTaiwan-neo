<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

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
  <section class="vt-page-shell flex min-h-[70vh] items-center justify-center px-4 py-20">
    <div class="w-full max-w-xl text-center">
      <div class="text-democratic-red font-serif text-[clamp(7rem,24vw,10rem)] leading-none font-bold tracking-[-0.05em]" aria-hidden="true">404</div>
      <h1 class="mt-5 mb-0 text-3xl">{{ t('notFound.title') }}</h1>
      <p class="text-vt-gray-700 mt-3 text-lg leading-7">{{ t('notFound.description') }}</p>
      <p class="text-vt-gray-400 mt-2 text-sm leading-6">{{ t('notFound.suggestion') }}</p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <router-link to="/" class="vt-btn vt-btn-primary">{{ t('notFound.buttons.backToHome') }}</router-link>
        <router-link to="/topics" class="vt-btn vt-btn-ghost">{{ t('notFound.buttons.browseTopics') }}</router-link>
        <router-link to="/contact" class="vt-btn vt-btn-ghost">{{ t('notFound.buttons.contactUs') }}</router-link>
      </div>

      <div class="border-vt-border mt-12 border-t pt-7">
        <p class="text-vt-gray-700 font-sans text-sm font-semibold">{{ t('notFound.help.title') }}</p>
        <div class="text-vt-gray-400 mt-3 space-y-1 text-sm">
          <p>{{ t('notFound.help.checkUrl') }}</p>
          <p>{{ t('notFound.help.useNavigation') }}</p>
          <p>{{ t('notFound.help.contactSupport') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
