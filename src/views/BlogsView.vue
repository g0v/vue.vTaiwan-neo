<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">vTaiwan 部落格</h1>
      <div class="flex items-center space-x-4">
        <router-link
          to="/blogs/post_blog"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          發布新文章
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">載入中...</p>
    </div>

    <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="blog in blogs"
        :key="blog.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-2">
            <router-link :to="`/blogs/${encodeURIComponent(blog.title)}`" class="hover:text-blue-600">
              {{ blog.title }}
            </router-link>
          </h2>
          <div class="flex items-center space-x-3 mb-4">
            <img
              v-if="blog.authorPhotoURL"
              :src="blog.authorPhotoURL"
              :alt="blog.author"
              class="w-8 h-8 rounded-full"
            />
            <div class="text-sm text-gray-600">
              <div>作者：{{ blog.author }}</div>
              <div>發布日期：{{ blog.date }}</div>
            </div>
          </div>
          <p class="text-gray-700 mb-4">{{ blog.summary }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in blog.tags"
              :key="tag"
              class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { database, blogsRef } from '../lib/firebase'
import { onValue } from 'firebase/database'

const blogs = ref([])
const loading = ref(true)

onMounted(() => {
  console.log('Setting up blogs listener')
  onValue(blogsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      // 將物件轉換為陣列，並加入 id
      blogs.value = Object.entries(data).map(([id, blog]) => ({
        id,
        ...blog
      })).sort((a, b) => new Date(b.date) - new Date(a.date))
    } else {
      blogs.value = []
    }
    loading.value = false
    console.log('Blogs updated:', blogs.value)
  })
})
</script>
