<template>
  <!-- Hero Section -->
  <section class="bg-black text-white py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">專案列表</h1>
      <p class="text-xl max-w-3xl">
        vTaiwan 平台上的所有公共政策協作專案。每個專案都經過提案、討論、形成共識與政策建議的過程。
      </p>
    </div>
  </section>

  <!-- Filters Section -->
  <section class="py-6 border-b">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">狀態</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="border-gray-300 rounded-md shadow-sm focus:border-democratic-red focus:ring focus:ring-democratic-red/20"
          >
            <option v-for="status in statuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <div>
          <label for="category-filter" class="block text-sm font-medium text-gray-700 mb-1">分類</label>
          <select
            id="category-filter"
            v-model="categoryFilter"
            class="border-gray-300 rounded-md shadow-sm focus:border-democratic-red focus:ring focus:ring-democratic-red/20"
          >
            <option value="all">全部分類</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="ml-auto">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">搜尋</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconWrapper name="search" :size="18" />
            </div>
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              placeholder="搜尋專案..."
              class="pl-10 border-gray-300 rounded-md shadow-sm focus:border-democratic-red focus:ring focus:ring-democratic-red/20 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Projects Grid -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid">
        <a
          v-for="project in filteredProjects"
          :key="project.id"
          :href="project.url"
          class="card hover:border-democratic-red transition"
        >
          <div class="p-6">
            <div class="flex items-start mb-4">
              <div
                :class="`w-12 h-12 rounded-full bg-${getColorClass(project.color)}/10 flex items-center justify-center mr-4`"
              >
                <IconWrapper :name="project.icon" :type="project.color" :size="24" />
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ project.title }}</h3>
                <div class="flex items-center mt-1">
                  <span
                    :class="`inline-block w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-jade-green' : 'bg-gray-400'} mr-2`"
                  ></span>
                  <span class="text-sm text-gray-600">{{ project.status === 'active' ? '進行中' : '已完成' }}</span>
                </div>
              </div>
            </div>

            <p class="text-gray-700 mb-4">{{ project.description }}</p>

            <div class="flex justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <span class="flex items-center gap-1">
                <IconWrapper name="tags" :size="14" />
                {{ project.category }}
              </span>
              <span class="flex items-center gap-1">
                <IconWrapper name="users" :size="14" />
                {{ project.participantsCount }} 人參與
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-12 bg-gray-100">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-2xl font-bold mb-4">想要提出新的專案？</h2>
      <p class="text-lg mb-6 max-w-2xl mx-auto">
        如果您有值得討論的公共政策議題，歡迎提出專案建議。
      </p>
      <a href="/propose" class="btn-primary rounded-md inline-block">
        提出專案
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import IconWrapper from '../components/IconWrapper.vue'
import { projects, statuses, getColorClass } from '../data/projects'

// 篩選狀態
const statusFilter = ref('all')
const categoryFilter = ref('all')
const searchQuery = ref('')

// 分類列表
const categories = computed(() => [...new Set(projects.map(project => project.category))])

// 篩選專案
const filteredProjects = computed(() => {
  return projects.filter(project => {
    const statusMatch = statusFilter.value === 'all' || project.status === statusFilter.value
    const categoryMatch = categoryFilter.value === 'all' || project.category === categoryFilter.value
    const searchMatch = project.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                       project.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    return statusMatch && categoryMatch && searchMatch
  })
})
</script>
