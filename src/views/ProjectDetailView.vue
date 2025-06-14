<template>
  <div v-if="project">
    <!-- Hero Section -->
    <section class="bg-black text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl relative">
          <!-- 樣稿標籤 -->
          <div v-if="project.isPrototype" class="absolute -top-4 -right-4 z-10">
            <div class="bg-yellow-400 text-black text-sm font-bold px-4 py-2 transform rotate-12 shadow-lg">
              {{ currentLanguage === 'zh-TW' ? '樣稿' : 'Prototype' }}
            </div>
          </div>

          <div class="flex items-center mb-6">
            <div
              :class="`w-16 h-16 rounded-full bg-${getColorClass(project.color)}/20 flex items-center justify-center mr-6`"
            >
              <IconWrapper :name="project.icon" :type="project.color" :size="32" />
            </div>
            <div>
              <span
                :class="`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'active'
                    ? 'bg-jade-green/20 text-jade-green'
                    : 'bg-gray-600/20 text-gray-300'
                }`"
              >
                {{ getStatusText(project.status) }}
              </span>
            </div>
          </div>

          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            {{ getProjectTitle(project) }}
          </h1>

          <p class="text-xl text-gray-300 mb-8 max-w-3xl">
            {{ getProjectDescription(project) }}
          </p>

          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center gap-2">
              <IconWrapper name="tags" :size="16" />
              <span>{{ getProjectCategory(project) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <IconWrapper name="users" :size="16" />
              <span>{{ project.participantsCount }} {{ $t('projects.participants') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <IconWrapper name="calendar" :size="16" />
              <span>{{ $t('projects.created') }} 2024</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- 專案目標 -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">{{ $t('projectDetail.objectives') }}</h2>
            <div class="bg-gray-50 rounded-lg p-6">
              <p class="text-lg leading-relaxed">
                {{ getProjectDescription(project) }}
              </p>
            </div>
          </div>

          <!-- 參與方式 -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">{{ $t('projectDetail.howToParticipate') }}</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="card">
                <div class="p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-10 h-10 rounded-full bg-democratic-red/10 flex items-center justify-center mr-3">
                      <IconWrapper name="message-circle" :size="20" />
                    </div>
                    <h3 class="font-semibold">{{ $t('projectDetail.discuss') }}</h3>
                  </div>
                  <p class="text-gray-600">{{ $t('projectDetail.discussDesc') }}</p>
                </div>
              </div>

              <div class="card">
                <div class="p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-10 h-10 rounded-full bg-jade-green/10 flex items-center justify-center mr-3">
                      <IconWrapper name="edit" :size="20" />
                    </div>
                    <h3 class="font-semibold">{{ $t('projectDetail.contribute') }}</h3>
                  </div>
                  <p class="text-gray-600">{{ $t('projectDetail.contributeDesc') }}</p>
                </div>
              </div>

              <div class="card">
                <div class="p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-10 h-10 rounded-full bg-wheat-yellow/10 flex items-center justify-center mr-3">
                      <IconWrapper name="share" :size="20" />
                    </div>
                    <h3 class="font-semibold">{{ $t('projectDetail.share') }}</h3>
                  </div>
                  <p class="text-gray-600">{{ $t('projectDetail.shareDesc') }}</p>
                </div>
              </div>

              <div class="card">
                <div class="p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                      <IconWrapper name="users" :size="20" />
                    </div>
                    <h3 class="font-semibold">{{ $t('projectDetail.join') }}</h3>
                  </div>
                  <p class="text-gray-600">{{ $t('projectDetail.joinDesc') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 相關連結 -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">{{ $t('projectDetail.relatedLinks') }}</h2>
            <div class="space-y-4" v-if="project.isPrototype || project.githubRepo">
              <a :href="project.githubRepo || '#'" :class="{'opacity-50 cursor-not-allowed': project.isPrototype}" class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition">
                <IconWrapper name="github" :size="20" class="mr-3" />
                <span>
                  {{ $t('projectDetail.githubRepo') }}
                  <span v-if="project.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>
              <a :href="project.documentation || '#'" :class="{'opacity-50 cursor-not-allowed': project.isPrototype}" class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition" v-if="project.isPrototype || project.documentation">
                <IconWrapper name="file-text" :size="20" class="mr-3" />
                <span>
                  {{ $t('projectDetail.documentation') }}
                  <span v-if="project.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>
              <a :href="project.discussion || '#'" :class="{'opacity-50 cursor-not-allowed': project.isPrototype}" class="flex items-center p-4 border rounded-lg hover:border-democratic-red transition" v-if="project.isPrototype || project.discussion">
                <IconWrapper name="message-square" :size="20" class="mr-3" />
                <span>
                  {{ $t('projectDetail.discussion') }}
                  <span v-if="project.isPrototype">（樣稿，施工中）</span>
                </span>
                <IconWrapper name="external-link" :size="16" class="ml-auto" />
              </a>
            </div>
          </div>

          <!-- 行動按鈕 -->
          <div class="text-center">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/projects" class="btn-secondary">
                {{ $t('projectDetail.backToProjects') }}
              </a>
              <button class="btn-primary">
                {{ $t('projectDetail.joinProject') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- 404 頁面 -->
  <div v-else class="py-16">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl font-bold mb-4">{{ $t('projectDetail.notFound') }}</h1>
      <p class="text-lg text-gray-600 mb-8">{{ $t('projectDetail.notFoundDesc') }}</p>
      <a href="/projects" class="btn-primary">{{ $t('projectDetail.backToProjects') }}</a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconWrapper from '../components/IconWrapper.vue'
import { projects, getColorClass } from '../data/projects'

const route = useRoute()
const { locale } = useI18n()

// 當前語言
const currentLanguage = computed(() => locale.value)

// 根據路由參數找到對應的專案
const project = computed(() => {
  const topic = route.params.topic
  return projects.find(p => {
    // 檢查 URL 是否匹配
    const projectUrl = p.url.replace('/projects/', '')
    return projectUrl === topic
  })
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
</script>
