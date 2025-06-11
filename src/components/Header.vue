<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <router-link to="/" class="text-2xl font-bold text-black">
          vTaiwan
        </router-link>

        <nav class="hidden md:flex space-x-8">
          <router-link to="/" class="text-gray-700 hover:text-democratic-red transition">
            首頁
          </router-link>
          <router-link to="/blogs" class="text-gray-700 hover:text-democratic-red transition">
            部落格
          </router-link>
          <router-link to="/blogs/post_blog" class="text-gray-700 hover:text-democratic-red transition">
            發布文章
          </router-link>
        </nav>

        <div class="flex items-center space-x-4">
          <GoogleLogin />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import GoogleLogin from './GoogleLogin.vue'
</script>
