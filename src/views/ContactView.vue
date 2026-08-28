<script setup lang="ts">
import IconWrapper from '@/components/IconWrapper.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const bookUrl = 'https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book'
const slackUrl = 'https://join.g0v.tw/'

useHead({ title: `${t('contact.title')} | vTaiwan` })
</script>

<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content">
      <PageHeader :label="t('pageLabels.contact')" :title="t('contact.title')" :description="t('contact.subtitle')" centered />

      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <article class="vt-glass-panel p-7 sm:p-8">
          <div class="mb-5 flex items-center gap-4">
            <div class="vt-topic-bubble vt-topic-bubble-red vt-topic-bubble-sm"><IconWrapper name="book-open" :size="20" /></div>
            <h2 class="m-0 text-xl">{{ t('contact.workingGroup.title') }}</h2>
          </div>
          <p class="text-vt-gray-700 text-sm leading-7">{{ t('contact.workingGroup.description') }}</p>
          <a :href="bookUrl" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-primary mt-6">
            <IconWrapper name="external-link" :size="16" color="currentColor" />
            {{ t('contact.workingGroup.button') }}
          </a>
        </article>

        <article class="vt-glass-panel p-7 sm:p-8">
          <div class="mb-5 flex items-center gap-4">
            <div class="vt-topic-bubble vt-topic-bubble-green vt-topic-bubble-sm"><IconWrapper name="message-circle" :size="20" /></div>
            <h2 class="m-0 text-xl">{{ t('contact.slack.title') }}</h2>
          </div>
          <div class="bg-vt-bg-2 mb-4 flex items-center gap-2 rounded-xl px-4 py-3 font-mono text-sm">
            <!-- <IconWrapper name="hash" :size="16" /> -->
            {{ t('contact.slack.channel') }}
          </div>
          <p class="text-vt-gray-700 text-sm leading-7">{{ t('contact.slack.channelDesc') }}</p>
          <a :href="slackUrl" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-secondary mt-6">
            <IconWrapper name="slack" :size="16" color="currentColor" />
            {{ t('contact.slack.button') }}
          </a>
        </article>
      </div>

      <section class="vt-glass-panel mt-7 p-7 sm:p-9" :aria-labelledby="'other-contact-title'">
        <h2 id="other-contact-title" class="vt-panel-title mb-7">{{ t('contact.otherMethods.title') }}</h2>
        <div class="grid gap-8 sm:grid-cols-3">
          <article class="text-center">
            <IconWrapper name="github" :size="24" class="text-democratic-red mx-auto mb-3" />
            <h3 class="m-0 text-base">{{ t('contact.otherMethods.github.title') }}</h3>
            <p class="text-vt-gray-700 mt-1 text-sm">{{ t('contact.otherMethods.github.description') }}</p>
            <a href="https://github.com/g0v" target="_blank" rel="noopener noreferrer" class="text-democratic-red mt-3 inline-flex font-sans text-sm font-medium hover:underline">{{
              t('contact.otherMethods.github.link')
            }}</a>
          </article>
          <article class="text-center">
            <IconWrapper name="mail" :size="24" class="text-democratic-red mx-auto mb-3" />
            <h3 class="m-0 text-base">{{ t('contact.otherMethods.email.title') }}</h3>
            <p class="text-vt-gray-700 mt-1 text-sm">{{ t('contact.otherMethods.email.description') }}</p>
            <a href="mailto:info@vtaiwan.tw" class="text-democratic-red mt-3 inline-flex font-sans text-sm font-medium hover:underline">{{ t('contact.otherMethods.email.link') }}</a>
          </article>
          <article class="text-center">
            <IconWrapper name="calendar" :size="24" class="text-democratic-red mx-auto mb-3" />
            <h3 class="m-0 text-base">{{ t('contact.otherMethods.meetups.title') }}</h3>
            <p class="text-vt-gray-700 mt-1 text-sm">{{ t('contact.otherMethods.meetups.description') }}</p>
            <router-link to="/meetups" class="text-democratic-red mt-3 inline-flex font-sans text-sm font-medium hover:underline">{{ t('contact.otherMethods.meetups.link') }}</router-link>
          </article>
        </div>
      </section>

      <section class="bg-jade-green text-vt-fg-inverse mt-7 rounded-[22px] px-6 py-12 text-center shadow-xl shadow-red-950/20" :aria-labelledby="'contact-cta-title'">
        <h2 id="contact-cta-title" class="m-0 text-2xl sm:text-3xl">{{ t('contact.cta.title') }}</h2>
        <p class="mx-auto mt-3 max-w-2xl leading-7 text-white/85">{{ t('contact.cta.description') }}</p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <a :href="bookUrl" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-light"
            ><IconWrapper name="book-open" :size="16" color="currentColor" />{{ t('contact.cta.workingGroup') }}</a
          >
          <a :href="slackUrl" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-outline bg-democratic-red text-vt-fg-inverse"
            ><IconWrapper name="slack" :size="16" color="currentColor" />{{ t('contact.cta.slack') }}</a
          >
        </div>
      </section>
    </div>
  </section>
</template>
