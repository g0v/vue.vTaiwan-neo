<template>
  <header class="bg-black text-white sticky top-0 z-10">
    <div class="w-full px-4 md:mx-auto">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="flex items-center">
          <img src="@/assets/images/vtaiwan-logo.svg" alt="vTaiwan Logo" class="h-8 w-auto" />
        </router-link>

        <div class="hidden md:flex items-center space-x-1 md:space-x-2 lg:space-x-6 xl:space-x-10">
          <router-link
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            class="hover:text-democratic-red transition flex items-center gap-1"
          >
            <IconWrapper :name="item.icon" :size="16" />
            <span>{{ $t(item.label) }}</span>
          </router-link>
        </div>

        <div class="flex items-center space-x-2">
          <LanguageSwitcher />

          <!-- 登入狀態顯示 -->
          <div v-if="user" class="flex items-center space-x-2">
            <img
              v-if="user.photoURL"
              :src="user.photoURL"
              :alt="user.displayName"
              class="w-8 h-8 rounded-full"
            />
            <span class="text-sm md:hidden lg:block">{{ user.displayName }}</span>
            <button @click="handleLogout" class="text-sm hover:text-democratic-red transition">
              {{ $t('common.logout') }}
            </button>
          </div>

          <!-- 未登入顯示登入按鈕 -->
          <button v-else @click="handleShowLogin" class="text-sm hover:text-democratic-red transition">
            {{ $t('common.login') }}
          </button>

          <button @click="toggleMobileMenu" class="md:hidden text-white">
            <IconWrapper name="menu" :size="24" color="white" />
          </button>
        </div>
      </div>
    </div>

    <div v-show="mobileMenuOpen" class="md:hidden bg-black border-t border-gray-700">
      <div class="w-full px-4 md:container md:mx-auto py-3">
        <router-link
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-2 py-2 hover:text-democratic-red transition"
          @click="mobileMenuOpen = false"
        >
          <IconWrapper :name="item.icon" :size="16" />
          <span>{{ $t(item.label) }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconWrapper from './IconWrapper.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const mobileMenuOpen = ref(false)

const navItems = [
  { href: '/projects', label: 'header.projects', icon: 'folder' },
  { href: '/meetups', label: 'header.meetups', icon: 'calendar' },
  { href: '/blogs', label: 'header.blogs', icon: 'file-text' },
  { href: '/faq', label: 'header.faq', icon: 'help-circle' },
  { href: '/about', label: 'header.about', icon: 'info' },
  { href: '/contributors', label: 'header.contributors', icon: 'users' },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 接收來自 App.vue 的用戶資料
const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

// 發送事件給 App.vue
const emit = defineEmits(['logout', 'show-login'])

const handleLogout = () => {
  emit('logout')
}

const handleShowLogin = () => {
  emit('show-login')
}
</script>
