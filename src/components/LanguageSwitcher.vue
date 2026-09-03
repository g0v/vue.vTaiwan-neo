<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales, setLocale, type SupportedLocale } from '../i18n'
import IconWrapper from './IconWrapper.vue'

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
      class="text-vt-gray-700 hover:bg-vt-gray-100 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors"
      :class="block ? 'bg-vt-bg-2 w-full justify-center py-3' : ''"
      @click="isOpen = !isOpen"
    >
      <IconWrapper name="globe" :size="14" class="opacity-70" />
      <span>{{ current.name }}</span>
      <IconWrapper name="chevron-down" :size="12" :class="isOpen ? 'rotate-180 opacity-50 transition-transform' : 'opacity-50 transition-transform'" />
    </button>

    <div
      v-if="isOpen"
      class="border-vt-border bg-vt-bg-1 shadow-vt-lg absolute right-0 z-50 w-44 overflow-hidden rounded-xl border py-1"
      :class="[block ? 'left-0' : '', dropUp ? 'bottom-full mb-2' : 'top-full mt-2']"
    >
      <button
        v-for="item in supportedLocales"
        :key="item.code"
        type="button"
        class="hover:bg-vt-gray-100 flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
        :class="currentCode === item.code ? 'text-democratic-red font-semibold' : 'text-vt-gray-800'"
        @click="choose(item.code)"
      >
        <span class="bg-vt-bg-2 text-vt-gray-700 inline-flex min-w-8 justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold">{{
          item.code === 'zh-TW' ? 'ZH' : item.code.toUpperCase()
        }}</span>
        <span>{{ item.name }}</span>
        <IconWrapper v-if="currentCode === item.code" name="check" :size="15" class="ml-auto" />
      </button>
    </div>
  </div>
</template>
