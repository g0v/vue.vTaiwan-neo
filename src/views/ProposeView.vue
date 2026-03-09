<template>
  <!-- Hero Section -->
  <section class="bg-black py-12 text-white">
    <div class="container mx-auto px-4">
      <h1 class="mb-4 text-3xl font-bold md:text-4xl">{{ $t('propose.title') }}</h1>
      <p class="max-w-3xl text-xl">
        {{ $t('propose.description') }}
      </p>
    </div>
  </section>

  <!-- Requirements Section -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-4xl">
        <!-- 參與要求 -->
        <div class="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 class="mb-6 text-2xl font-bold text-gray-800">{{ $t('propose.requirements.title') }}</h2>

          <div class="space-y-6">
            <!-- 線上會議參與 -->
            <div class="flex items-start space-x-4">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-democratic-red/10">
                <IconWrapper name="video" :type="'democratic-red'" :size="24" />
              </div>
              <div>
                <h3 class="mb-2 text-lg font-semibold text-gray-800">{{ $t('propose.requirements.meeting.title') }}</h3>
                <p class="mb-3 text-gray-600">{{ $t('propose.requirements.meeting.description') }}</p>
                <ul class="ml-4 list-inside list-disc space-y-1 text-gray-600">
                  <li>{{ $t('propose.requirements.meeting.bullet1') }}</li>
                  <li>{{ $t('propose.requirements.meeting.bullet2') }}</li>
                  <li>{{ $t('propose.requirements.meeting.bullet3') }}</li>
                </ul>
              </div>
            </div>

            <!-- 內容管理員認領 -->
            <div class="flex items-start space-x-4">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-jade-green/10">
                <IconWrapper name="users" :type="'jade-green'" :size="24" />
              </div>
              <div>
                <h3 class="mb-2 text-lg font-semibold text-gray-800">{{ $t('propose.requirements.admin.title') }}</h3>
                <p class="mb-3 text-gray-600">{{ $t('propose.requirements.admin.description') }}</p>
                <ul class="ml-4 list-inside list-disc space-y-1 text-gray-600">
                  <li>{{ $t('propose.requirements.admin.bullet1') }}</li>
                  <li>{{ $t('propose.requirements.admin.bullet2') }}</li>
                  <li>{{ $t('propose.requirements.admin.bullet3') }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 提案流程 -->
        <div class="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 class="mb-6 text-2xl font-bold text-gray-800">{{ $t('propose.process.title') }}</h2>

          <div class="grid gap-6 md:grid-cols-3">
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-democratic-red/10">
                <span class="text-2xl font-bold text-democratic-red">1</span>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-800">{{ $t('propose.process.step1.title') }}</h3>
              <p class="text-gray-600">{{ $t('propose.process.step1.description') }}</p>
            </div>

            <div class="text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-jade-green/10">
                <span class="text-2xl font-bold text-jade-green">2</span>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-800">{{ $t('propose.process.step2.title') }}</h3>
              <p class="text-gray-600">{{ $t('propose.process.step2.description') }}</p>
            </div>

            <div class="text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                <span class="text-2xl font-bold text-blue-500">3</span>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-800">{{ $t('propose.process.step3.title') }}</h3>
              <p class="text-gray-600">{{ $t('propose.process.step3.description') }}</p>
            </div>
          </div>
        </div>

        <!-- 聯絡資訊 -->
        <div class="rounded-lg bg-gray-50 p-8">
          <h2 class="mb-6 text-2xl font-bold text-gray-800">{{ $t('propose.contact.title') }}</h2>
          <p class="mb-6 text-gray-600">{{ $t('propose.contact.description') }}</p>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="rounded-lg bg-white p-6">
              <div class="mb-4 flex items-center">
                <IconWrapper name="calendar" :size="20" class="mr-3 text-democratic-red" />
                <h3 class="text-lg font-semibold text-gray-800">{{ $t('propose.contact.meeting.title') }}</h3>
              </div>
              <p class="mb-4 text-gray-600">{{ $t('propose.contact.meeting.description') }}</p>
              <router-link to="/meetups" class="btn-primary inline-block">
                {{ $t('propose.contact.meeting.button') }}
              </router-link>
            </div>

            <div class="rounded-lg bg-white p-6">
              <div class="mb-4 flex items-center">
                <IconWrapper name="message" :size="20" class="mr-3 text-jade-green" />
                <h3 class="text-lg font-semibold text-gray-800">{{ $t('propose.contact.community.title') }}</h3>
              </div>
              <p class="mb-4 text-gray-600">{{ $t('propose.contact.community.description') }}</p>
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
  title: t('propose.title') + ' | vTaiwan',
})
</script>
