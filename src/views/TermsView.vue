<script setup lang="ts">
import LegalDocument from '@/components/LegalDocument.vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const sections = [
  { key: 'introduction' },
  { key: 'acceptance' },
  { key: 'account', highlight: true, items: 3 },
  { key: 'videoService', highlight: true },
  { key: 'transcriptionService', highlight: true, items: 3 },
  { key: 'contentLicense', highlight: true, details: true },
  { key: 'userConduct', items: 4 },
  { key: 'disclaimer' },
  { key: 'modifications' },
  { key: 'contact', contact: true },
  { key: 'effectiveDate', updated: true },
]

useHead({ title: `${t('terms.title')} | vTaiwan`, meta: [{ name: 'description', content: t('terms.metaDescription') }] })
</script>

<template>
  <LegalDocument prefix="terms" :sections="sections" />
</template>
