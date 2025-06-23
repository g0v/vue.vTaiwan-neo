<template>
  <!-- Hero Section -->
  <section class="bg-black text-white py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ $t('meetups.title') }}</h1>
      <p class="text-xl max-w-3xl">
        {{ $t('meetups.description') }}
      </p>
      <br/>
      <div class="flex justify-center gap-4" v-if="userData && userData.uid">
        <a href="https://meet.jit.si/vtaiwan" target="_blank" rel="noopener noreferrer" class="btn-primary rounded-md inline-block">
          {{ $t('meetups.jitsi') }}(Current)
          <br/>
          <span class="text-sm text-black">(Wednesdays 19:00)</span>
        </a>
        <RouterLink to="/jitsi" class="btn-primary rounded-md inline-block">
          {{ $t('meetups.jitsi') }}(Beta)
          <br/>
          <span class="text-sm text-black">(Wednesdays 19:00)</span>
        </RouterLink>
        <RouterLink to="/transcriptions" class="btn-primary rounded-md inline-block">
          {{ $t('meetups.transcriptions') }}(Beta)
        </RouterLink>
      </div>
      <div class="flex justify-center gap-4" v-else>
        <a href="https://meet.jit.si/vtaiwan" target="_blank" rel="noopener noreferrer" class="btn-primary rounded-md inline-block">
          {{ $t('meetups.jitsi') }}
          <br/>
          <span class="text-sm text-black">(Wednesdays 19:00)</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Upcoming Meetups -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold mb-8">
        <span class="title-underline">{{ $t('meetups.upcoming.title') }}</span>
      </h2>

      <div class="space-y-6">
        <div v-if="upcomingMeetups.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">{{ $t('meetups.upcoming.empty') }}</p>
        </div>

        <div
          v-for="meetup in upcomingMeetups"
          :key="meetup.id"
          class="card p-6 border-l-4 border-l-jade-green relative"
        >
          <!-- 樣稿標籤 -->
          <div v-if="meetup.isPrototype" class="absolute -top-2 -right-2 z-10">
            <div class="bg-yellow-400 text-black text-xs font-bold px-3 py-1 transform rotate-12 shadow-md">
              {{ currentLanguage === 'zh-TW' ? '樣稿' : 'Prototype' }}
            </div>
          </div>

          <div class="md:flex justify-between">
            <div class="md:w-2/3">
              <h3 class="text-xl font-bold mb-2">
                <a :href="`/meetups/${meetup.slug}`" class="hover:text-jade-green transition">
                  {{ meetup.title }}
                </a>
              </h3>

              <div class="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
                <div class="flex items-center gap-1">
                  <IconWrapper name="calendar" type="teal" :size="16" />
                  <span>{{ formatDate(meetup.date) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <IconWrapper name="clock" type="teal" :size="16" />
                  <span>{{ meetup.time }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <IconWrapper name="map-pin" type="teal" :size="16" />
                  <span>{{ meetup.location }}</span>
                </div>
              </div>

              <p class="text-gray-700 mb-4">{{ meetup.description }}</p>

              <div class="flex items-center gap-1 text-sm">
                <span>{{ $t('meetups.relatedProject') }}：</span>
                <a :href="meetup.projectUrl" class="text-democratic-red hover:text-democratic-red/80 transition">
                  {{ meetup.project }}
                </a>
              </div>
            </div>

            <div class="md:w-1/3 md:text-right mt-4 md:mt-0">
              <a
                v-if="meetup.registrationUrl"
                :href="meetup.registrationUrl"
                class="btn-secondary rounded-md inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('meetups.register') }}
              </a>
              <a :href="`/meetups/${meetup.slug}`" class="btn-outline rounded-md inline-block ml-2">
                {{ $t('meetups.details') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Calendar View -->
  <section class="py-12 bg-gray-100">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-2xl font-bold mb-6">{{ $t('meetups.calendar.title') }}</h2>
      <p class="mb-8">
        {{ $t('meetups.calendar.description') }}
      </p>
      <div class="flex justify-center gap-4">
        <a href="#" class="btn-primary rounded-md flex items-center gap-2">
          <IconWrapper name="calendar" :size="18" color="#FFFFFF" />
          <span>{{ $t('meetups.calendar.googleCalendar') }}</span>
        </a>
        <a href="#" class="btn-outline rounded-md flex items-center gap-2">
          <IconWrapper name="download" :size="18" />
          <span>{{ $t('meetups.calendar.icalFile') }}</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Past Meetups -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold mb-8">
        <span class="title-underline">{{ $t('meetups.past.title') }}</span>
      </h2>

      <div class="space-y-6">
        <div v-if="pastMeetups.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">{{ $t('meetups.past.empty') }}</p>
        </div>

        <div
          v-for="meetup in pastMeetups"
          :key="meetup.id"
          class="card p-6 border-l-4 border-l-gray-300 relative"
        >
          <!-- 樣稿標籤 -->
          <div v-if="meetup.isPrototype" class="absolute -top-2 -right-2 z-10">
            <div class="bg-yellow-400 text-black text-xs font-bold px-3 py-1 transform rotate-12 shadow-md">
              {{ currentLanguage === 'zh-TW' ? '樣稿' : 'Prototype' }}
            </div>
          </div>

          <div class="md:flex justify-between">
            <div class="md:w-2/3">
              <h3 class="text-xl font-bold mb-2">
                <a :href="`/meetups/${meetup.slug}`" class="hover:text-jade-green transition">
                  {{ meetup.title }}
                </a>
              </h3>

              <div class="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
                <div class="flex items-center gap-1">
                  <IconWrapper name="calendar" :size="16" />
                  <span>{{ formatDate(meetup.date) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <IconWrapper name="clock" :size="16" />
                  <span>{{ meetup.time }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <IconWrapper name="map-pin" :size="16" />
                  <span>{{ meetup.location }}</span>
                </div>
              </div>

              <p class="text-gray-700 mb-4">{{ meetup.description }}</p>

              <div class="flex items-center gap-1 text-sm">
                <span>{{ $t('meetups.relatedProject') }}：</span>
                <a :href="meetup.projectUrl" class="text-democratic-red hover:text-democratic-red/80 transition">
                  {{ meetup.project }}
                </a>
              </div>
            </div>

            <div class="md:w-1/3 md:text-right mt-4 md:mt-0">
              <a
                v-if="meetup.recordingUrl"
                :href="meetup.recordingUrl"
                class="btn-outline rounded-md inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="flex items-center gap-1">
                  <IconWrapper name="video" :size="16" />
                  <span>{{ $t('meetups.watchRecording') }}</span>
                </span>
              </a>

              <a
                v-if="meetup.summaryUrl"
                :href="meetup.summaryUrl"
                class="btn-outline rounded-md inline-block ml-2"
              >
                <span class="flex items-center gap-1">
                  <IconWrapper name="file-text" :size="16" />
                  <span>{{ $t('meetups.meetingRecord') }}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <a href="/meetups/archive" class="btn-outline rounded-md inline-block">
          {{ $t('meetups.viewMorePast') }}
        </a>
      </div>
    </div>
  </section>

  <!-- Host a Meetup -->
  <section class="py-12 bg-gray-100">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-2xl font-bold mb-4">{{ $t('meetups.host.title') }}</h2>
      <p class="text-lg mb-6 max-w-2xl mx-auto">
        {{ $t('meetups.host.description') }}
      </p>
      <a href="/contact" class="btn-primary rounded-md inline-block">
        {{ $t('meetups.host.contactUs') }}
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import { getUpcomingMeetups, getPastMeetups } from '../data/meetups'

const { locale } = useI18n()

// 定義 props
const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  userData: {
    type: Object,
    default: null
  }
})

// 為了兼容性，創建 usrData 別名
const usrData = computed(() => props.userData)

// 當前語言
const currentLanguage = computed(() => locale.value)

// 取得會議資料
const upcomingMeetups = computed(() => getUpcomingMeetups())
const pastMeetups = computed(() => getPastMeetups())

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-TW')
}
</script>

<style scoped>
.title-underline {
  position: relative;
}

.title-underline::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #D80000;
}
</style>