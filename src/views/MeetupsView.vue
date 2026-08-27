<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '@/components/IconWrapper.vue'

defineOptions({ inheritAttrs: false })

const { t } = useI18n()

useHead({
  title: `${t('meetups.title')} | vTaiwan`,
})
</script>

<template>
  <main class="vt-page-shell px-6 py-16 sm:py-20">
    <div class="mx-auto max-w-5xl">
      <p class="vt-section-label">{{ t('meetups.eyebrow') }}</p>
      <h1 class="mb-4 text-[clamp(2.25rem,5vw,2.75rem)] tracking-[-0.02em]">
        <span class="vt-title-underline">{{ t('meetups.title') }}</span>
      </h1>
      <p class="text-vt-gray-700 mb-10 max-w-[58ch]">{{ t('meetups.description') }}</p>

      <section class="mb-8 grid gap-5 sm:grid-cols-2" :aria-label="t('meetups.participation.title')">
        <RouterLink to="/jitsi" class="vt-glass-panel group flex items-center gap-5 p-6 transition hover:-translate-y-0.5">
          <span class="vt-topic-bubble vt-topic-bubble-green" aria-hidden="true"><IconWrapper name="video" :size="24" color="currentColor" /></span>
          <span class="min-w-0">
            <span class="mb-1 flex flex-wrap items-center gap-2">
              <strong class="text-vt-gray-800 text-lg">{{ t('meetups.jitsi') }}</strong>
              <span class="bg-vt-green-tint text-jade-green rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold tracking-wide uppercase">{{ t('meetups.beta') }}</span>
            </span>
            <span class="text-vt-gray-700 block font-sans text-sm">{{ t('meetups.schedule') }}</span>
          </span>
          <IconWrapper
            name="arrow-right"
            :size="18"
            color="currentColor"
            class="text-vt-gray-400 group-hover:text-jade-green ml-auto shrink-0 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </RouterLink>

        <RouterLink to="/transcriptions" class="vt-glass-panel group flex items-center gap-5 p-6 transition hover:-translate-y-0.5">
          <span class="vt-topic-bubble vt-topic-bubble-orange" aria-hidden="true"><IconWrapper name="file-text" :size="24" color="currentColor" /></span>
          <span class="min-w-0">
            <span class="mb-1 flex flex-wrap items-center gap-2">
              <strong class="text-vt-gray-800 text-lg">{{ t('meetups.transcriptions') }}</strong>
              <span class="bg-vt-yellow-tint text-wheat-yellow rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold tracking-wide uppercase">{{ t('meetups.beta') }}</span>
            </span>
            <span class="text-vt-gray-700 block font-sans text-sm">{{ t('meetups.transcriptionsDescription') }}</span>
          </span>
          <IconWrapper
            name="arrow-right"
            :size="18"
            color="currentColor"
            class="text-vt-gray-400 group-hover:text-wheat-yellow ml-auto shrink-0 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </RouterLink>
      </section>

      <section class="vt-glass-panel overflow-hidden p-4 sm:p-6" aria-labelledby="meetups-calendar-title">
        <div class="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="vt-section-label">{{ t('meetups.calendar.eyebrow') }}</p>
            <h2 id="meetups-calendar-title" class="mb-2 text-2xl tracking-[-0.01em]">{{ t('meetups.calendar.title') }}</h2>
            <p class="text-vt-gray-700 m-0 max-w-[54ch]">{{ t('meetups.calendar.description') }}</p>
          </div>
          <a
            href="https://calendar.google.com/calendar/u/2?cid=MjhlZDRjMjYwOGQyMTc3NTZjNjJiOWMxOGYyMjhkNDJjNGY0MzcxNWViYTUxN2FkYmNiOTE2MGZhMzY5NDRhN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-democratic-red shadow-democratic-red/20 hover:bg-democratic-red/90 inline-flex shrink-0 items-center gap-2 self-start rounded-full px-5 py-3 font-sans text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 sm:self-auto"
          >
            <IconWrapper name="calendar-plus" :size="17" color="currentColor" aria-hidden="true" />
            {{ t('meetups.calendar.googleCalendar') }}
          </a>
        </div>

        <div class="border-vt-border overflow-hidden rounded-2xl border bg-white">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=28ed4c2608d217756c62b9c18f228d42c4f43715eba517adbcb9160fa36944a7%40group.calendar.google.com&ctz=Asia%2FTaipei"
            :title="t('meetups.calendar.title')"
            class="h-[480px] w-full border-0 sm:h-[560px] lg:h-[640px]"
            loading="lazy"
            scrolling="no"
          ></iframe>
        </div>
      </section>

      <section class="bg-ink mt-8 rounded-[22px] px-6 py-10 text-center text-white sm:px-10" aria-labelledby="host-meetup-title">
        <p class="vt-section-label text-white/55">{{ t('meetups.host.eyebrow') }}</p>
        <h2 id="host-meetup-title" class="mb-3 text-3xl">{{ t('meetups.host.title') }}</h2>
        <p class="mx-auto mb-6 max-w-2xl text-white/70">{{ t('meetups.host.description') }}</p>
        <RouterLink to="/contact" class="vt-btn vt-btn-primary">{{ t('meetups.host.contactUs') }}</RouterLink>
      </section>
    </div>
  </main>
</template>
