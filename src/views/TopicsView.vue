<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '@/components/IconWrapper.vue'
import TopicCard from '@/components/TopicCard.vue'
import discourseApi, { type FormattedTopicData } from '@/lib/discourse'

defineOptions({ inheritAttrs: false })

type SortOption = 'latest' | 'participants' | 'views'

const { t, locale } = useI18n()
const topics = ref<FormattedTopicData[]>([])
const loading = ref(true)
const loadError = ref(false)
const searchQuery = ref('')
const sortBy = ref<SortOption>('latest')
const selectedStep = ref('')
const showBookmarksOnly = ref(false)
const bookmarkedIds = ref<number[]>([])
const lastUpdatedAt = ref<Date | null>(null)

const steps = ['即將開始', '意見徵集', '研擬草案', '送交院會', '歷史案件'] as const
const sortOptions: SortOption[] = ['latest', 'participants', 'views']

useHead({
  title: `${t('topics.title')} | vTaiwan`,
  meta: [
    { property: 'og:title', content: `${t('topics.title')} | vTaiwan` },
    { property: 'og:description', content: t('topics.description') },
    { property: 'og:url', content: 'https://vtaiwan.tw/topics' },
    { property: 'twitter:title', content: `${t('topics.title')} | vTaiwan` },
    { property: 'twitter:description', content: t('topics.description') },
  ],
})

const lastUpdated = computed(() => {
  if (!lastUpdatedAt.value) return ''
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeStyle: 'short' }).format(lastUpdatedAt.value)
})

const filteredTopics = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase(locale.value)
  const filtered = topics.value.filter(topic => {
    if (showBookmarksOnly.value && !bookmarkedIds.value.includes(topic.id)) return false
    if (selectedStep.value && topic.status !== selectedStep.value) return false
    if (!query) return true

    return [topic.title, topic.slogan, topic.status, ...(topic.tags || [])].some(value => value?.toLocaleLowerCase(locale.value).includes(query))
  })

  return [...filtered].sort((a, b) => {
    if (sortBy.value === 'participants') return (b.participant_count || 0) - (a.participant_count || 0)
    if (sortBy.value === 'views') return (b.views || 0) - (a.views || 0)
    return new Date(b.last_posted_at || b.created_at).getTime() - new Date(a.last_posted_at || a.created_at).getTime()
  })
})

const hasActiveFilters = computed(() => Boolean(searchQuery.value || selectedStep.value || showBookmarksOnly.value))

const loadBookmarks = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('bookmarkedTopics') || '[]')
    bookmarkedIds.value = Array.isArray(stored) ? stored.map(Number).filter(Number.isFinite) : []
  } catch {
    bookmarkedIds.value = []
  }
}

const saveBookmarks = () => {
  localStorage.setItem('bookmarkedTopics', JSON.stringify(bookmarkedIds.value))
}

const isBookmarked = (topic: FormattedTopicData) => bookmarkedIds.value.includes(topic.id)

const bookmarkTopic = (topic: FormattedTopicData) => {
  const index = bookmarkedIds.value.indexOf(topic.id)
  if (index === -1) bookmarkedIds.value.push(topic.id)
  else bookmarkedIds.value.splice(index, 1)
  saveBookmarks()
}

const shareTopic = async (topic: FormattedTopicData) => {
  const url = `${window.location.origin}/topic/${topic.routeName || topic.id}`
  if (navigator.share) {
    await navigator.share({ title: topic.title, text: topic.slogan, url }).catch(() => undefined)
    return
  }
  await navigator.clipboard?.writeText(url)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStep.value = ''
  showBookmarksOnly.value = false
}

const loadTopics = async () => {
  loading.value = true
  loadError.value = false
  try {
    topics.value = await discourseApi.getFormattedTopics()
    lastUpdatedAt.value = new Date()
  } catch (error) {
    console.error('Error loading topics:', error)
    loadError.value = true
  } finally {
    loading.value = false
  }
}

watch(topics, loadBookmarks)

onMounted(() => {
  loadBookmarks()
  loadTopics()
})
</script>

