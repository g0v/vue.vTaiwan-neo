<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface LegalSection {
  key: string
  items?: number
  highlight?: boolean
  details?: boolean
  contact?: boolean
  updated?: boolean
}

defineProps<{
  prefix: 'privacy' | 'terms'
  sections: LegalSection[]
}>()

const { t } = useI18n()
</script>

<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content max-w-3xl">
      <div class="vt-page-intro">
        <h1 class="vt-page-title">
          <span class="vt-title-underline">{{ t(`${prefix}.title`) }}</span>
        </h1>
      </div>

      <article class="vt-glass-panel p-6 sm:p-9 lg:p-10">
        <section v-for="(section, index) in sections" :key="section.key" class="border-vt-border/70 border-b py-7 first:pt-0 last:border-b-0 last:pb-0">
          <h2 class="m-0 text-xl">{{ t(`${prefix}.${section.key}.title`) }}</h2>
          <p class="text-vt-gray-700 mt-3 leading-8">{{ t(`${prefix}.${section.key}.content`) }}</p>

          <div v-if="section.highlight" class="border-democratic-red bg-vt-red-tint text-vt-gray-800 mt-4 border-l-4 p-4 font-medium">
            {{ t(`${prefix}.${section.key}.highlight`) }}
          </div>

          <ul v-if="section.items" class="text-vt-gray-700 mt-4 list-disc space-y-2 pl-5 leading-7">
            <li v-for="item in section.items" :key="item">{{ t(`${prefix}.${section.key}.item${item}`) }}</li>
          </ul>

          <p v-if="section.details" class="text-vt-gray-700 mt-4 leading-8">{{ t(`${prefix}.${section.key}.details`) }}</p>

          <div v-if="section.contact" class="bg-vt-bg-2 mt-4 rounded-xl p-4 font-sans text-sm leading-7">
            <p>
              <strong>{{ t(`${prefix}.${section.key}.email`) }}:</strong> <a href="mailto:info@vtaiwan.tw" class="text-democratic-red hover:underline">info@vtaiwan.tw</a>
            </p>
            <p>
              <strong>{{ t(`${prefix}.${section.key}.github`) }}:</strong>
              <a href="https://github.com/g0v/vue.vTaiwan-neo" target="_blank" rel="noopener noreferrer" class="text-democratic-red break-all hover:underline">github.com/g0v/vue.vTaiwan-neo</a>
            </p>
          </div>

          <p v-if="section.updated" class="text-vt-gray-400 mt-4 font-sans text-xs">{{ t(`${prefix}.${section.key}.lastUpdated`) }}</p>
        </section>
      </article>

      <div class="mt-8 text-center">
        <router-link to="/" class="vt-btn vt-btn-primary">{{ t(`${prefix}.backToHome`) }}</router-link>
      </div>
    </div>
  </section>
</template>
