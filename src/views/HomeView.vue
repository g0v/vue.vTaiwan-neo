<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import { useHead } from '@unhead/vue'

const { t } = useI18n()

useHead({
  title: t('home.title'),
  meta: [
    {
      property: 'og:title',
      content: t('home.title'),
    },
    {
      property: 'og:description',
      content: t('home.hero.subtitle'),
    },
    {
      property: 'og:url',
      content: 'https://vtaiwan.tw/',
    },
    {
      property: 'twitter:title',
      content: t('home.title'),
    },
    {
      property: 'twitter:description',
      content: t('home.hero.subtitle'),
    },
  ],
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-black py-20 text-white">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="mb-5 text-4xl font-bold md:text-5xl">
            <div>
              <span class="text-democratic-red">{{ t('home.hero.title.open') }}</span
              >、<span class="text-jade-green">{{ t('home.hero.title.collaborate') }}</span
              >、<span class="text-wheat-yellow">{{ t('home.hero.title.coCreate') }}</span>
            </div>
            <div class="mt-3">{{ t('home.hero.title.taiwanFuture') }}</div>
          </h1>
          <p class="mb-8 text-xl">{{ t('home.hero.subtitle') }}</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/topics" class="btn-primary rounded-md">
              {{ t('home.hero.buttons.browseTopics') }}
            </router-link>
            <router-link to="/intro" class="btn-outline-white rounded-md">
              {{ t('home.hero.buttons.learnMore') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-100 py-16">
      <div class="container mx-auto px-4">
        <h2 class="mb-12 text-center text-3xl font-bold">
          <span class="title-underline">{{ t('home.features.title') }}</span>
        </h2>

        <div class="grid gap-8 md:grid-cols-3">
          <div class="rounded-lg bg-white p-8 text-center shadow-md">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-democratic-red/10">
              <IconWrapper name="message-circle" type="primary" :size="32" />
            </div>
            <h3 class="mb-4 text-xl font-bold">{{ t('home.features.items.propose.title') }}</h3>
            <p class="text-gray-700">{{ t('home.features.items.propose.description') }}</p>
          </div>

          <div class="rounded-lg bg-white p-8 text-center shadow-md">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-jade-green/10">
              <IconWrapper name="users" type="teal" :size="32" />
            </div>
            <h3 class="mb-4 text-xl font-bold">{{ t('home.features.items.discuss.title') }}</h3>
            <p class="text-gray-700">{{ t('home.features.items.discuss.description') }}</p>
          </div>

          <div class="rounded-lg bg-white p-8 text-center shadow-md">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-wheat-yellow/10">
              <IconWrapper name="check-circle" type="amber" :size="32" />
            </div>
            <h3 class="mb-4 text-xl font-bold">{{ t('home.features.items.policy.title') }}</h3>
            <p class="text-gray-700">{{ t('home.features.items.policy.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-black py-16 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="mb-6 text-3xl font-bold">{{ t('home.cta.title') }}</h2>
        <p class="mx-auto mb-8 max-w-2xl text-xl">{{ t('home.cta.description') }}</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/topics" class="btn-primary rounded-md">
            {{ t('home.cta.buttons.browseTopics') }}
          </router-link>
          <router-link to="/intro" class="btn-outline-white rounded-md">
            {{ t('home.cta.buttons.learnMore') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
