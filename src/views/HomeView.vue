<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'

const { t } = useI18n()

// 「如何運作」三步驟 — 對應三種公民色；文字由 i18n 提供
const steps = [
  { key: 'propose', color: 'red', icon: 'message-circle' },
  { key: 'discuss', color: 'green', icon: 'users' },
  { key: 'policy', color: 'orange', icon: 'circle-check-big' },
]
</script>

<template>
  <!-- Hero -->
  <section class="vt-hero-bg vt-under-navbar flex min-h-screen items-center text-white">
    <div class="mx-auto h-fit w-full max-w-5xl px-6">
      <div class="mb-12 inline-flex items-center gap-3.5 font-sans text-[13px] font-semibold tracking-[0.22em] text-white/55 uppercase">
        <span class="h-px w-7 bg-white/45" />
        {{ t('home.hero.eyebrow') }}
      </div>

      <h1 class="mb-9 text-[clamp(2.75rem,7vw,4.75rem)] leading-[1.1] font-bold tracking-[-0.02em]">
        <span class="text-democratic-red">{{ t('home.hero.title.open') }}</span
        >、<span class="text-jade-green">{{ t('home.hero.title.collaborate') }}</span
        >、<span class="text-wheat-yellow">{{ t('home.hero.title.coCreate') }}</span>
        <span class="mt-6 block font-normal text-white/55">{{ t('home.hero.title.taiwanFuture') }}</span>
      </h1>

      <p class="mb-12 max-w-[44ch] text-lg leading-relaxed text-white/70 sm:text-xl">
        {{ t('home.hero.subtitle') }}
      </p>

      <div class="flex flex-wrap gap-3">
        <RouterLink to="/topics" class="vt-btn vt-btn-outline">
          {{ t('home.hero.buttons.browseTopics') }}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </RouterLink>
        <RouterLink to="/intro" class="vt-btn vt-btn-primary">{{ t('home.hero.buttons.learnMore') }}</RouterLink>
      </div>
    </div>
  </section>

  <!-- 如何運作 -->
  <section class="bg-vt-gray-100 py-16 sm:py-20">
    <div class="mx-auto max-w-6xl px-6">
      <h2 class="mb-12 text-center text-3xl font-bold sm:text-4xl">
        <span class="vt-title-underline">{{ t('home.features.title') }}</span>
      </h2>

      <div class="grid gap-6 md:grid-cols-3">
        <div v-for="step in steps" :key="step.key" class="rounded-3xl bg-white p-8 shadow-lg transition-transform duration-200 hover:-translate-y-1">
          <div class="vt-topic-bubble mb-4" :class="`vt-topic-bubble-${step.color}`">
            <IconWrapper :name="step.icon" :size="24" />
          </div>
          <h3 class="mb-3 text-lg font-bold">{{ t(`home.features.items.${step.key}.title`) }}</h3>
          <p class="text-vt-gray-700">{{ t(`home.features.items.${step.key}.description`) }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-ink py-16 text-center text-white sm:py-20">
    <div class="mx-auto max-w-3xl px-6">
      <h2 class="mb-6 text-3xl font-bold sm:text-4xl">{{ t('home.cta.title') }}</h2>
      <p class="mx-auto mb-8 max-w-2xl text-lg text-white/70">
        {{ t('home.cta.description') }}
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <RouterLink to="/topics" class="vt-btn vt-btn-outline">{{ t('home.cta.buttons.browseTopics') }}</RouterLink>
        <RouterLink to="/intro" class="vt-btn vt-btn-primary">{{ t('home.cta.buttons.learnMore') }}</RouterLink>
      </div>

      <div class="mx-auto mt-12 max-w-2xl">
        <p class="mb-6 text-3xl font-bold">
          <span class="block">{{ t('home.cta.make.descriptionLine1') }}</span>
          <span class="block">{{ t('home.cta.make.descriptionLine2') }}</span>
        </p>
        <p class="text-xl">
          {{ t('home.cta.make.reference') }}
          <a href="https://make.vtaiwan.tw" target="_blank" rel="noopener noreferrer" class="underline hover:text-white/60">
            {{ t('home.cta.make.linkText') }}
          </a>
        </p>
      </div>
    </div>
  </section>
</template>