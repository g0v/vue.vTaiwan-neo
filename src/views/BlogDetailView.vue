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
        <div v-html="renderedContent" class="markdown-content"></div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { database, blogsRef } from '../lib/firebase'
import { onValue } from 'firebase/database'
import { marked } from 'marked'

const route = useRoute()
const blog = ref(null)
const loading = ref(true)

// 配置 marked 選項
marked.setOptions({
  breaks: true, // 支援換行
  gfm: true, // GitHub Flavored Markdown
})

// 根據標題找到對應的文章
const findBlogByTitle = (blogs, title) => {
  return Object.entries(blogs).find(([id, blog]) => {
    const decodedTitle = decodeURIComponent(title)
    return blog.title === decodedTitle
  })
}

// 渲染 Markdown 內容
const renderedContent = computed(() => {
  if (!blog.value || !blog.value.content) return ''
  return marked(blog.value.content)
})

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

<style scoped>
.markdown-content {
  line-height: 1.6;
}

.markdown-content :deep(h1) {
  @apply text-3xl font-bold mb-4 mt-6;
}

.markdown-content :deep(h2) {
  @apply text-2xl font-bold mb-3 mt-5;
}

.markdown-content :deep(h3) {
  @apply text-xl font-bold mb-2 mt-4;
}

.markdown-content :deep(h4) {
  @apply text-lg font-bold mb-2 mt-3;
}

.markdown-content :deep(p) {
  @apply mb-4;
}

.markdown-content :deep(ul) {
  @apply list-disc list-inside mb-4;
}

.markdown-content :deep(ol) {
  @apply list-decimal list-inside mb-4;
}

.markdown-content :deep(li) {
  @apply mb-1;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic my-4;
}

.markdown-content :deep(code) {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono;
}

.markdown-content :deep(pre) {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0;
}

.markdown-content :deep(a) {
  @apply text-blue-600 hover:underline;
}

.markdown-content :deep(strong) {
  @apply font-bold;
}

.markdown-content :deep(em) {
  @apply italic;
}

.markdown-content :deep(table) {
  @apply w-full border-collapse border border-gray-300 mb-4;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  @apply border border-gray-300 px-3 py-2 text-left;
}

.markdown-content :deep(th) {
  @apply bg-gray-100 font-bold;
}
</style>
