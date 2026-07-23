<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

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

const emit = defineEmits(['logout', 'show-login'])

const route = useRoute()
const { t, locale } = useI18n()
const mobileOpen = ref(false)

const links = [
  { key: 'home', labelKey: 'header.home', href: '/' },
  { key: 'topics', labelKey: 'header.topics', href: '/topics' },
  { key: 'meetups', labelKey: 'header.meetups', href: '/meetups' },
  { key: 'blogs', labelKey: 'header.blogs', href: '/blogs' },
  { key: 'newsletters', labelKey: 'header.newsletters', href: '/newsletters' },
  { key: 'mastodon', labelKey: 'header.mastodon', href: '/mastodon' },
  { key: 'faq', labelKey: 'header.faq', href: '/faq' },
  { key: 'about', labelKey: 'header.about', href: '/intro' },
  { key: 'contributors', labelKey: 'header.contributors', href: '/contributors' },
]

const activeKey = computed(() => {
  const path = route.path

  if (path === '/') return 'home'

  const map = [
    { prefix: '/topics', key: 'topics' },
    { prefix: '/meetups', key: 'meetups' },
    { prefix: '/blogs', key: 'blogs' },
    { prefix: '/newsletters', key: 'newsletters' },
    { prefix: '/mastodon', key: 'mastodon' },
    { prefix: '/faq', key: 'faq' },
    { prefix: '/intro', key: 'about' },
    { prefix: '/about', key: 'about' },
    { prefix: '/contributors', key: 'contributors' },
  ]

  return map.find(item => path.startsWith(item.prefix))?.key ?? ''
})

const isJapanese = computed(() => locale.value === 'ja')
const isChinese = computed(() => locale.value.includes('zh'))
const isEnglish = computed(() => locale.value.includes('en'))

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  }
)

const handleLogout = () => {
  emit('logout')
  mobileOpen.value = false
}

const handleShowLogin = () => {
  emit('show-login')
  mobileOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-999 px-3 pt-3 font-sans sm:px-6 sm:pt-4">
    <div class="vt-glass relative z-20 mx-auto flex h-[72px] max-w-6xl items-center justify-between rounded-2xl pr-3 pl-6" :class="{ 'max-w-7xl': !isChinese }">
      <router-link to="/" class="flex shrink-0 items-center" :aria-label="t('header.home')" @click="mobileOpen = false">
        <img src="@/assets/images/vtaiwan-logo.svg" alt="vTaiwan" class="h-7 w-auto" />
      </router-link>

      <!-- 桌面導覽 -->
      <nav class="hidden items-center gap-0.5 xl:flex" :class="{ 'text-xs': isJapanese, 'text-md': isChinese, 'text-sm': isEnglish }">
        <router-link
          v-for="l in links"
          :key="l.key"
          :to="l.href"
          class="hover:bg-vt-gray-100 relative rounded-full px-3.5 py-2 whitespace-nowrap transition-colors"
          :class="activeKey === l.key ? 'text-democratic-red' : 'text-vt-gray-800'"
        >
          {{ t(l.labelKey) }}
          <span v-if="activeKey === l.key" class="bg-democratic-red absolute -bottom-px left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full" />
        </router-link>
      </nav>

      <div class="flex items-center gap-2.5 text-[13px]">
        <LanguageSwitcher />
        <span class="bg-vt-border hidden h-5 w-px sm:block" />

        <!-- 登入狀態：已登入顯示個人資料 -->
        <router-link v-if="user" to="/profile" class="hover:bg-vt-gray-100 hidden items-center gap-2 rounded-full px-2 py-1 transition-colors sm:inline-flex" :title="t('common.profile')">
          <img v-if="userData && userData.photoURL" :src="userData.photoURL" :alt="userData.name" class="ring-vt-border h-8 w-8 rounded-full ring-1" />
          <div v-else class="bg-vt-gray-200 text-vt-gray-700 flex h-8 w-8 items-center justify-center rounded-full">
            <span class="text-xs">👤</span>
          </div>
          <span v-if="userData && userData.name" class="text-vt-gray-800 hidden max-w-24 truncate text-sm xl:block">{{ userData.name }}</span>
        </router-link>

        <!-- 未登入顯示登入按鈕 -->
        <button
          v-else
          type="button"
          class="bg-ink text-vt-fg-inverse hover:bg-democratic-red hidden cursor-pointer rounded-full px-4 py-2 font-medium whitespace-nowrap transition-colors sm:inline-flex"
          @click="handleShowLogin"
        >
          {{ t('common.login') }}
        </button>

        <!-- 行動裝置漢堡按鈕 -->
        <button
          type="button"
          class="text-ink hover:bg-vt-gray-100 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors xl:hidden"
          :aria-expanded="mobileOpen"
          :aria-label="t('header.openMenu')"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 行動選單面板 -->
    <div v-if="mobileOpen" class="absolute left-0 w-full px-3 sm:px-6 xl:hidden">
      <div class="vt-glass relative z-10 mx-auto mt-2 max-w-6xl rounded-2xl p-2.5">
        <router-link
          v-for="l in links"
          :key="l.key"
          :to="l.href"
          class="hover:bg-vt-gray-100 flex items-center justify-between rounded-xl px-3.5 py-1.5 transition-colors"
          :class="activeKey === l.key ? 'text-democratic-red' : 'text-vt-gray-800'"
          @click="mobileOpen = false"
        >
          {{ t(l.labelKey) }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="opacity-40">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </router-link>

        <button v-if="user" type="button" class="text-vt-gray-800 hover:bg-vt-gray-100 flex w-full items-center gap-2 rounded-xl px-3.5 py-1.5 transition-colors" @click="handleLogout">
          {{ t('common.logout') }}
        </button>

        <div class="bg-vt-border my-1.5 h-px" />
        <div class="flex gap-2 px-1.5 pt-2 pb-1.5">
          <LanguageSwitcher block drop-up class="flex-1" />
          <router-link
            v-if="user"
            to="/profile"
            class="bg-vt-bg-2 text-vt-gray-800 hover:bg-vt-gray-100 inline-flex flex-1 items-center justify-center rounded-full px-3 py-3 transition-colors"
            :class="{ 'text-xs': isJapanese, 'text-md': isChinese, 'text-sm': isEnglish }"
            @click="mobileOpen = false"
          >
            {{ t('common.profile') }}
          </router-link>
          <button
            v-else
            type="button"
            class="bg-ink text-vt-fg-inverse hover:bg-democratic-red inline-flex flex-1 cursor-pointer items-center justify-center rounded-full px-3 py-3 transition-colors"
            :class="{ 'text-xs': isJapanese, 'text-md': isChinese, 'text-sm': isEnglish }"
            @click="handleShowLogin"
          >
            {{ t('common.login') }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
