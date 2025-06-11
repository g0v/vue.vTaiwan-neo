<template>
  <!-- Hero Section -->
  <section class="bg-black text-white py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">會議</h1>
      <p class="text-xl max-w-3xl">
        vTaiwan 定期舉辦線上與實體會議，討論各專案的進展與公共政策議題。歡迎所有人參與！
      </p>
    </div>
  </section>

  <!-- Upcoming Meetups -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold mb-8">
        <span class="title-underline">即將舉行的會議</span>
      </h2>

      <div class="space-y-6">
        <div v-if="upcomingMeetups.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">目前沒有即將舉行的會議</p>
        </div>

        <div
          v-for="meetup in upcomingMeetups"
          :key="meetup.id"
          class="card p-6 border-l-4 border-l-jade-green"
        >
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
                <span>相關專案：</span>
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
                立即報名
              </a>
              <a :href="`/meetups/${meetup.slug}`" class="btn-outline rounded-md inline-block ml-2">
                詳細資訊
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
      <h2 class="text-2xl font-bold mb-6">會議行事曆</h2>
      <p class="mb-8">
        訂閱我們的會議行事曆，不錯過任何重要會議。
      </p>
      <div class="flex justify-center gap-4">
        <a href="#" class="btn-primary rounded-md flex items-center gap-2">
          <IconWrapper name="calendar" :size="18" color="#FFFFFF" />
          <span>Google Calendar</span>
        </a>
        <a href="#" class="btn-outline rounded-md flex items-center gap-2">
          <IconWrapper name="download" :size="18" />
          <span>iCal 檔案</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Past Meetups -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold mb-8">
        <span class="title-underline">過去的會議</span>
      </h2>

      <div class="space-y-6">
        <div v-if="pastMeetups.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">目前沒有過去的會議記錄</p>
        </div>

        <div
          v-for="meetup in pastMeetups"
          :key="meetup.id"
          class="card p-6 border-l-4 border-l-gray-300"
        >
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
                <span>相關專案：</span>
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
                  <span>觀看錄影</span>
                </span>
              </a>

              <a
                v-if="meetup.summaryUrl"
                :href="meetup.summaryUrl"
                class="btn-outline rounded-md inline-block ml-2"
              >
                <span class="flex items-center gap-1">
                  <IconWrapper name="file-text" :size="16" />
                  <span>會議紀錄</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <a href="/meetups/archive" class="btn-outline rounded-md inline-block">
          查看更多過去的會議
        </a>
      </div>
    </div>
  </section>

  <!-- Host a Meetup -->
  <section class="py-12 bg-gray-100">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-2xl font-bold mb-4">想要舉辦會議？</h2>
      <p class="text-lg mb-6 max-w-2xl mx-auto">
        如果您想針對某個專案或公共政策議題舉辦討論會，歡迎與我們聯繫。
      </p>
      <a href="/contact" class="btn-primary rounded-md inline-block">
        聯絡我們
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import IconWrapper from '../components/IconWrapper.vue'
import { getUpcomingMeetups, getPastMeetups } from '../data/meetups'

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