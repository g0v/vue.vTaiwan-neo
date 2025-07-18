<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ $t('contributors.title') }}</h1>

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">{{ $t('contributors.coreTeam') }}</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="contributor in coreTeamRef" :key="contributor.id" class="card p-6 text-center">
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
        <div v-for="contributor in communityContributorsRef" :key="contributor.id" class="card p-4 text-center">
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
      <router-link to="/intro" class="btn-primary rounded-md">
        {{ $t('contributors.learnMore') }}
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