<template>
  <main class="vt-page-shell min-h-[70vh] px-6 py-16 sm:py-20">
    <div class="mx-auto max-w-6xl">
      <p class="vt-section-label">{{ t('topics.eyebrow') }}</p>
      <h1 class="mb-4 text-[clamp(2.25rem,5vw,2.75rem)] tracking-[-0.02em]">
        <span class="vt-title-underline">{{ t('topics.title') }}</span>
      </h1>
      <p class="text-vt-gray-700 mb-9 max-w-[58ch]">
        {{ t('topics.description') }}
        <RouterLink to="/polis" class="text-democratic-red ml-1 underline underline-offset-4">{{ t('topics.tryPolisLink') }}</RouterLink>
      </p>

      <section class="vt-glass-panel mb-8 p-5 sm:p-6" :aria-label="t('topics.filters.label')">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label class="relative min-w-0 flex-1">
            <span class="sr-only">{{ t('topics.search.label') }}</span>
            <IconWrapper name="search" :size="18" color="currentColor" class="text-vt-gray-400 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2" aria-hidden="true" />
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('topics.search.placeholder')"
              class="border-vt-border text-vt-gray-800 focus:border-democratic-red focus:ring-vt-red-tint w-full rounded-full border bg-white/80 py-3 pr-12 pl-11 font-sans text-sm transition outline-none focus:ring-3"
            />
            <button v-if="searchQuery" type="button" class="vt-icon-button absolute top-1/2 right-2 -translate-y-1/2" :aria-label="t('topics.search.clearSearch')" @click="searchQuery = ''">
              <IconWrapper name="x" :size="15" color="currentColor" aria-hidden="true" />
            </button>
          </label>

          <div class="flex flex-wrap gap-2" :aria-label="t('topics.sort.label')">
            <button v-for="option in sortOptions" :key="option" type="button" class="vt-filter-chip" :aria-pressed="sortBy === option" @click="sortBy = option">
              {{ t(`topics.sort.${option}`) }}
            </button>
          </div>
        </div>

        <div class="border-vt-border mt-5 flex flex-col gap-4 border-t pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap gap-2" :aria-label="t('topics.filters.stage')">
            <button type="button" class="vt-filter-chip" :aria-pressed="selectedStep === ''" @click="selectedStep = ''">{{ t('topics.steps.all') }}</button>
            <button v-for="step in steps" :key="step" type="button" class="vt-filter-chip" :aria-pressed="selectedStep === step" @click="selectedStep = selectedStep === step ? '' : step">
              {{ t(`topics.steps.${step}`) }}
            </button>
          </div>

          <button type="button" class="vt-filter-chip inline-flex items-center justify-center gap-2" :aria-pressed="showBookmarksOnly" @click="showBookmarksOnly = !showBookmarksOnly">
            <IconWrapper name="bookmark" :size="16" color="currentColor" :class="showBookmarksOnly ? 'fill-current' : ''" aria-hidden="true" />
            {{ t('topics.bookmarks.myBookmarks') }}
          </button>
        </div>
      </section>

      <div v-if="!loading && !loadError" class="text-vt-gray-700 mb-6 flex flex-col gap-1 font-sans text-sm sm:flex-row sm:items-center sm:justify-between">
        <span>{{ t('topics.list.found', { count: filteredTopics.length }) }}</span>
        <span v-if="lastUpdated">{{ t('topics.list.lastUpdated') }}：{{ lastUpdated }}</span>
      </div>

      <div v-if="loading" class="grid gap-5 min-[768px]:grid-cols-2 min-[1186px]:grid-cols-3" aria-busy="true" :aria-label="t('topics.list.loading')">
        <div v-for="index in 6" :key="index" class="vt-glass-panel min-h-[240px] space-y-5 p-6">
          <div class="flex items-center gap-4">
            <div class="bg-vt-gray-200 h-10 w-10 animate-pulse rounded-full"></div>
            <div class="bg-vt-gray-200 h-6 w-3/5 animate-pulse rounded-full"></div>
          </div>
          <div class="bg-vt-gray-200 h-4 w-full animate-pulse rounded-full"></div>
          <div class="bg-vt-gray-200 h-4 w-4/5 animate-pulse rounded-full"></div>
          <div class="bg-vt-gray-200 mt-8 h-4 w-2/3 animate-pulse rounded-full"></div>
        </div>
      </div>

      <section v-else-if="loadError" class="vt-glass-panel px-6 py-14 text-center" role="alert">
        <IconWrapper name="wifi-off" :size="40" color="currentColor" class="text-vt-gray-400 mx-auto mb-4" aria-hidden="true" />
        <h2 class="mb-2 text-2xl">{{ t('topics.list.loadError') }}</h2>
        <p class="text-vt-gray-700 mb-6">{{ t('topics.list.loadErrorDescription') }}</p>
        <button type="button" class="vt-btn vt-btn-primary" @click="loadTopics">{{ t('common.retry') }}</button>
      </section>

      <div v-else-if="filteredTopics.length" class="grid gap-5 min-[768px]:grid-cols-2 min-[1186px]:grid-cols-3">
        <TopicCard v-for="topic in filteredTopics" :key="topic.id" :topic="topic" :bookmarked="isBookmarked(topic)" show-actions @share="shareTopic" @toggle-bookmark="bookmarkTopic" />
      </div>

      <section v-else class="vt-glass-panel px-6 py-14 text-center">
        <IconWrapper name="search-x" :size="40" color="currentColor" class="text-vt-gray-400 mx-auto mb-4" aria-hidden="true" />
        <h2 class="mb-2 text-2xl">{{ hasActiveFilters ? t('topics.search.noResults') : t('topics.list.empty') }}</h2>
        <button v-if="hasActiveFilters" type="button" class="text-democratic-red mt-4 font-sans font-medium underline underline-offset-4" @click="clearFilters">
          {{ t('topics.filters.clearAll') }}
        </button>
      </section>
    </div>
  </main>
</template>
