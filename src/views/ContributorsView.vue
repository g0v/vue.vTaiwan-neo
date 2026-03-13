<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-3xl font-bold">{{ t('contributors.title') }}</h1>

    <div class="mb-8">
      <h2 class="mb-4 text-2xl font-bold">{{ t('contributors.coreTeam') }}</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="contributor in coreTeamRef" :key="contributor.id" class="card p-6 text-center">
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            <img v-if="contributor.imgURL" :src="contributor.imgURL" :alt="contributor.name" class="h-full w-full rounded-full object-cover" />
            <IconWrapper v-else name="user" :size="32" />
          </div>
          <h3 class="mb-2 text-xl font-bold">{{ contributor.name }}</h3>
          <p v-if="contributor.role" class="mb-2 text-gray-600">{{ t(contributor.role) }}</p>
          <p v-if="contributor.description" class="text-sm text-gray-500">{{ t(contributor.description) }}</p>
        </div>
      </div>
    </div>

    <div>
      <h2 class="mb-4 text-2xl font-bold">{{ t('contributors.communityContributors') }}</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="contributor in communityContributorsRef" :key="contributor.id" class="card p-4 text-center">
          <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <img v-if="contributor.imgURL" :src="contributor.imgURL" :alt="contributor.name" class="h-full w-full rounded-full object-cover" />
            <IconWrapper v-else name="user" :size="24" />
          </div>
          <h3 class="mb-2 font-bold">{{ contributor.name }}</h3>
          <div v-if="contributor.contributions && contributor.contributions.length > 0" class="space-y-1">
            <p v-for="contribution in contributor.contributions" :key="contribution" class="text-sm text-gray-600">
              {{ t(contribution) }}
            </p>
          </div>
          <p v-else-if="contributor.contribution" class="text-sm text-gray-600">{{ t(contributor.contribution) }}</p>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <h2 class="mb-4 text-2xl font-bold">{{ t('contributors.joinUs') }}</h2>
      <p class="mb-6 text-gray-600">
        {{ t('contributors.joinUsDescription') }}
      </p>
      <router-link to="/intro" class="btn-primary rounded-md">
        {{ t('contributors.learnMore') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import { coreTeam, communityContributors } from '../data/contributors'

const { t } = useI18n()

const coreTeamRef = ref(coreTeam)
const communityContributorsRef = ref(communityContributors)
</script>
