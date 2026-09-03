<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '@/components/IconWrapper.vue'
import { faqs } from '@/data/faqs'
import { sanitizeHtml } from '@/lib/sanitize'

const { t, locale } = useI18n()
const openId = ref<string | null>(faqs[0]?.id ?? null)
const currentLocale = computed<'zh-TW' | 'en' | 'ja'>(() => {
  if (locale.value === 'en' || locale.value === 'ja') return locale.value
  return 'zh-TW'
})

const toggleFaq = (id: string) => {
  openId.value = openId.value === id ? null : id
}

useHead({
  title: `${t('faq.title')} | vTaiwan`,
})
</script>

<template>
  <main class="vt-page-shell px-6 py-16 sm:py-20">
    <div class="mx-auto max-w-3xl">
      <p class="vt-section-label">{{ t('faq.eyebrow') }}</p>
      <h1 class="mb-4 text-[clamp(2.25rem,5vw,2.75rem)] tracking-[-0.02em]">
        <span class="vt-title-underline">{{ t('faq.title') }}</span>
      </h1>
      <p class="text-vt-gray-700 mb-9 max-w-[58ch]">{{ t('faq.description') }}</p>

      <section class="vt-glass-panel overflow-hidden px-6 py-1" :aria-label="t('faq.title')">
        <article v-for="faq in faqs" :key="faq.id" class="border-vt-border border-b last:border-b-0">
          <h2 class="m-0 text-lg">
            <button
              type="button"
              class="text-vt-gray-800 focus-visible:outline-democratic-red flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
              :aria-expanded="openId === faq.id"
              :aria-controls="`faq-panel-${faq.id}`"
              :id="`faq-trigger-${faq.id}`"
              @click="toggleFaq(faq.id)"
            >
              <span>{{ faq.question[currentLocale] }}</span>
              <span class="border-vt-border text-democratic-red relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white/70" aria-hidden="true">
                <IconWrapper :name="openId === faq.id ? 'x' : 'plus'" :size="16" color="currentColor" />
              </span>
            </button>
          </h2>

          <div v-show="openId === faq.id" :id="`faq-panel-${faq.id}`" class="faq-answer text-vt-gray-700 pr-12 pb-6 leading-7" role="region" :aria-labelledby="`faq-trigger-${faq.id}`">
            <div v-html="sanitizeHtml(faq.answer[currentLocale])"></div>
            <ol v-if="faq.details" class="mt-3 list-decimal space-y-2 pl-6">
              <li v-for="detail in faq.details[currentLocale]" :key="detail">{{ detail }}</li>
            </ol>
          </div>
        </article>
      </section>

      <section class="mt-12" :aria-labelledby="'faq-contact-title'">
        <p class="vt-section-label">{{ t('faq.contact.eyebrow') }}</p>
        <h2 id="faq-contact-title" class="mb-3 text-3xl tracking-[-0.01em]">{{ t('faq.contact.title') }}</h2>
        <p class="text-vt-gray-700 mb-6">{{ t('faq.contact.description') }}</p>

        <div class="grid gap-5 sm:grid-cols-2">
          <a href="mailto:info@vtaiwan.tw" class="vt-glass-panel group flex items-center gap-4 p-6 transition hover:-translate-y-0.5">
            <span class="vt-topic-bubble vt-topic-bubble-red vt-topic-bubble-sm" aria-hidden="true"><IconWrapper name="mail" :size="18" color="currentColor" /></span>
            <span>
              <strong class="text-vt-gray-800 block">{{ t('faq.contact.email.title') }}</strong>
              <span class="text-vt-gray-700 font-sans text-sm">info@vtaiwan.tw</span>
            </span>
          </a>
          <a href="https://join.g0v.tw/" target="_blank" rel="noopener noreferrer" class="vt-glass-panel group flex items-center gap-4 p-6 transition hover:-translate-y-0.5">
            <span class="vt-topic-bubble vt-topic-bubble-green vt-topic-bubble-sm" aria-hidden="true"><IconWrapper name="users" :size="18" color="currentColor" /></span>
            <span>
              <strong class="text-vt-gray-800 block">{{ t('faq.contact.social.title') }}</strong>
              <span class="text-vt-gray-700 font-sans text-sm">g0v slack</span>
            </span>
          </a>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@reference '../style.css';

.faq-answer :deep(a) {
  @apply text-democratic-red hover:text-democratic-red/80 underline underline-offset-2 transition;
}
</style>
