<script setup lang="ts">
import LegalDocument from '@/components/LegalDocument.vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const sections = [
  { key: 'introduction' },
  { key: 'dataCollection', items: 3 },
  { key: 'dataUsage', items: 3 },
  { key: 'dataSharing', highlight: true },
  { key: 'dataSecurity' },
  { key: 'userRights', items: 3 },
  { key: 'contact', contact: true },
  { key: 'updates', updated: true },
]

useHead({ title: `${t('privacy.title')} | vTaiwan`, meta: [{ name: 'description', content: t('privacy.metaDescription') }] })
</script>

<template>
  <LegalDocument prefix="privacy" :sections="sections" />
</template>
