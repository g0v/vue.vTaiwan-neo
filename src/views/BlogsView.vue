<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">{{ $t('header.blogs') }}</h1>
      <div class="flex items-center space-x-4">
        <router-link
          to="/blogs/post_blog"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ $t('blog.postNewArticle') }}
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ $t('blog.loading') }}</p>
    </div>

    <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="blog in filteredBlogs"
        :key="blog.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
      >
        <!-- 樣稿標籤 -->
        <div v-if="blog.isPrototype" class="absolute -top-2 -right-2 z-10">
          <div class="bg-yellow-400 text-black text-xs font-bold px-3 py-1 transform rotate-12 shadow-md">
            {{ $t('blog.prototype') }}
          </div>
        </div>

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
              <div>{{ $t('blog.author') }}：{{ blog.author }}</div>
              <div>{{ $t('blog.publishDate') }}：{{ blog.date }}</div>
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
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { database, blogsRef } from '../lib/firebase'
import { onValue } from 'firebase/database'

const { locale } = useI18n()
const { t } = useI18n()
useHead({
  title: t('header.blogs') + ' | vTaiwan'
})

const blogs = ref([])
const loading = ref(true)

// 根據語言過濾文章
const filteredBlogs = computed(() => {
  const currentLang = locale.value

  return blogs.value.filter(blog => {
    // 如果文章沒有lang欄位，不顯示
    if (!blog.language) {
      return false
    }

    // 如果lang是all，在所有語言顯示
    if (blog.language === 'all') {
      return true
    }

    // 如果lang是zh-TW，只在中文時顯示
    if (blog.language === 'zh-TW' && currentLang === 'zh-TW') {
      return true
    }

    // 如果lang是en，只在英文時顯示
    if (blog.language === 'en' && currentLang === 'en') {
      return true
    }
    // 如果lang是ja，只在日文時顯示
    if (blog.language === 'ja' && currentLang === 'ja') {
      return true
    }

    return false
  })
})

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
    console.log('Current locale:', locale.value)
    console.log('Filtered blogs:', filteredBlogs.value)
  })
})
</script>
