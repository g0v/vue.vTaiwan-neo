<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">載入中...</p>
    </div>

    <div v-else-if="!blog" class="text-center py-8">
      <p class="text-gray-600">找不到這篇文章</p>
      <router-link to="/blogs" class="text-blue-600 hover:underline">返回部落格列表</router-link>
    </div>

    <article v-else class="bg-white rounded-lg shadow-md p-8">
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ blog.title }}</h1>
        <div class="flex items-center space-x-3 mb-4">
          <img
            v-if="blog.authorPhotoURL"
            :src="blog.authorPhotoURL"
            :alt="blog.author"
            class="w-10 h-10 rounded-full"
          />
          <div class="text-gray-600">
            <span class="mr-4">作者：{{ blog.author }}</span>
            <span>發布日期：{{ blog.date }}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in blog.tags"
            :key="tag"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <div class="prose prose-lg max-w-none">
        <p class="text-xl text-gray-700 mb-8">{{ blog.summary }}</p>
        <div class="whitespace-pre-line">{{ blog.content }}</div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { database, blogsRef } from '../lib/firebase'
import { onValue } from 'firebase/database'

const route = useRoute()
const blog = ref(null)
const loading = ref(true)

// 根據標題找到對應的文章
const findBlogByTitle = (blogs, title) => {
  return Object.entries(blogs).find(([id, blog]) => {
    const decodedTitle = decodeURIComponent(title)
    return blog.title === decodedTitle
  })
}

const loadBlog = () => {
  loading.value = true
  const title = route.params.title

  onValue(blogsRef, (snapshot) => {
    const blogs = snapshot.val()
    if (blogs) {
      const found = findBlogByTitle(blogs, title)
      if (found) {
        const [id, blogData] = found
        blog.value = { id, ...blogData }
        console.log('Found blog:', blog.value)
      } else {
        console.log('Blog not found for title:', title)
        blog.value = null
      }
    } else {
      console.log('No blogs found')
      blog.value = null
    }
    loading.value = false
  })
}

onMounted(() => {
  loadBlog()
})

// 監聽路由變化
watch(() => route.params.title, () => {
  loadBlog()
})
</script>
