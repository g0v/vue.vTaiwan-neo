<template>
  <component :is="iconComponent" :size="size" :color="iconColor" :class="props.class" />
</template>

<script setup>
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 24 },
  color: { type: String, default: '' },
  type: { type: String, default: 'default' },
  class: { type: String, default: '' },
})

const colorMap = {
  default: 'currentColor',
  primary: 'var(--color-vt-democratic-red)',
  teal: 'var(--color-vt-jade-green)',
  amber: 'var(--color-vt-wheat-yellow)',
}

const iconColor = computed(() => props.color || colorMap[props.type])

const iconComponent = computed(() => {
  const iconName = props.name.charAt(0).toUpperCase() + props.name.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase())
  return LucideIcons[iconName] || null
})
</script>
