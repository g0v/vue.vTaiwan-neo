<script setup lang="ts">
import IconWrapper from '@/components/IconWrapper.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const requirements = [
  { key: 'meeting', icon: 'video', bubble: 'vt-topic-bubble-red' },
  { key: 'admin', icon: 'users', bubble: 'vt-topic-bubble-green' },
] as const

const processSteps = [
  { key: 'step1', color: 'bg-vt-red-tint text-democratic-red border-democratic-red/20' },
  { key: 'step2', color: 'bg-vt-green-tint text-jade-green border-jade-green/20' },
  { key: 'step3', color: 'bg-vt-yellow-tint text-wheat-yellow border-wheat-yellow/20' },
] as const

useHead({ title: `${t('propose.title')} | vTaiwan` })
</script>

<template>
  <div>
    <PageHeader :label="t('pageLabels.propose')" :title="t('propose.title')" :description="t('propose.description')" dark />

    <section class="vt-page-shell">
      <div class="vt-page-content">
        <section class="vt-glass-panel vt-panel-padding" :aria-labelledby="'propose-requirements'">
          <h2 id="propose-requirements" class="vt-panel-title mb-8">
            <span class="vt-title-underline">{{ t('propose.requirements.title') }}</span>
          </h2>
          <div class="space-y-8">
            <article v-for="requirement in requirements" :key="requirement.key" class="flex flex-col gap-4 sm:flex-row sm:gap-5">
              <div class="vt-topic-bubble shrink-0" :class="requirement.bubble"><IconWrapper :name="requirement.icon" :size="25" /></div>
              <div>
                <h3 class="m-0 text-xl">{{ t(`propose.requirements.${requirement.key}.title`) }}</h3>
                <p class="text-vt-gray-700 mt-2 leading-7">{{ t(`propose.requirements.${requirement.key}.description`) }}</p>
                <ul class="text-vt-gray-700 mt-3 list-disc space-y-1 pl-5 text-sm leading-7">
                  <li v-for="bullet in 3" :key="bullet">{{ t(`propose.requirements.${requirement.key}.bullet${bullet}`) }}</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section class="vt-glass-panel vt-panel-padding mt-7" :aria-labelledby="'propose-process'">
          <h2 id="propose-process" class="vt-panel-title mb-8">
            <span class="vt-title-underline">{{ t('propose.process.title') }}</span>
          </h2>
          <ol class="grid gap-8 md:grid-cols-3">
            <li v-for="(step, index) in processSteps" :key="step.key" class="text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border font-serif text-2xl font-bold" :class="step.color">{{ index + 1 }}</div>
              <h3 class="m-0 text-lg">{{ t(`propose.process.${step.key}.title`) }}</h3>
              <p class="text-vt-gray-700 mt-2 text-sm leading-6">{{ t(`propose.process.${step.key}.description`) }}</p>
            </li>
          </ol>
        </section>

        <section class="vt-glass-panel vt-panel-padding mt-7 bg-white/40" :aria-labelledby="'propose-contact'">
          <h2 id="propose-contact" class="vt-panel-title">{{ t('propose.contact.title') }}</h2>
          <p class="text-vt-gray-700 mt-2">{{ t('propose.contact.description') }}</p>
          <div class="mt-7 grid gap-4 md:grid-cols-2">
            <article class="border-vt-border/70 rounded-2xl border bg-white p-6">
              <div class="flex items-center gap-3">
                <IconWrapper name="calendar" :size="19" class="text-democratic-red" />
                <h3 class="m-0 text-lg">{{ t('propose.contact.meeting.title') }}</h3>
              </div>
              <p class="text-vt-gray-700 mt-3 text-sm leading-6">{{ t('propose.contact.meeting.description') }}</p>
              <router-link to="/meetups" class="vt-btn vt-btn-primary mt-5">{{ t('propose.contact.meeting.button') }} →</router-link>
            </article>
            <article class="border-vt-border/70 rounded-2xl border bg-white p-6">
              <div class="flex items-center gap-3">
                <IconWrapper name="message-circle" :size="19" class="text-jade-green" />
                <h3 class="m-0 text-lg">{{ t('propose.contact.community.title') }}</h3>
              </div>
              <p class="text-vt-gray-700 mt-3 text-sm leading-6">{{ t('propose.contact.community.description') }}</p>
              <router-link to="/contact" class="vt-btn vt-btn-secondary mt-5">{{ t('propose.contact.community.button') }} →</router-link>
            </article>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>
