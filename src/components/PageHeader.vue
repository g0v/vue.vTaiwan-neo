<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    title: string
    description?: string
    dark?: boolean
    centered?: boolean
    compact?: boolean
  }>(),
  {
    description: '',
    dark: false,
    centered: false,
    compact: false,
  }
)
</script>

<template>
  <header :class="[dark ? 'vt-hero-bg text-vt-fg-inverse' : '', dark ? (compact ? 'px-4 py-14 sm:px-6 sm:py-16' : 'px-4 py-16 sm:px-6 sm:py-20') : '', centered ? 'text-center' : '']">
    <div :class="dark ? 'relative z-1 mx-auto max-w-5xl' : ''">
      <p class="vt-section-label" :class="dark ? 'text-white/55' : ''">{{ label }}</p>
      <h1 class="m-0 font-serif text-4xl leading-tight font-bold tracking-[-0.02em] sm:text-5xl" :class="compact ? 'sm:text-4xl' : ''">
        <slot>{{ title }}</slot>
      </h1>
      <p v-if="description" class="mt-4 text-base leading-7" :class="[dark ? 'max-w-2xl text-white/72' : 'text-vt-gray-700 max-w-3xl', centered ? 'mx-auto' : '']">
        {{ description }}
      </p>
      <slot name="actions" />
    </div>
  </header>
</template>
