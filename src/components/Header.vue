<template>
  <header class="bg-black text-white sticky top-0 z-[999]">
    <div class="w-full px-4 md:mx-auto">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="flex items-center" @click="mobileMenuOpen = false">
          <img src="@/assets/images/vtaiwan-logo.svg" alt="vTaiwan Logo" class="h-8 w-auto" />
        </router-link>

        <div class="hidden lg:flex items-center space-x-1 xl:space-x-10"
        :class="{
          'md:space-x-6': !isJapanese,
          'md:space-x-4': isJapanese,
          'space-x-6': !isJapanese,
          'space-x-4': isJapanese
        }"
        >
          <router-link
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            class="hover:text-democratic-red transition flex items-center gap-1"
            :class="{
              'ml-0': isJapanese,
              'text-democratic-red': $route.path === item.href,
              'text-xs': isJapanese,
              'text-md': !isJapanese
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
            <router-link
              to="/profile"
              class="flex items-center space-x-2 hover:text-democratic-red transition"
              :title="$t('common.profile')"
            >
              <img
                v-if="userData && userData.photoURL"
                :src="userData.photoURL"
                :alt="userData.name"
                class="w-8 h-8 rounded-full hover:ring-2 hover:ring-democratic-red transition"
              />
              <div v-else class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center hover:bg-democratic-red transition">
                <span class="text-white text-xs">👤</span>
              </div>
              <span class="text-sm hidden lg:block">{{ userData && userData.name }}</span>
            </router-link>
          </div>

          <!-- 未登入顯示登入按鈕 -->

          <div v-else>
            <button @click="handleShowLogin" class="text-sm hover:text-democratic-red transition">
              {{ $t('common.login') }}
            </button>
          </div>

          <button @click="toggleMobileMenu" class="lg:hidden text-white" title="Menu" name="Menu">
            <IconWrapper name="menu" :size="24" color="white" />
          </button>
        </div>
      </div>
    </div>

    <div v-show="mobileMenuOpen" class="lg:hidden bg-black border-t border-gray-700">
      <div class="w-full px-4 md:container md:mx-auto py-3">
        <router-link
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-2 py-2 hover:text-democratic-red transition"
          :class="{
            'text-democratic-red': $route.path === item.href,
            'text-xs': isJapanese,
            'text-sm': !isJapanese
          }"
          @click="mobileMenuOpen = false"
        >
          <IconWrapper :name="item.icon" :size="16" :stroke="'#ffffff'" />
          <span>{{ $t(item.label) }}</span>
        </router-link>

        <button v-if="user" @click="handleLogout" class="flex items-center gap-2 py-2 hover:text-democratic-red transition">
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
    default: null
  },
  userData: {
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

<style scoped>
/* 使用 router-link-exact-active class 來標示當前路由 */
.router-link-exact-active {
  color: #D82000 !important; /* democratic-red 顏色 */
}

/* 確保圖示也會變色 */
.router-link-exact-active .icon-wrapper {
  color: #D82000 !important;
}
</style>
