<script setup lang="ts">
import IconWrapper from '@/components/IconWrapper.vue'
import PageHeader from '@/components/PageHeader.vue'
import { communityContributors, coreTeam } from '@/data/contributors'
import { useHead } from '@unhead/vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const failedImageUrls = ref<string[]>([])

function markImageAsFailed(url: string) {
  if (!failedImageUrls.value.includes(url)) failedImageUrls.value = [...failedImageUrls.value, url]
}

useHead({
  title: t('head.contributors.title'),
  meta: [{ name: 'description', content: t('head.contributors.description') }],
})
</script>

<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content-wide">
      <PageHeader :label="t('pageLabels.contributors')" :title="t('contributors.title')" :description="t('contributors.description')">
        <template #default
          ><span class="vt-title-underline">{{ t('contributors.title') }}</span></template
        >
      </PageHeader>

      <section class="mt-12" :aria-labelledby="'core-team-title'">
        <h2 id="core-team-title" class="vt-panel-title mb-6">{{ t('contributors.coreTeam') }}</h2>
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <article v-for="(contributor, index) in coreTeam" :key="contributor.id" class="vt-glass-panel p-6 text-center">
            <div
              class="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border border-white/80 shadow-sm"
              :class="index % 3 === 0 ? 'bg-vt-red-tint' : index % 3 === 1 ? 'bg-vt-green-tint' : 'bg-vt-yellow-tint'"
            >
              <img
                v-if="contributor.imgURL && !failedImageUrls.includes(contributor.imgURL)"
                :src="contributor.imgURL"
                :alt="contributor.name"
                class="h-full w-full object-cover"
                @error="markImageAsFailed(contributor.imgURL)"
              />
              <div v-else class="flex h-full w-full items-center justify-center" aria-hidden="true"><IconWrapper name="user" :size="30" /></div>
            </div>
            <h3 class="m-0 text-lg">{{ contributor.name }}</h3>
            <p v-if="contributor.role" class="text-democratic-red mt-1 font-sans text-xs font-semibold tracking-[0.06em] uppercase">{{ t(contributor.role) }}</p>
            <p v-if="contributor.description" class="text-vt-gray-700 mt-3 text-sm leading-6">{{ t(contributor.description) }}</p>
          </article>
        </div>
      </section>

      <section class="mt-14" :aria-labelledby="'community-team-title'">
        <h2 id="community-team-title" class="vt-panel-title mb-6">{{ t('contributors.communityContributors') }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <article v-for="contributor in communityContributors" :key="contributor.id" class="vt-glass-panel p-5 text-center">
            <div class="bg-vt-bg-2 mx-auto mb-3 h-14 w-14 overflow-hidden rounded-full">
              <img
                v-if="contributor.imgURL && !failedImageUrls.includes(contributor.imgURL)"
                :src="contributor.imgURL"
                :alt="contributor.name"
                class="h-full w-full object-cover"
                @error="markImageAsFailed(contributor.imgURL)"
              />
              <div v-else class="text-vt-gray-700 flex h-full w-full items-center justify-center" aria-hidden="true"><IconWrapper name="user" :size="22" /></div>
            </div>
            <h3 class="m-0 text-base">{{ contributor.name }}</h3>
            <div v-if="contributor.contributions?.length" class="mt-2 flex flex-wrap justify-center gap-1.5">
              <span v-for="contribution in contributor.contributions" :key="contribution" class="vt-pill">{{ t(contribution) }}</span>
            </div>
            <span v-else-if="contributor.contribution" class="vt-pill mt-2">{{ t(contributor.contribution) }}</span>
          </article>
        </div>
      </section>

      <section class="mt-14 text-center" :aria-labelledby="'join-contributors-title'">
        <h2 id="join-contributors-title" class="vt-panel-title">{{ t('contributors.joinUs') }}</h2>
        <p class="text-vt-gray-700 mx-auto mt-3 max-w-xl leading-7">{{ t('contributors.joinUsDescription') }}</p>
        <router-link to="/intro" class="vt-btn vt-btn-primary mt-6">{{ t('contributors.learnMore') }} →</router-link>
      </section>
    </div>
  </section>
</template>
