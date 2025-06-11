<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- 頁面標題 -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">聯絡我們</h1>
          <p class="text-xl text-gray-600">加入 vTaiwan 社群，與我們一起推動數位民主</p>
        </div>

        <!-- 主要內容區域 -->
        <div class="grid md:grid-cols-2 gap-8">
          <!-- vTaiwan 工作組 Book -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex items-center mb-6">
              <IconWrapper name="book-open" :size="32" color="#D80000" />
              <h2 class="text-2xl font-bold text-gray-900 ml-3">vTaiwan 工作組</h2>
            </div>
            <p class="text-gray-600 mb-6">
              vTaiwan 工作組是推動數位民主的重要平台，我們在這裡討論政策、分享想法，並協作各種專案。
            </p>
            <a
              href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-democratic-red text-white font-medium rounded-lg hover:bg-red-700 transition duration-200"
            >
              <IconWrapper name="external-link" :size="20" class="mr-2" />
              查看工作組 Book
            </a>
          </div>

          <!-- g0v Slack 頻道 -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex items-center mb-6">
              <IconWrapper name="message-circle" :size="32" color="#D80000" />
              <h2 class="text-2xl font-bold text-gray-900 ml-3">g0v Slack 頻道</h2>
            </div>
            <p class="text-gray-600 mb-6">
              加入 g0v 的 Slack 工作空間，在 #vtaiwan 頻道與社群成員即時交流，參與討論和協作。
            </p>
            <div class="space-y-4">
              <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <IconWrapper name="hash" :size="20" color="#D80000" />
                <span class="ml-3 font-medium text-gray-900">#vtaiwan</span>
              </div>
              <p class="text-sm text-gray-500">
                主要討論頻道，用於政策討論、專案協作和社群交流
              </p>
            </div>
            <a
              href="https://join.g0v.tw/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition duration-200 mt-4"
            >
              <IconWrapper name="slack" :size="20" class="mr-2" />
              加入 g0v Slack
            </a>
          </div>
        </div>

        <!-- 其他聯絡方式 -->
        <div class="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">其他聯絡方式</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <IconWrapper name="github" :size="32" color="#D80000" class="mx-auto mb-3" />
              <h3 class="font-semibold text-gray-900 mb-2">GitHub</h3>
              <p class="text-gray-600 text-sm mb-3">查看我們的開源專案</p>
              <a
                href="https://github.com/g0v"
                target="_blank"
                rel="noopener noreferrer"
                class="text-democratic-red hover:text-red-700 text-sm font-medium"
              >
                前往 GitHub →
              </a>
            </div>
            <div class="text-center">
              <IconWrapper name="mail" :size="32" color="#D80000" class="mx-auto mb-3" />
              <h3 class="font-semibold text-gray-900 mb-2">電子郵件</h3>
              <p class="text-gray-600 text-sm mb-3">透過郵件與我們聯繫</p>
              <a
                href="mailto:contact@vtaiwan.tw"
                class="text-democratic-red hover:text-red-700 text-sm font-medium"
              >
                發送郵件 →
              </a>
            </div>
            <div class="text-center">
              <IconWrapper name="calendar" :size="32" color="#D80000" class="mx-auto mb-3" />
              <h3 class="font-semibold text-gray-900 mb-2">實體聚會</h3>
              <p class="text-gray-600 text-sm mb-3">參加我們的定期聚會</p>
              <router-link
                to="/meetups"
                class="text-democratic-red hover:text-red-700 text-sm font-medium"
              >
                查看聚會 →
              </router-link>
            </div>
          </div>
        </div>

        <!-- 加入社群 CTA -->
        <div class="mt-12 bg-gradient-to-r from-democratic-red to-red-600 rounded-lg p-8 text-center text-white">
          <h2 class="text-3xl font-bold mb-4">準備好加入我們了嗎？</h2>
          <p class="text-xl mb-6 opacity-90">
            無論你是開發者、設計師、政策專家，還是對數位民主有興趣的朋友，都歡迎加入 vTaiwan 社群！
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-white text-democratic-red font-medium rounded-lg hover:bg-gray-100 transition duration-200"
            >
              <IconWrapper name="book-open" :size="20" class="mr-2" />
              查看工作組
            </a>
            <a
              href="https://join.g0v.tw/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-democratic-red transition duration-200"
            >
              <IconWrapper name="slack" :size="20" class="mr-2" />
              加入 Slack
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconWrapper from '@/components/IconWrapper.vue'
</script>
