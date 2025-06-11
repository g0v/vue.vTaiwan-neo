<template>
  <div class="relative inline-block text-left">
    <button @click="toggleDropdown" class="flex items-center space-x-1 text-white hover:text-democratic-red transition">
      <span>{{ currentLang === 'zh' ? '中文' : 'English' }}</span>
      <IconWrapper name="chevron-down" :size="16" />
    </button>

    <div v-show="dropdownOpen" class="absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
      <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu-button">
        <button
          @click="selectLanguage('en')"
          :class="`block w-full text-left px-4 py-2 text-sm ${currentLang === 'en' ? 'bg-gray-100 text-democratic-red' : 'text-black hover:bg-gray-100'}`"
          role="menuitem"
        >
          English
        </button>
        <button
          @click="selectLanguage('zh')"
          :class="`block w-full text-left px-4 py-2 text-sm ${currentLang === 'zh' ? 'bg-gray-100 text-democratic-red' : 'text-black hover:bg-gray-100'}`"
          role="menuitem"
        >
          中文
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconWrapper from './IconWrapper.vue'

const route = useRouter()
const currentRoute = useRoute()
const dropdownOpen = ref(false)
const currentLang = ref('zh')

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectLanguage = (lang) => {
  currentLang.value = lang
  dropdownOpen.value = false

  // 這裡可以加入語言切換邏輯
  // 例如：更新路由、儲存語言偏好等
  console.log('Language changed to:', lang)
}

// 點擊外部關閉選單
const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.relative')) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
