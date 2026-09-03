<template>
  <div class="relative">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="border-vt-border hover:border-democratic-red/30 focus-visible:outline-democratic-red flex items-center gap-2 rounded-full border px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span class="bg-vt-bg-2 text-vt-gray-700 inline-flex min-w-8 justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold">{{ currentLocaleCode }}</span>
      <span class="text-sm font-medium">{{ currentLocaleName }}</span>
      <IconWrapper name="chevron-down" :size="14" :class="isOpen ? 'rotate-180 transition-transform' : 'transition-transform'" />
    </button>

    <div v-if="isOpen" class="border-vt-border absolute right-0 z-50 mt-2 w-48 rounded-2xl border bg-white p-1 shadow-lg">
      <div class="py-1">
        <button
          v-for="locale in supportedLocales"
          :key="locale.code"
          type="button"
          @click="switchLocale(locale.code)"
          class="hover:bg-vt-bg-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors"
          :class="currentLocale === locale.code ? 'bg-vt-red-tint text-democratic-red' : 'text-vt-gray-700'"
        >
          <span class="bg-vt-bg-2 inline-flex min-w-8 justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold">{{
            locale.code === 'zh-TW' ? 'ZH' : locale.code.toUpperCase()
          }}</span>
          <span class="text-sm">{{ locale.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales, getCurrentLocale, type SupportedLocale } from '../i18n'
import IconWrapper from './IconWrapper.vue'

const props = defineProps<{
  modelValue: SupportedLocale
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SupportedLocale]
}>()

const { locale } = useI18n()
const isOpen = ref(false)

const currentLocale = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const currentLocaleCode = computed(() => (currentLocale.value === 'zh-TW' ? 'ZH' : currentLocale.value.toUpperCase()))

const currentLocaleName = computed(() => {
  const found = supportedLocales.find(l => l.code === currentLocale.value)
  return found ? found.name : 'Unknown'
})

const switchLocale = (newLocale: SupportedLocale) => {
  currentLocale.value = newLocale
  isOpen.value = false
}

// 點擊外部關閉下拉選單
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
