<script setup lang="ts">
import IconWrapper from '@/components/IconWrapper.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const values = [
  { key: 'open', icon: 'globe', bubble: 'vt-topic-bubble-red' },
  { key: 'collaborate', icon: 'users', bubble: 'vt-topic-bubble-green' },
  { key: 'coCreate', icon: 'lightbulb', bubble: 'vt-topic-bubble-orange' },
] as const

useHead({
  title: t('head.about.title'),
  meta: [
    { name: 'description', content: t('head.about.description') },
    { property: 'og:title', content: t('head.about.title') },
    { property: 'og:description', content: t('head.about.description') },
    { property: 'og:url', content: 'https://vtaiwan.tw/intro' },
  ],
})
</script>

<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content max-w-3xl">
      <PageHeader :label="t('pageLabels.about')" :title="t('about.title')" :description="t('about.mission.description')">
        <template #default> {{ t('about.title') }} <span class="text-democratic-red">vTaiwan</span> </template>
      </PageHeader>

      <section class="mt-12" :aria-labelledby="'about-values'">
        <h2 id="about-values" class="vt-panel-title mb-6">
          <span class="vt-title-underline">{{ t('about.values.title') }}</span>
        </h2>
        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="value in values" :key="value.key" class="vt-glass-panel p-6 text-center">
            <div class="vt-topic-bubble mx-auto mb-4" :class="value.bubble">
              <IconWrapper :name="value.icon" :size="26" />
            </div>
            <h3 class="m-0 text-lg">{{ t(`about.values.${value.key}.title`) }}</h3>
            <p class="text-vt-gray-700 mt-2 text-sm leading-6">{{ t(`about.values.${value.key}.description`) }}</p>
          </article>
        </div>
      </section>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <section class="vt-glass-panel p-6" :aria-labelledby="'about-newsletter'">
          <div class="flex items-start gap-4">
            <div class="vt-topic-bubble vt-topic-bubble-orange vt-topic-bubble-sm">
              <IconWrapper name="mail" :size="19" />
            </div>
            <div>
              <h2 id="about-newsletter" class="m-0 text-xl">{{ t('about.newsletter.title') }}</h2>
              <p class="text-vt-gray-700 mt-2 text-sm leading-6">{{ t('about.newsletter.description') }}</p>
              <router-link to="/newsletters" class="text-democratic-red mt-4 inline-flex font-sans text-sm font-medium hover:underline"> {{ t('about.newsletter.button') }} → </router-link>
            </div>
          </div>
        </section>

        <section class="vt-glass-panel p-6" :aria-labelledby="'about-contact'">
          <div class="flex items-start gap-4">
            <div class="vt-topic-bubble vt-topic-bubble-green vt-topic-bubble-sm">
              <IconWrapper name="message-circle" :size="19" />
            </div>
            <div>
              <h2 id="about-contact" class="m-0 text-xl">{{ t('about.contact.title') }}</h2>
              <p class="text-vt-gray-700 mt-2 text-sm leading-6">{{ t('about.contact.description') }}</p>
              <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-sans text-sm">
                <router-link to="/contact" class="text-democratic-red font-medium hover:underline">{{ t('about.contact.contactUs') }}</router-link>
                <a href="mailto:info@vtaiwan.tw" class="text-vt-gray-700 hover:text-democratic-red">info@vtaiwan.tw</a>
                <a href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book" target="_blank" rel="noopener noreferrer" class="text-vt-gray-700 hover:text-democratic-red"
                  >HackMD</a
                >
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
