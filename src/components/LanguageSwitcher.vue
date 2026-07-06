<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales, setLocale, type SupportedLocale } from '../i18n'

// block：是否為區塊（整寬）樣式，用於行動選單
// dropUp：下拉選單是否往上展開，避免在漢堡選單中往下溢出版面
const props = defineProps<{ block?: boolean; dropUp?: boolean }>()

const { locale } = useI18n()
const isOpen = ref(false)

const currentCode = computed(() => locale.value as SupportedLocale)
const current = computed(() => supportedLocales.find(l => l.code === currentCode.value) ?? supportedLocales[0])

const choose = (code: SupportedLocale) => {
  setLocale(code)
  isOpen.value = false
}

// 點擊外部關閉下拉選單
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('[data-lang-switcher]')) isOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div data-lang-switcher class="relative" :class="block ? 'w-full' : ''">
    <button
      type="button"
      :aria-expanded="isOpen"
      class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-vt-gray-700 transition-colors hover:bg-vt-gray-100"
      :class="block ? 'w-full justify-center bg-vt-bg-2 py-3' : ''"
      @click="isOpen = !isOpen"
    >
      <svg class="opacity-70" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"></path></svg>
      <span>{{ current.name }}</span>
      <svg
        class="opacity-50 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-50 w-44 overflow-hidden rounded-xl border border-vt-border bg-vt-bg-1 py-1 shadow-vt-lg"
      :class="[block ? 'left-0' : '', dropUp ? 'bottom-full mb-2' : 'top-full mt-2']"
    >
      <button
        v-for="item in supportedLocales"
        :key="item.code"
        type="button"
        class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-vt-gray-100"
        :class="currentCode === item.code ? 'font-semibold text-democratic-red' : 'text-vt-gray-800'"
        @click="choose(item.code)"
      >
        <span class="text-base">{{ item.flag }}</span>
        <span>{{ item.name }}</span>
        <svg
          v-if="currentCode === item.code"
          class="ml-auto"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </button>
    </div>
  </div>
</template>
