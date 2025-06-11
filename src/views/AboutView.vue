<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">關於我們</h1>

      <div class="prose max-w-none">
        <h2 class="text-2xl font-bold mb-4">vTaiwan 的使命</h2>
        <p class="text-lg mb-6">
          vTaiwan 是台灣的公共政策開放協作平台，致力於促進政府與公民之間的對話，
          讓每個人都能參與公共政策的形成過程。我們相信，透過開放、協作、共創的方式，
          可以為台灣的未來找到更好的解決方案。
        </p>

        <h2 class="text-2xl font-bold mb-4">我們的價值</h2>
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-democratic-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconWrapper name="globe" type="primary" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-2">開放</h3>
            <p class="text-gray-600">資訊透明，過程公開</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-jade-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconWrapper name="users" type="teal" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-2">協作</h3>
            <p class="text-gray-600">多方參與，共同討論</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-wheat-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconWrapper name="lightbulb" type="amber" :size="32" />
            </div>
            <h3 class="text-xl font-bold mb-2">共創</h3>
            <p class="text-gray-600">創新思維，解決問題</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold mb-4">聯絡我們</h2>
        <p class="mb-4">
          如果您有任何問題或建議，歡迎與我們聯繫：
        </p>
        <ul class="space-y-2">
          <li class="flex items-center gap-2">
            <IconWrapper name="mail" :size="16" />
            <a href="mailto:contact@vtaiwan.org" class="text-democratic-red hover:underline">
              contact@vtaiwan.org
            </a>
          </li>
          <li class="flex items-center gap-2">
            <IconWrapper name="facebook" :size="16" />
            <a href="https://www.facebook.com/vtaiwan.tw/" target="_blank" class="text-democratic-red hover:underline">
              Facebook
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconWrapper from '../components/IconWrapper.vue'
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
