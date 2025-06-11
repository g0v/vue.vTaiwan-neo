<template>
  <component
    :is="iconComponent"
    :size="size"
    :color="iconColor"
    :class="props.class"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
  size?: number
  color?: string
  type?: 'default' | 'primary' | 'teal' | 'amber'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  type: 'default',
  class: ''
})

const colorMap = {
  default: '#000000',
  primary: '#D80000',
  teal: '#008888',
  amber: '#DB7700'
}

const iconColor = computed(() => props.color || colorMap[props.type])

const iconComponent = computed(() => {
  const iconName = props.name.charAt(0).toUpperCase() + props.name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  return LucideIcons[iconName as keyof typeof LucideIcons] || null
})
</script>
