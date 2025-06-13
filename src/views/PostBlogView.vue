<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="!user" class="text-center py-8">
      <p class="text-gray-600 mb-4">{{ $t('blog.loginRequired') }}</p>
      <GoogleLogin @login-success="handleLoginSuccess" />
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6 bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center space-x-4">
          <img
            v-if="props.user.photoURL"
            :src="props.user.photoURL"
            :alt="props.user.displayName"
            class="w-10 h-10 rounded-full"
          />
          <div>
            <p class="font-medium text-gray-900">{{ props.user.displayName }}</p>
            <p class="text-sm text-gray-500">{{ props.user.email }}</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6 bg-white rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold mb-8">{{ $t('blog.postNewArticle') }}</h1>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('blog.title') }}</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('blog.publishDate') }}</label>
          <input
            type="date"
            id="date"
            v-model="formData.date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="summary" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('blog.summary') }}</label>
          <textarea
            id="summary"
            v-model="formData.summary"
            required
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('blog.content') }}</label>
          <textarea
            id="content"
            v-model="formData.content"
            required
            rows="10"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('blog.tags') }}</label>
          <input
            type="text"
            id="tags"
            v-model="formData.tagsInput"
            :placeholder="$t('blog.tagsPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600">
            {{ $t('blog.publisher') }}：{{ props.user.displayName }}
          </div>
          <div class="flex space-x-4">
            <button
              type="button"
              @click="$router.push('/blogs')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? $t('blog.posting') : $t('blog.postArticle') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { database, blogsRef } from '../lib/firebase'
import { get, set, ref as dbRef } from 'firebase/database'
import GoogleLogin from '../components/GoogleLogin.vue'

const { t } = useI18n()

// 定義 props
const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  userData: {
    type: Object,
    default: null
  }
})

const router = useRouter()
const isSubmitting = ref(false)

const formData = reactive({
  title: '',
  date: new Date().toISOString().split('T')[0],
  summary: '',
  content: '',
  tagsInput: ''
})

// 生成唯一的 key：date + title
const generateBlogKey = (date, title) => {
  // 移除標題中的特殊字符，只保留字母、數字、空格和連字符
  const cleanTitle = encodeURIComponent(title).replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase()
  return `${date}_${cleanTitle}`
}

const handleLoginSuccess = (userData) => {
  emit('login-success', userData)
}

const handleSubmit = async () => {
  if (!props.user) {
    alert(t('blog.loginRequired'))
    return
  }

  try {
    isSubmitting.value = true

    // 檢查是否已存在相同標題的文章
    const snapshot = await get(blogsRef)
    const blogs = snapshot.val() || {}

    // 檢查是否有重複的標題
    const existingBlog = Object.values(blogs).find(blog => blog.title === formData.title)
    if (existingBlog) {
      alert('已存在相同標題的文章，請使用不同的標題')
      return
    }

    const blogKey = generateBlogKey(formData.date, formData.title)

    const newBlog = {
      id: blogKey,
      title: formData.title,
      author: props.user.displayName,
      authorId: props.user.uid,
      authorPhotoURL: props.user.photoURL,
      date: formData.date,
      summary: formData.summary,
      content: formData.content,
      tags: formData.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    await set(dbRef(database, `blogs/${blogKey}`), newBlog)
    router.push('/blogs')
  } catch (error) {
    console.error('Error posting blog:', error)
    alert(t('blog.postError'))
  } finally {
    isSubmitting.value = false
  }
}
</script>
