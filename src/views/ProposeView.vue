<template>
  <!-- Hero Section -->
  <section class="bg-black text-white py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ $t('propose.title') }}</h1>
      <p class="text-xl max-w-3xl">
        {{ $t('propose.description') }}
      </p>
    </div>
  </section>

  <!-- Requirements Section -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- 參與要求 -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ $t('propose.requirements.title') }}</h2>

          <div class="space-y-6">
            <!-- 線上會議參與 -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-democratic-red/10 rounded-full flex items-center justify-center">
                <IconWrapper name="video" :type="'democratic-red'" :size="24" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ $t('propose.requirements.meeting.title') }}</h3>
                <p class="text-gray-600 mb-3">{{ $t('propose.requirements.meeting.description') }}</p>
                <ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>{{ $t('propose.requirements.meeting.bullet1') }}</li>
                  <li>{{ $t('propose.requirements.meeting.bullet2') }}</li>
                  <li>{{ $t('propose.requirements.meeting.bullet3') }}</li>
                </ul>
              </div>
            </div>

            <!-- 內容管理員認領 -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-jade-green/10 rounded-full flex items-center justify-center">
                <IconWrapper name="users" :type="'jade-green'" :size="24" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ $t('propose.requirements.admin.title') }}</h3>
                <p class="text-gray-600 mb-3">{{ $t('propose.requirements.admin.description') }}</p>
                <ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>{{ $t('propose.requirements.admin.bullet1') }}</li>
                  <li>{{ $t('propose.requirements.admin.bullet2') }}</li>
                  <li>{{ $t('propose.requirements.admin.bullet3') }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 提案流程 -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ $t('propose.process.title') }}</h2>

          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-democratic-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-democratic-red">1</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ $t('propose.process.step1.title') }}</h3>
              <p class="text-gray-600">{{ $t('propose.process.step1.description') }}</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-jade-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-jade-green">2</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ $t('propose.process.step2.title') }}</h3>
              <p class="text-gray-600">{{ $t('propose.process.step2.description') }}</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-blue-500">3</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ $t('propose.process.step3.title') }}</h3>
              <p class="text-gray-600">{{ $t('propose.process.step3.description') }}</p>
            </div>
          </div>
        </div>

        <!-- 聯絡資訊 -->
        <div class="bg-gray-50 rounded-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ $t('propose.contact.title') }}</h2>
          <p class="text-gray-600 mb-6">{{ $t('propose.contact.description') }}</p>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg p-6">
              <div class="flex items-center mb-4">
                <IconWrapper name="calendar" :size="20" class="text-democratic-red mr-3" />
                <h3 class="text-lg font-semibold text-gray-800">{{ $t('propose.contact.meeting.title') }}</h3>
              </div>
              <p class="text-gray-600 mb-4">{{ $t('propose.contact.meeting.description') }}</p>
              <router-link to="/meetups" class="btn-primary inline-block">
                {{ $t('propose.contact.meeting.button') }}
              </router-link>
            </div>

            <div class="bg-white rounded-lg p-6">
              <div class="flex items-center mb-4">
                <IconWrapper name="message" :size="20" class="text-jade-green mr-3" />
                <h3 class="text-lg font-semibold text-gray-800">{{ $t('propose.contact.community.title') }}</h3>
              </div>
              <p class="text-gray-600 mb-4">{{ $t('propose.contact.community.description') }}</p>
              <router-link to="/contact" class="btn-secondary inline-block">
                {{ $t('propose.contact.community.button') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import IconWrapper from '../components/IconWrapper.vue'

const { t } = useI18n()
useHead({
  title: t('propose.title') + ' | vTaiwan'
})
</script>
