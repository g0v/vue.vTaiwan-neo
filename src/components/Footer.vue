<template>
  <footer class="bg-black text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-democratic-red pb-2 inline-block">vTaiwan</h3>
          <p class="text-gray-300">
            公共政策的開放協作平台
          </p>
        </div>

        <div>
          <h4 class="font-bold mb-4">社群</h4>
          <ul class="space-y-2">
            <li>
              <a href="https://www.facebook.com/vtaiwan.tw/" class="text-gray-300 hover:text-white transition flex items-center gap-1">
                <IconWrapper name="facebook" :size="16" />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/vtaiwan.tw/" class="text-gray-300 hover:text-white transition flex items-center gap-1">
                <IconWrapper name="instagram" :size="16" />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a href="https://g0v.hackmd.io/@vtaiwan" class="text-gray-300 hover:text-white transition flex items-center gap-1">
                <IconWrapper name="file-text" :size="16" />
                <span>HackMD</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold mb-4">聯絡我們</h4>
          <p class="text-gray-300 flex items-center gap-2 mb-2">
            <IconWrapper name="mail" :size="16" />
            <a href="mailto:contact@vtaiwan.org" class="hover:text-democratic-red transition">contact@vtaiwan.org</a>
          </p>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>© {{ currentYear }} vTaiwan. All rights reserved.</p>
        <p class="mt-2">
          <a href="https://github.com/Tofuswang/vtaiwan-neo" class="hover:text-white transition">原始碼</a> |
          <a href="/privacy" class="hover:text-white transition">隱私政策</a> |
          <a href="/terms" class="hover:text-white transition">使用條款</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconWrapper from './IconWrapper.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
