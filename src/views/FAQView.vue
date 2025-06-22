<template>
  <main class="container mx-auto px-4 py-12">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">{{ $t('faq.title') }}</h1>

      <section class="prose-lg mb-12">
        <p class="mb-6">
          {{ $t('faq.description') }}
        </p>

        <div class="space-y-6">
          <!-- FAQ 項目 -->
          <div
            v-for="faq in faqs"
            :key="faq.id"
            class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-6"
          >
            <h3 class="text-xl font-bold mb-2 text-democratic-red">
              {{ getLocalizedQuestion(faq) }}
            </h3>
            <p class="text-gray-700">
              {{ getLocalizedAnswer(faq) }}
            </p>
            <ol v-if="getLocalizedDetails(faq)" class="list-decimal pl-6 mt-2 space-y-1">
              <li v-for="detail in getLocalizedDetails(faq)" :key="detail" class="text-gray-700">
                {{ detail }}
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- 聯絡我們區塊 -->
      <section class="border-t pt-12 mt-12">
        <h2 class="text-3xl font-bold mb-6">{{ $t('faq.contact.title') }}</h2>
        <p class="mb-8">{{ $t('faq.contact.description') }}</p>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-100 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4">{{ $t('faq.contact.email.title') }}</h3>
            <p class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-democratic-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:contact@vtaiwan.tw" class="hover:text-democratic-red transition">contact@vtaiwan.tw</a>
            </p>
          </div>

          <div class="bg-gray-100 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4">{{ $t('faq.contact.social.title') }}</h3>
            <div class="space-y-2">
              <p class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-democratic-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <a href="https://twitter.com/vtaiwan" target="_blank" class="hover:text-democratic-red transition">@vtaiwan</a>
              </p>
              <p class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-democratic-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
                <a href="https://facebook.com/vtaiwan.tw" target="_blank" class="hover:text-democratic-red transition">vTaiwan</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { faqs } from '../data/faqs'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// 根據當前語言取得問題文字
const getLocalizedQuestion = (faq) => {
  if (locale.value === 'en' && faq.question_en) {
    return faq.question_en
  }
  return faq.question
}

// 根據當前語言取得答案文字
const getLocalizedAnswer = (faq) => {
  if (locale.value === 'en' && faq.answer_en) {
    return faq.answer_en
  }
  return faq.answer
}

// 根據當前語言取得詳細內容
const getLocalizedDetails = (faq) => {
  if (locale.value === 'en' && faq.details_en) {
    return faq.details_en
  }
  return faq.details
}
</script>

<style scoped>
.prose-lg {
  line-height: 1.75;
}

.prose-lg p {
  margin-bottom: 1.5rem;
}

.list-decimal {
  list-style-type: decimal;
}

.list-decimal li {
  margin-bottom: 0.25rem;
}
</style>
