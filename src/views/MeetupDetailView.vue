<template>
  <div v-if="meetup">
    <!-- Hero Section -->
    <section class="bg-black text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl relative">
          <!-- 樣稿標籤 -->
          <div v-if="meetup.isPrototype" class="absolute -top-4 -right-4 z-10">
            <div class="bg-yellow-400 text-black text-sm font-bold px-4 py-2 transform rotate-12 shadow-lg">
              {{ currentLanguage === 'zh-TW' ? '樣稿' : 'Prototype' }}
            </div>
          </div>

          <div class="flex items-center mb-6">
            <div class="w-16 h-16 rounded-full bg-jade-green/20 flex items-center justify-center mr-6">
              <IconWrapper name="calendar" :size="32" />
            </div>
            <div>
              <span class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-jade-green/20 text-jade-green">
                {{ isUpcoming ? $t('meetupDetail.upcoming') : $t('meetupDetail.past') }}
              </span>
            </div>
          </div>

          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            {{ meetup.title }}
          </h1>

          <p class="text-xl text-gray-300 mb-8 max-w-3xl">
            {{ meetup.description }}
          </p>

          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center gap-2">
              <IconWrapper name="calendar" :size="16" />
              <span>{{ formatDate(meetup.date) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <IconWrapper name="clock" :size="16" />
              <span>{{ meetup.time }}</span>
            </div>
            <div class="flex items-center gap-2">
              <IconWrapper name="map-pin" :size="16" />
              <span>{{ meetup.location }}</span>
            </div>
            <div class="flex items-center gap-2">
              <IconWrapper name="folder" :size="16" />
              <a :href="meetup.projectUrl" class="text-jade-green hover:text-jade-green/80 transition">
                {{ meetup.project }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- 會議詳情 -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">{{ $t('meetupDetail.details') }}</h2>
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 class="font-semibold mb-2">{{ $t('meetupDetail.date') }}</h3>
                  <p class="text-gray-600">{{ formatDate(meetup.date) }}</p>
                </div>
                <div>
                  <h3 class="font-semibold mb-2">{{ $t('meetupDetail.time') }}</h3>
                  <p class="text-gray-600">{{ meetup.time }}</p>
                </div>
                <div>
                  <h3 class="font-semibold mb-2">{{ $t('meetupDetail.location') }}</h3>
                  <p class="text-gray-600">{{ meetup.location }}</p>
                </div>
                <div>
                  <h3 class="font-semibold mb-2">{{ $t('meetupDetail.relatedProject') }}</h3>
                  <a :href="meetup.projectUrl" class="text-democratic-red hover:text-democratic-red/80 transition">
                    {{ meetup.project }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 標籤 -->
          <div class="mb-12" v-if="meetup.tags && meetup.tags.length > 0">
            <h2 class="text-2xl font-bold mb-6">{{ $t('meetupDetail.tags') }}</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in meetup.tags"
                :key="tag"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 相關連結 -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">{{ $t('meetupDetail.relatedLinks') }}</h2>
            <div class="space-y-4">
              <!-- 報名連結 -->
              <a
                v-if="meetup.isPrototype || meetup.registrationUrl"
                :href="meetup.registrationUrl || '#'"
                :class="{'opacity-50 cursor-not-allowed': meetup.isPrototype}"
                class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWrapper name="user-plus" :size="20" class="mr-3" />
                <span>
                  {{ $t('meetupDetail.registration') }}
                  <span v-if="meetup.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>

              <!-- 錄影連結 -->
              <a
                v-if="meetup.isPrototype || meetup.recordingUrl"
                :href="meetup.recordingUrl || '#'"
                :class="{'opacity-50 cursor-not-allowed': meetup.isPrototype}"
                class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWrapper name="video" :size="20" class="mr-3" />
                <span>
                  {{ $t('meetupDetail.recording') }}
                  <span v-if="meetup.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>

              <!-- 會議紀錄 -->
              <a
                v-if="meetup.isPrototype || meetup.summaryUrl"
                :href="meetup.summaryUrl || '#'"
                :class="{'opacity-50 cursor-not-allowed': meetup.isPrototype}"
                class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition"
              >
                <IconWrapper name="file-text" :size="20" class="mr-3" />
                <span>
                  {{ $t('meetupDetail.summary') }}
                  <span v-if="meetup.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>

              <!-- HackMD 連結 -->
              <a
                v-if="meetup.isPrototype || meetup.hackmdUrl"
                :href="meetup.hackmdUrl || '#'"
                :class="{'opacity-50 cursor-not-allowed': meetup.isPrototype}"
                class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWrapper name="edit" :size="20" class="mr-3" />
                <span>
                  {{ $t('meetupDetail.hackmd') }}
                  <span v-if="meetup.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>

              <!-- KKTIX 連結 -->
              <a
                v-if="meetup.isPrototype || meetup.kktixUrl"
                :href="meetup.kktixUrl || '#'"
                :class="{'opacity-50 cursor-not-allowed': meetup.isPrototype}"
                class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWrapper name="ticket" :size="20" class="mr-3" />
                <span>
                  {{ $t('meetupDetail.kktix') }}
                  <span v-if="meetup.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>

              <!-- Google Form 連結 -->
              <a
                v-if="meetup.isPrototype || meetup.googleFormUrl"
                :href="meetup.googleFormUrl || '#'"
                :class="{'opacity-50 cursor-not-allowed': meetup.isPrototype}"
                class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWrapper name="form-input" :size="20" class="mr-3" />
                <span>
                  {{ $t('meetupDetail.googleForm') }}
                  <span v-if="meetup.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>
            </div>
          </div>

          <!-- 行動按鈕 -->
          <div class="text-center">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/meetups" class="btn-secondary">
                {{ $t('meetupDetail.backToMeetups') }}
              </a>
              <a
                v-if="meetup.registrationUrl && !meetup.isPrototype"
                :href="meetup.registrationUrl"
                class="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('meetupDetail.register') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- 404 頁面 -->
  <div v-else class="py-16">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl font-bold mb-4">{{ $t('meetupDetail.notFound') }}</h1>
      <p class="text-lg text-gray-600 mb-8">{{ $t('meetupDetail.notFoundDesc') }}</p>
      <a href="/meetups" class="btn-primary">{{ $t('meetupDetail.backToMeetups') }}</a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import { meetups } from '../data/meetups'

const route = useRoute()
const { locale } = useI18n()

// 當前語言
const currentLanguage = computed(() => locale.value)

// 根據路由參數找到對應的會議
const meetup = computed(() => {
  const slug = route.params.slug
  return meetups.find(m => m.slug === slug)
})

// 判斷是否為即將舉行的會議
const isUpcoming = computed(() => {
  if (!meetup.value) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(meetup.value.date) >= today
})

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-TW')
}
</script>
