<template>
  <!-- Hero Section -->
  <section class="bg-black text-white py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ $t('projects.title') }}</h1>
      <p class="text-xl max-w-3xl">
        {{ $t('projects.description') }}
      </p>
    </div>
  </section>

  <!-- Filters Section -->
  <section class="py-6 border-b">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('projects.filters.status') }}</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="border-gray-300 rounded-md shadow-sm focus:border-democratic-red focus:ring focus:ring-democratic-red/20"
          >
            <option v-for="status in statuses" :key="status.value" :value="status.value">
              {{ currentLanguage === 'zh-TW' ? status.label : status.labelEn }}
            </option>
          </select>
        </div>

        <div>
          <label for="category-filter" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('projects.filters.category') }}</label>
          <select
            id="category-filter"
            v-model="categoryFilter"
            class="border-gray-300 rounded-md shadow-sm focus:border-democratic-red focus:ring focus:ring-democratic-red/20"
          >
            <option value="all">{{ $t('projects.categories.all') }}</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="ml-auto">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('projects.filters.search') }}</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconWrapper name="search" :size="18" />
            </div>
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              :placeholder="$t('projects.filters.searchPlaceholder')"
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
          class="card hover:border-democratic-red transition relative"
        >
          <!-- 樣稿標籤 -->
          <div v-if="project.isPrototype" class="absolute -top-2 -right-2 z-10">
            <div class="bg-yellow-400 text-black text-xs font-bold px-3 py-1 transform rotate-12 shadow-md">
              {{ currentLanguage === 'zh-TW' ? '樣稿' : 'Prototype' }}
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-start mb-4">
              <div
                :class="`w-12 h-12 rounded-full bg-${getColorClass(project.color)}/10 flex items-center justify-center mr-4`"
              >
                <IconWrapper :name="project.icon" :type="project.color" :size="24" />
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ getProjectTitle(project) }}</h3>
                <div class="flex items-center mt-1">
                  <span
                    :class="`inline-block w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-jade-green' : 'bg-gray-400'} mr-2`"
                  ></span>
                  <span class="text-sm text-gray-600">{{ getStatusText(project.status) }}</span>
                </div>
              </div>
            </div>

            <p class="text-gray-700 mb-4">{{ getProjectDescription(project) }}</p>

            <div class="flex justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <span class="flex items-center gap-1">
                <IconWrapper name="tags" :size="14" />
                {{ getProjectCategory(project) }}
              </span>
              <span class="flex items-center gap-1">
                <IconWrapper name="users" :size="14" />
                {{ project.participantsCount }} {{ $t('projects.participants') }}
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
      <h2 class="text-2xl font-bold mb-4">{{ $t('projects.cta.title') }}</h2>
      <p class="text-lg mb-6 max-w-2xl mx-auto">
        {{ $t('projects.cta.description') }}
      </p>
      <a href="/propose" class="btn-primary rounded-md inline-block">
        {{ $t('projects.cta.button') }}
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import { projects, statuses, getColorClass } from '../data/projects'

const { locale } = useI18n()

// 篩選狀態
const statusFilter = ref('all')
const categoryFilter = ref('all')
const searchQuery = ref('')

// 當前語言
const currentLanguage = computed(() => locale.value)

// 分類列表 - 根據語言顯示對應的分類
const categories = computed(() => {
  const uniqueCategories = [...new Set(projects.map(project =>
    currentLanguage.value === 'zh-TW' ? project.category : (project.categoryEn || project.category)
  ))]
  return uniqueCategories
})

// 取得專案標題
const getProjectTitle = (project) => {
  return currentLanguage.value === 'zh-TW' ? project.title : (project.titleEn || project.title)
}

// 取得專案描述
const getProjectDescription = (project) => {
  return currentLanguage.value === 'zh-TW' ? project.description : (project.descriptionEn || project.description)
}

// 取得專案分類
const getProjectCategory = (project) => {
  return currentLanguage.value === 'zh-TW' ? project.category : (project.categoryEn || project.category)
}

// 取得狀態文字
const getStatusText = (status) => {
  if (status === 'active') {
    return currentLanguage.value === 'zh-TW' ? '進行中' : 'Active'
  } else {
    return currentLanguage.value === 'zh-TW' ? '已完成' : 'Completed'
  }
}

// 篩選專案
const filteredProjects = computed(() => {
  return projects.filter(project => {
    const statusMatch = statusFilter.value === 'all' || project.status === statusFilter.value

    // 根據語言篩選分類
    const projectCategory = currentLanguage.value === 'zh-TW' ? project.category : (project.categoryEn || project.category)
    const categoryMatch = categoryFilter.value === 'all' || projectCategory === categoryFilter.value

    // 搜尋功能 - 同時搜尋中文和英文內容
    const searchMatch =
      project.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (project.titleEn && project.titleEn.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      project.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (project.descriptionEn && project.descriptionEn.toLowerCase().includes(searchQuery.value.toLowerCase()))

    return statusMatch && categoryMatch && searchMatch
  })
})
</script>
