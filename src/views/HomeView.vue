<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import TopicCard from '@/components/TopicCard.vue'
import discourseApi, { type FormattedTopicData } from '@/lib/discourse'
import { useHead } from '@unhead/vue'

const { t } = useI18n()

// 本頁採 hono 的多段 section 版型（fragment root），不承接 router-view 傳下的 user/userData 等屬性
defineOptions({ inheritAttrs: false })

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

// 「如何運作」三步驟 — 對應三種公民色；文字由 i18n 提供
const steps = [
  { key: 'propose', color: 'red', icon: 'message-circle' },
  { key: 'discuss', color: 'green', icon: 'users' },
  { key: 'policy', color: 'orange', icon: 'circle-check-big' },
]

const topics = ref<FormattedTopicData[]>([])
const topicsLoading = ref(true)
const topicsLoadError = ref(false)

const activeTopics = computed(() =>
  topics.value
    .filter(topic => topic.status !== '歷史案件' && topic.status !== '研擬草案' && topic.status !== '送交院會')
    .sort((a, b) => new Date(b.last_posted_at || b.created_at).getTime() - new Date(a.last_posted_at || a.created_at).getTime())
    .slice(0, 3)
)

const loadActiveTopics = async () => {
  topicsLoading.value = true
  topicsLoadError.value = false
  try {
    topics.value = await discourseApi.getFormattedTopics()
  } catch (error) {
    console.error('Error loading active topics:', error)
    topicsLoadError.value = true
  } finally {
    topicsLoading.value = false
  }
}

onMounted(loadActiveTopics)
</script>

<template>
  <!-- Hero -->
  <section class="vt-hero-bg vt-under-navbar flex min-h-screen items-center text-white">
    <div class="mx-auto h-fit w-full max-w-5xl px-6 pb-4">
      <div class="mb-12 inline-flex items-center gap-3.5 pt-[156px] font-sans text-[13px] font-semibold tracking-[0.22em] text-white/55 uppercase sm:pt-[184px]">
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
  <section class="vt-page-shell py-16 sm:py-20">
    <div class="mx-auto max-w-6xl px-6">
      <p class="vt-section-label text-center">{{ t('home.features.eyebrow') }}</p>
      <h2 class="mb-12 text-center text-3xl font-bold sm:text-4xl">
        <span class="vt-title-underline">{{ t('home.features.title') }}</span>
      </h2>

      <div class="grid gap-6 md:grid-cols-3">
        <div v-for="step in steps" :key="step.key" class="vt-glass-panel p-8 transition-transform duration-200 hover:-translate-y-1">
          <div class="vt-topic-bubble mb-4" :class="`vt-topic-bubble-${step.color}`">
            <IconWrapper :name="step.icon" :size="24" color="currentColor" />
          </div>
          <h3 class="mb-3 text-lg font-bold">{{ t(`home.features.items.${step.key}.title`) }}</h3>
          <p class="text-vt-gray-700">{{ t(`home.features.items.${step.key}.description`) }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 進行中的議題 -->
  <section class="vt-page-shell border-t border-white/70 py-16 sm:py-20" aria-labelledby="active-topics-title">
    <div class="mx-auto max-w-6xl px-6">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="vt-section-label">{{ t('home.activeTopics.eyebrow') }}</p>
          <h2 id="active-topics-title" class="m-0 text-3xl font-bold sm:text-4xl">
            <span class="vt-title-underline">{{ t('home.activeTopics.title') }}</span>
          </h2>
        </div>
        <RouterLink to="/topics" class="text-democratic-red inline-flex items-center gap-2 font-sans text-sm font-medium">
          {{ t('home.activeTopics.viewAll') }}
          <IconWrapper name="arrow-right" :size="15" color="currentColor" aria-hidden="true" />
        </RouterLink>
      </div>

      <div v-if="topicsLoading" class="grid gap-5 min-[768px]:grid-cols-2 min-[1186px]:grid-cols-3" :aria-label="t('topics.list.loading')" aria-busy="true">
        <div v-for="index in 3" :key="index" class="vt-glass-panel min-h-[240px] space-y-5 p-6">
          <div class="flex items-center gap-4">
            <div class="bg-vt-gray-200 h-10 w-10 animate-pulse rounded-full"></div>
            <div class="bg-vt-gray-200 h-6 w-3/5 animate-pulse rounded-full"></div>
          </div>
          <div class="bg-vt-gray-200 h-4 w-full animate-pulse rounded-full"></div>
          <div class="bg-vt-gray-200 h-4 w-4/5 animate-pulse rounded-full"></div>
          <div class="bg-vt-gray-200 mt-8 h-4 w-2/3 animate-pulse rounded-full"></div>
        </div>
      </div>
      <div v-else-if="activeTopics.length" class="grid gap-5 min-[768px]:grid-cols-2 min-[1186px]:grid-cols-3">
        <TopicCard v-for="topic in activeTopics" :key="topic.id" :topic="topic" />
      </div>
      <div v-else class="vt-glass-panel text-vt-gray-700 px-6 py-10 text-center">
        <p>{{ topicsLoadError ? t('home.activeTopics.loadError') : t('home.activeTopics.empty') }}</p>
        <button v-if="topicsLoadError" type="button" class="text-democratic-red mt-4 font-sans font-medium underline underline-offset-4" @click="loadActiveTopics">
          {{ t('common.retry') }}
        </button>
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
