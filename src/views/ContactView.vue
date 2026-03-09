<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-4xl">
        <!-- 頁面標題 -->
        <div class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-bold text-gray-900">{{ $t('contact.title') }}</h1>
          <p class="text-xl text-gray-600">{{ $t('contact.subtitle') }}</p>
        </div>

        <!-- 主要內容區域 -->
        <div class="grid gap-8 md:grid-cols-2">
          <!-- vTaiwan 工作組 Book -->
          <div class="rounded-lg bg-white p-8 shadow-lg">
            <div class="mb-6 flex items-center">
              <IconWrapper name="book-open" :size="32" color="#D82000" />
              <h2 class="ml-3 text-2xl font-bold text-gray-900">{{ $t('contact.workingGroup.title') }}</h2>
            </div>
            <p class="mb-6 text-gray-600">
              {{ $t('contact.workingGroup.description') }}
            </p>
            <a
              href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center rounded-lg bg-democratic-red px-6 py-3 font-medium text-white transition duration-200 hover:bg-red-700"
            >
              <IconWrapper name="external-link" :size="20" class="mr-2" color="white" />
              {{ $t('contact.workingGroup.button') }}
            </a>
          </div>

          <!-- g0v Slack 頻道 -->
          <div class="rounded-lg bg-white p-8 shadow-lg">
            <div class="mb-6 flex items-center">
              <IconWrapper name="message-circle" :size="32" color="#D82000" />
              <h2 class="ml-3 text-2xl font-bold text-gray-900">{{ $t('contact.slack.title') }}</h2>
            </div>
            <p class="mb-6 text-gray-600">
              {{ $t('contact.slack.description') }}
            </p>
            <div class="space-y-4">
              <div class="flex items-center rounded-lg bg-gray-50 p-4">
                <IconWrapper name="hash" :size="20" color="#D82000" />
                <span class="ml-3 font-medium text-gray-900">{{ $t('contact.slack.channel') }}</span>
              </div>
              <p class="text-sm text-gray-500">
                {{ $t('contact.slack.channelDesc') }}
              </p>
            </div>
            <a
              href="https://join.g0v.tw/"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center rounded-lg bg-gray-800 px-6 py-3 font-medium text-white transition duration-200 hover:bg-gray-700"
            >
              <IconWrapper name="slack" :size="20" class="mr-2" color="#FFFFFF" />
              {{ $t('contact.slack.button') }}
            </a>
          </div>
        </div>

        <!-- 其他聯絡方式 -->
        <div class="mt-12 rounded-lg bg-white p-8 shadow-lg">
          <h2 class="mb-6 text-2xl font-bold text-gray-900">{{ $t('contact.otherMethods.title') }}</h2>
          <div class="grid gap-6 md:grid-cols-3">
            <div class="text-center">
              <IconWrapper name="github" :size="32" color="#D82000" class="mx-auto mb-3" />
              <h3 class="mb-2 font-semibold text-gray-900">{{ $t('contact.otherMethods.github.title') }}</h3>
              <p class="mb-3 text-sm text-gray-600">{{ $t('contact.otherMethods.github.description') }}</p>
              <a href="https://github.com/g0v" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-democratic-red hover:text-red-700">
                {{ $t('contact.otherMethods.github.link') }}
              </a>
            </div>
            <div class="text-center">
              <IconWrapper name="mail" :size="32" color="#D82000" class="mx-auto mb-3" />
              <h3 class="mb-2 font-semibold text-gray-900">{{ $t('contact.otherMethods.email.title') }}</h3>
              <p class="mb-3 text-sm text-gray-600">{{ $t('contact.otherMethods.email.description') }}</p>
              <a href="mailto:info@vtaiwan.tw" class="text-sm font-medium text-democratic-red hover:text-red-700">
                {{ $t('contact.otherMethods.email.link') }}
              </a>
            </div>
            <div class="text-center">
              <IconWrapper name="calendar" :size="32" color="#D82000" class="mx-auto mb-3" />
              <h3 class="mb-2 font-semibold text-gray-900">{{ $t('contact.otherMethods.meetups.title') }}</h3>
              <p class="mb-3 text-sm text-gray-600">{{ $t('contact.otherMethods.meetups.description') }}</p>
              <router-link to="/meetups" class="text-sm font-medium text-democratic-red hover:text-red-700">
                {{ $t('contact.otherMethods.meetups.link') }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- 加入社群 CTA -->
        <div class="mt-12 rounded-lg bg-gradient-to-r from-democratic-red to-red-600 p-8 text-center text-white">
          <h2 class="mb-4 text-3xl font-bold">{{ $t('contact.cta.title') }}</h2>
          <p class="mb-6 text-xl opacity-90">
            {{ $t('contact.cta.description') }}
          </p>
          <div class="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center rounded-lg bg-white px-6 py-3 font-medium text-democratic-red transition duration-200 hover:bg-gray-100"
            >
              <IconWrapper name="book-open" :size="20" type="primary" class="mr-2" />
              {{ $t('contact.cta.workingGroup') }}
            </a>
            <a
              href="https://join.g0v.tw/"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center rounded-lg border-2 border-white px-6 py-3 font-medium text-white transition duration-200 hover:bg-white hover:text-democratic-red"
            >
              <IconWrapper name="slack" :size="20" class="mr-2 stroke-white group-hover:stroke-democratic-red" />
              {{ $t('contact.cta.slack') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconWrapper from '@/components/IconWrapper.vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
const { t } = useI18n()
useHead({
  title: t('contact.title') + ' | vTaiwan',
})
</script>
