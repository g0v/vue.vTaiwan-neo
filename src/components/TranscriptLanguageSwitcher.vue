<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-1 rounded-lg border border-gray-300 px-1 py-2 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <span class="text-lg">{{ currentLocaleFlag }}</span>
      <span class="text-sm font-medium">{{ currentLocaleName }}</span>
      <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="isOpen" class="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-300 bg-white shadow-lg">
      <div class="py-1">
        <button
          v-for="locale in supportedLocales"
          :key="locale.code"
          @click="switchLocale(locale.code)"
          class="flex w-full items-center space-x-3 px-4 py-2 text-left transition-colors hover:bg-gray-100"
          :class="{ 'bg-blue-50 text-blue-600': currentLocale === locale.code, 'text-democratic-red': currentLocale !== locale.code }"
        >
          <span class="text-lg">{{ locale.flag }}</span>
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

const currentLocaleFlag = computed(() => {
  const found = supportedLocales.find(l => l.code === currentLocale.value)
  return found ? found.flag : '🌐'
})

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
