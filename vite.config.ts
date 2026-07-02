import { fileURLToPath, URL } from 'node:url'

// 用 vitest/config 的 defineConfig：同時涵蓋 Vite 與 Vitest 的設定型別
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  test: {
    // 元件測試用 jsdom 提供 DOM 環境；globals 讓 describe/it/expect 免 import
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{ts,js}'],
  },
})
