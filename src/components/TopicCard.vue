<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormattedTopicData } from '@/lib/discourse'
import IconWrapper from '@/components/IconWrapper.vue'

const props = withDefaults(
  defineProps<{
    topic: FormattedTopicData
    bookmarked?: boolean
    showActions?: boolean
  }>(),
  {
    bookmarked: false,
    showActions: false,
  }
)

defineEmits<{
  share: [topic: FormattedTopicData]
  toggleBookmark: [topic: FormattedTopicData]
}>()

const { t, locale } = useI18n()

const route = computed(() => `/topic/${props.topic.routeName || props.topic.id}`)
const formattedDate = computed(() => {
  const date = props.topic.last_posted_at || props.topic.created_at
  if (!date) return ''

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
})

const statusVisual = computed(() => {
  const visualMap: Record<string, { bubble: string; icon: string; dot: string }> = {
    即將開始: { bubble: 'vt-topic-bubble-orange', icon: 'calendar-clock', dot: 'bg-wheat-yellow' },
    意見徵集: { bubble: 'vt-topic-bubble-green', icon: 'messages-square', dot: 'bg-jade-green' },
    研擬草案: { bubble: 'vt-topic-bubble-red', icon: 'file-pen-line', dot: 'bg-democratic-red' },
    送交院會: { bubble: 'vt-topic-bubble-green', icon: 'landmark', dot: 'bg-jade-green' },
    歷史案件: { bubble: 'vt-topic-bubble-red', icon: 'archive', dot: 'bg-vt-gray-400' },
  }

  return visualMap[props.topic.status] || { bubble: 'vt-topic-bubble-red', icon: 'message-circle', dot: 'bg-vt-gray-400' }
})
</script>

<template>
  <article class="vt-glass-panel group hover:shadow-vt-lg relative flex min-h-[240px] flex-col p-6 transition duration-200 hover:-translate-y-1">
    <RouterLink
      :to="route"
      class="focus-visible:outline-democratic-red absolute inset-0 z-10 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-4"
      :aria-label="t('topics.card.open', { title: topic.title })"
    />

    <div class="mb-5 flex items-start gap-4">
      <span class="vt-topic-bubble vt-topic-bubble-sm" :class="statusVisual.bubble" aria-hidden="true">
        <IconWrapper :name="statusVisual.icon" :size="19" color="currentColor" />
      </span>
      <div class="min-w-0 flex-1">
        <h3 class="text-vt-gray-800 mb-1 line-clamp-2 text-lg leading-snug tracking-[-0.01em]">{{ topic.title }}</h3>
        <span class="text-vt-gray-700 inline-flex items-center gap-2 font-sans text-xs">
          <span class="h-1.5 w-1.5 rounded-full" :class="statusVisual.dot" aria-hidden="true"></span>
          {{ t(`topics.steps.${topic.status}`, topic.status) }}
        </span>
      </div>
      <span class="border-vt-red-tint text-democratic-red flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-white/70" aria-hidden="true">
        <IconWrapper name="arrow-up-right" :size="14" color="currentColor" />
      </span>
    </div>

    <p v-if="topic.slogan" class="text-vt-gray-700 mb-5 line-clamp-3 text-sm leading-7">{{ topic.slogan }}</p>

    <div class="border-vt-border text-vt-gray-700 mt-auto flex min-w-0 flex-wrap items-center gap-3 border-t pt-4 font-sans text-xs">
      <span v-if="topic.tags?.length" class="bg-vt-red-tint text-democratic-red max-w-[45%] truncate rounded-full px-2.5 py-1">{{ topic.tags[0] }}</span>
      <span v-if="formattedDate" class="text-vt-gray-400">{{ formattedDate }}</span>
      <span class="ml-auto inline-flex items-center gap-1.5" :aria-label="t('topics.metrics.participants')">
        <IconWrapper name="users" :size="14" color="currentColor" aria-hidden="true" />
        {{ topic.participant_count || 0 }}
      </span>

      <div v-if="showActions" class="border-vt-border relative z-20 flex items-center gap-1 border-l pl-2">
        <button type="button" class="vt-icon-button" :aria-label="t('topics.actions.share')" :title="t('topics.actions.share')" @click="$emit('share', topic)">
          <IconWrapper name="share-2" :size="15" color="currentColor" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="vt-icon-button"
          :class="bookmarked ? 'text-democratic-red' : 'text-vt-gray-700'"
          :aria-label="bookmarked ? t('topics.actions.removeBookmark') : t('topics.actions.bookmark')"
          :aria-pressed="bookmarked"
          :title="bookmarked ? t('topics.actions.removeBookmark') : t('topics.actions.bookmark')"
          @click="$emit('toggleBookmark', topic)"
        >
          <IconWrapper name="bookmark" :size="15" color="currentColor" :class="bookmarked ? 'fill-current' : ''" aria-hidden="true" />
        </button>
      </div>
    </div>
  </article>
</template>
