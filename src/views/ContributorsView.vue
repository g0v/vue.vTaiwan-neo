<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">貢獻者</h1>

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">核心團隊</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="contributor in coreTeam" :key="contributor.id" class="card p-6 text-center">
          <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <IconWrapper name="user" :size="32" />
          </div>
          <h3 class="text-xl font-bold mb-2">{{ contributor.name }}</h3>
          <p class="text-gray-600 mb-2">{{ contributor.role }}</p>
          <p class="text-sm text-gray-500">{{ contributor.description }}</p>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">社群貢獻者</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="contributor in communityContributors" :key="contributor.id" class="card p-4 text-center">
          <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
            <IconWrapper name="user" :size="24" />
          </div>
          <h3 class="font-bold mb-1">{{ contributor.name }}</h3>
          <p class="text-sm text-gray-600">{{ contributor.contribution }}</p>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <h2 class="text-2xl font-bold mb-4">加入我們</h2>
      <p class="text-gray-600 mb-6">
        無論您是公民、專家、政府人員或是關心公共事務的任何人，都歡迎加入 vTaiwan 平台。
      </p>
      <router-link to="/about" class="btn-primary rounded-md">
        了解更多
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconWrapper from '../components/IconWrapper.vue'

interface Contributor {
  id: string
  name: string
  role?: string
  description?: string
  contribution?: string
}

const coreTeam = ref<Contributor[]>([
  {
    id: '1',
    name: 'Peter Cui',
    role: '專案負責人',
    description: '負責整體專案規劃與協調'
  },
  {
    id: '2',
    name: 'Bestian Tang',
    role: '技術總監',
    description: '負責技術架構與平台開發'
  },
  {
    id: '3',
    name: 'Tofus Wang',
    role: '設計師',
    description: '負責 vTaiwan 網站設計與體驗策展'
  }
])

const communityContributors = ref<Contributor[]>([
  { id: '1', name: 'Bestian Tang', contribution: '政策研究' },
  { id: '2', name: 'Tofus Wang', contribution: 'UI/UX 設計' },
  { id: '3', name: 'Joey Yu', contribution: '前端開發' },
  { id: '4', name: 'Nobody', contribution: '內容編輯' },
  { id: '5', name: 'Nobody', contribution: '資料分析' },
  { id: '6', name: 'Nobody', contribution: '翻譯支援' },
  { id: '7', name: 'Bestian Tang', contribution: '後端開發' },
  { id: '8', name: 'Peter Cui', contribution: '活動策劃' }
])
</script>