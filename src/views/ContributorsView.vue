<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ $t('contributors.title') }}</h1>

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">{{ $t('contributors.coreTeam') }}</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="contributor in coreTeam" :key="contributor.id" class="card p-6 text-center">
          <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <img v-if="contributor.imgURL" :src="contributor.imgURL" :alt="contributor.name" class="w-full h-full object-cover rounded-full">
            <IconWrapper v-else name="user" :size="32" />
          </div>
          <h3 class="text-xl font-bold mb-2">{{ contributor.name }}</h3>
          <p v-if="contributor.role" class="text-gray-600 mb-2">{{ $t(contributor.role) }}</p>
          <p v-if="contributor.description" class="text-sm text-gray-500">{{ $t(contributor.description) }}</p>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">{{ $t('contributors.communityContributors') }}</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="contributor in communityContributors" :key="contributor.id" class="card p-4 text-center">
          <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
            <img v-if="contributor.imgURL" :src="contributor.imgURL" :alt="contributor.name" class="w-full h-full object-cover rounded-full">
            <IconWrapper v-else name="user" :size="24" />
          </div>
          <h3 class="font-bold mb-1">{{ contributor.name }}</h3>
          <p v-if="contributor.contribution" class="text-sm text-gray-600">{{ $t(contributor.contribution) }}</p>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <h2 class="text-2xl font-bold mb-4">{{ $t('contributors.joinUs') }}</h2>
      <p class="text-gray-600 mb-6">
        {{ $t('contributors.joinUsDescription') }}
      </p>
      <router-link to="/about" class="btn-primary rounded-md">
        {{ $t('contributors.learnMore') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'

const { t } = useI18n()

interface Contributor {
  id: string
  name: string
  role?: string
  description?: string
  contribution?: string
  imgURL?: string
}

const coreTeam = ref<Contributor[]>([
  {
    id: '1',
    name: 'Peter Cui',
    role: 'contributors.roles.projectManager',
    description: 'contributors.descriptions.projectManager',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512'
  },
  {
    id: '2',
    name: 'Bestian Tang',
    role: 'contributors.roles.techDirector',
    description: 'contributors.descriptions.techDirector',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512'
  },
  {
    id: '3',
    name: 'Tofus Wang',
    role: 'contributors.roles.designer',
    description: 'contributors.descriptions.designer',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512'
  }
])

const communityContributors = ref<Contributor[]>([
  { id: '1', name: 'Peter Cui', contribution: 'contributors.contributions.policyResearch', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '2', name: 'Peter Cui', contribution: 'contributors.contributions.eventPlanning', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '3', name: 'Joshua Yang', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U02E9C8B42U-21f68e5ff15c-512' },
  { id: '4', name: 'Shuyang Lin', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U2PUXG69E-f59903ccf61f-512' },
  { id: '5', name: 'Peter Cui', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '6', name: 'Tofus Wang', contribution: 'contributors.contributions.uiuxDesign', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512' },
  { id: '7', name: 'Tofus Wang', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512' },
  { id: '8', name: 'Joey Yu', contribution: 'contributors.contributions.uiuxDesign', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U0638P8FJ82-5ee2c8a9ae73-192' },
  { id: '9', name: 'Tim', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U05BY0RLJM7-ab97abff7b44-512' },
  { id: '10', name: 'Anan', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U08U8MNTS0M-d68838168b5e-192' },
  { id: '11', name: 'Bestian Tang', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512' },
  { id: '12', name: 'Bestian Tang', contribution: 'contributors.contributions.backendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512' },
  { id: '13', name: 'Nobody', contribution: 'contributors.contributions.dataAnalysis' },
  { id: '14', name: 'Nobody', contribution: 'contributors.contributions.translationSupport' },

])
</script>
