<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- 頁面標題 -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('contact.title') }}</h1>
          <p class="text-xl text-gray-600">{{ $t('contact.subtitle') }}</p>
        </div>

        <!-- 主要內容區域 -->
        <div class="grid md:grid-cols-2 gap-8">
          <!-- vTaiwan 工作組 Book -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex items-center mb-6">
              <IconWrapper name="book-open" :size="32" color="#D80000" />
              <h2 class="text-2xl font-bold text-gray-900 ml-3">{{ $t('contact.workingGroup.title') }}</h2>
            </div>
            <p class="text-gray-600 mb-6">
              {{ $t('contact.workingGroup.description') }}
            </p>
            <a
              href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-democratic-red text-white font-medium rounded-lg hover:bg-red-700 transition duration-200"
            >
              <IconWrapper name="external-link" :size="20" class="mr-2" />
              {{ $t('contact.workingGroup.button') }}
            </a>
          </div>

          <!-- g0v Slack 頻道 -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex items-center mb-6">
              <IconWrapper name="message-circle" :size="32" color="#D80000" />
              <h2 class="text-2xl font-bold text-gray-900 ml-3">{{ $t('contact.slack.title') }}</h2>
            </div>
            <p class="text-gray-600 mb-6">
              {{ $t('contact.slack.description') }}
            </p>
            <div class="space-y-4">
              <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <IconWrapper name="hash" :size="20" color="#D80000" />
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
              class="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition duration-200 mt-4"
            >
              <IconWrapper name="slack" :size="20" class="mr-2" color="#FFFFFF" />
              {{ $t('contact.slack.button') }}
            </a>
          </div>
        </div>

        <!-- 其他聯絡方式 -->
        <div class="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('contact.otherMethods.title') }}</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <IconWrapper name="github" :size="32" color="#D80000" class="mx-auto mb-3" />
              <h3 class="font-semibold text-gray-900 mb-2">{{ $t('contact.otherMethods.github.title') }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ $t('contact.otherMethods.github.description') }}</p>
              <a
                href="https://github.com/g0v"
                target="_blank"
                rel="noopener noreferrer"
                class="text-democratic-red hover:text-red-700 text-sm font-medium"
              >
                {{ $t('contact.otherMethods.github.link') }}
              </a>
            </div>
            <div class="text-center">
              <IconWrapper name="mail" :size="32" color="#D80000" class="mx-auto mb-3" />
              <h3 class="font-semibold text-gray-900 mb-2">{{ $t('contact.otherMethods.email.title') }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ $t('contact.otherMethods.email.description') }}</p>
              <a
                href="mailto:contact@vtaiwan.tw"
                class="text-democratic-red hover:text-red-700 text-sm font-medium"
              >
                {{ $t('contact.otherMethods.email.link') }}
              </a>
            </div>
            <div class="text-center">
              <IconWrapper name="calendar" :size="32" color="#D80000" class="mx-auto mb-3" />
              <h3 class="font-semibold text-gray-900 mb-2">{{ $t('contact.otherMethods.meetups.title') }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ $t('contact.otherMethods.meetups.description') }}</p>
              <router-link
                to="/meetups"
                class="text-democratic-red hover:text-red-700 text-sm font-medium"
              >
                {{ $t('contact.otherMethods.meetups.link') }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- 加入社群 CTA -->
        <div class="mt-12 bg-gradient-to-r from-democratic-red to-red-600 rounded-lg p-8 text-center text-white">
          <h2 class="text-3xl font-bold mb-4">{{ $t('contact.cta.title') }}</h2>
          <p class="text-xl mb-6 opacity-90">
            {{ $t('contact.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-white text-democratic-red font-medium rounded-lg hover:bg-gray-100 transition duration-200"
            >
              <IconWrapper name="book-open" :size="20" class="mr-2" />
              {{ $t('contact.cta.workingGroup') }}
            </a>
            <a
              href="https://join.g0v.tw/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-democratic-red transition duration-200"
            >
              <IconWrapper name="slack" :size="20" class="mr-2" />
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
  title: t('contact.title') + ' | vTaiwan'
})
</script>
