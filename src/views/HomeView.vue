<script setup lang="ts">
import IconWrapper from '../components/IconWrapper.vue'
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-black text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-5">
            <div><span class="text-democratic-red">開放</span>、<span class="text-jade-green">協作</span>、<span class="text-wheat-yellow">共創</span></div>
            <div class="mt-3">台灣的未來</div>
          </h1>
          <p class="text-xl mb-8">vTaiwan 是一個促進政府與公民對話的開放協作平台，讓每個人都能參與公共政策的形成過程。</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/projects" class="btn-primary rounded-md">
              瀏覽專案
            </router-link>
            <router-link to="/about" class="btn-outline bg-transparent text-white border-white rounded-md">
              了解更多
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center">
          <span class="title-underline">如何運作</span>
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-democratic-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconWrapper name="message-circle" type="primary" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-4">提出議題</h3>
            <p class="text-gray-700">任何人都可以提出值得討論的公共政策議題，經過初步審核後進入討論階段。</p>
          </div>

          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-jade-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconWrapper name="users" type="teal" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-4">開放討論</h3>
            <p class="text-gray-700">透過線上討論與實體會議，收集各方意見，形成具體的政策建議。</p>
          </div>

          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-wheat-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconWrapper name="check-circle" type="amber" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-4">政策形成</h3>
            <p class="text-gray-700">將公民共識轉化為具體政策建議，提交給相關政府部門參考與執行。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-black text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">加入我們，共同參與台灣的未來</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">無論您是公民、專家、政府人員或是關心公共事務的任何人，都歡迎加入 vTaiwan 平台，貢獻您的想法。</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/projects" class="btn-primary rounded-md">
            瀏覽專案
          </router-link>
          <router-link to="/about" class="btn-outline bg-transparent text-white border-white rounded-md">
            了解更多
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
