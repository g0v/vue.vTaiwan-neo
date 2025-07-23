<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import IconWrapper from '../components/IconWrapper.vue'
import UnderConstructionModal from '../components/UnderConstructionModal.vue'

const { t } = useI18n()

// 控制施工中彈出告示的顯示
const showUnderConstructionModal = ref(true)

const closeUnderConstructionModal = () => {
  showUnderConstructionModal.value = false
}
</script>

<template>
  <div>
    <!-- 施工中彈出告示 -->
    <UnderConstructionModal
      :show="showUnderConstructionModal"
      @close="closeUnderConstructionModal"
    />

    <!-- Hero Section -->
    <section class="bg-black text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-5">
            <div><span class="text-democratic-red">{{ $t('home.hero.title.open') }}</span>、<span class="text-jade-green">{{ $t('home.hero.title.collaborate') }}</span>、<span class="text-wheat-yellow">{{ $t('home.hero.title.coCreate') }}</span></div>
            <div class="mt-3">{{ $t('home.hero.title.taiwanFuture') }}</div>
          </h1>
          <p class="text-xl mb-8">{{ $t('home.hero.subtitle') }}</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/topics" class="btn-primary rounded-md">
              {{ $t('home.hero.buttons.browseTopics') }}
            </router-link>
            <router-link to="/intro" class="btn-outline bg-transparent text-white border-white rounded-md">
              {{ $t('home.hero.buttons.learnMore') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center">
          <span class="title-underline">{{ $t('home.features.title') }}</span>
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-democratic-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconWrapper name="message-circle" type="primary" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('home.features.items.propose.title') }}</h3>
            <p class="text-gray-700">{{ $t('home.features.items.propose.description') }}</p>
          </div>

          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-jade-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconWrapper name="users" type="teal" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('home.features.items.discuss.title') }}</h3>
            <p class="text-gray-700">{{ $t('home.features.items.discuss.description') }}</p>
          </div>

          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-wheat-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconWrapper name="check-circle" type="amber" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('home.features.items.policy.title') }}</h3>
            <p class="text-gray-700">{{ $t('home.features.items.policy.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-black text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">{{ $t('home.cta.title') }}</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">{{ $t('home.cta.description') }}</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/topics" class="btn-primary rounded-md">
            {{ $t('home.cta.buttons.browseProjects') }}
          </router-link>
          <router-link to="/intro" class="btn-outline bg-transparent text-white border-white rounded-md">
            {{ $t('home.cta.buttons.learnMore') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
