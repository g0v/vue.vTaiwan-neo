<template>
  <header class="sticky top-0 z-[999] bg-black text-white">
    <div class="w-full px-4 md:mx-auto">
      <div class="flex h-16 items-center justify-between">
        <router-link to="/" class="flex items-center" @click="mobileMenuOpen = false">
          <img src="@/assets/images/vtaiwan-logo.svg" alt="vTaiwan Logo" class="h-8 w-auto" />
        </router-link>

        <div
          class="hidden items-center space-x-1 lg:flex xl:space-x-10"
          :class="{
            'md:space-x-6': !isJapanese,
            'md:space-x-4': isJapanese,
            'space-x-6': !isJapanese,
            'space-x-4': isJapanese,
          }"
        >
          <router-link
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            class="flex items-center gap-1 transition hover:text-democratic-red"
            :class="{
              'ml-0': isJapanese,
              'text-democratic-red': $route.path === item.href,
              'text-xs': isJapanese,
              'text-md': !isJapanese,
            }"
          >
            <IconWrapper :name="item.icon" :size="16" :stroke="'#ffffff'" />
            <span>{{ $t(item.label) }}</span>
          </router-link>
        </div>

        <div class="flex items-center space-x-2">
          <LanguageSwitcher />

          <!-- 登入狀態顯示 -->
          <div v-if="user" class="flex items-center space-x-2">
            <router-link to="/profile" class="flex items-center space-x-2 transition hover:text-democratic-red" :title="$t('common.profile')">
              <img v-if="userData && userData.photoURL" :src="userData.photoURL" :alt="userData.name" class="h-8 w-8 rounded-full transition hover:ring-2 hover:ring-democratic-red" />
              <div v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 transition hover:bg-democratic-red">
                <span class="text-xs text-white">👤</span>
              </div>
              <span class="hidden text-sm lg:block">{{ userData && userData.name }}</span>
            </router-link>
          </div>

          <!-- 未登入顯示登入按鈕 -->

          <div v-else>
            <button @click="handleShowLogin" class="text-sm transition hover:text-democratic-red">
              {{ $t('common.login') }}
            </button>
          </div>

          <button @click="toggleMobileMenu" class="text-white lg:hidden" title="Menu" name="Menu">
            <IconWrapper name="menu" :size="24" color="white" />
          </button>
        </div>
      </div>
    </div>

    <div v-show="mobileMenuOpen" class="border-t border-gray-700 bg-black lg:hidden">
      <div class="w-full px-4 py-3 md:container md:mx-auto">
        <router-link
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-2 py-2 transition hover:text-democratic-red"
          :class="{
            'text-democratic-red': $route.path === item.href,
          }"
          @click="mobileMenuOpen = false"
        >
          <IconWrapper :name="item.icon" :size="16" :stroke="'#ffffff'" />
          <span>{{ $t(item.label) }}</span>
        </router-link>

        <button v-if="user" @click="handleLogout" class="flex items-center gap-2 py-2 transition hover:text-democratic-red">
          <IconWrapper name="log-out" :size="16" :stroke="'#ffffff'" />
          {{ $t('common.logout') }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import IconWrapper from './IconWrapper.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t, locale } = useI18n()
const route = useRoute()
const mobileMenuOpen = ref(false)

// 判斷是否為日語環境
const isJapanese = computed(() => locale.value === 'ja')

const navItems = [
  { href: '/topics', label: 'header.topics', icon: 'message-circle' },
  { href: '/meetups', label: 'header.meetups', icon: 'calendar' },
  { href: '/blogs', label: 'header.blogs', icon: 'book-open' },
  { href: '/mastodon', label: 'header.mastodon', icon: 'file-text' },
  { href: '/faq', label: 'header.faq', icon: 'help-circle' },
  { href: '/intro', label: 'header.about', icon: 'info' },
  { href: '/contributors', label: 'header.contributors', icon: 'users' },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 接收來自 App.vue 的用戶資料
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  userData: {
    type: Object,
    default: null,
  },
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

<style scoped>
/* 使用 router-link-exact-active class 來標示當前路由 */
.router-link-exact-active {
  color: #d82000 !important; /* democratic-red 顏色 */
}

/* 確保圖示也會變色 */
.router-link-exact-active .icon-wrapper {
  color: #d82000 !important;
}
</style>
