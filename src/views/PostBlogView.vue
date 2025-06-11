<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="!user" class="text-center py-8">
      <p class="text-gray-600 mb-4">請先登入才能發布文章</p>
      <GoogleLogin />
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6 bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center space-x-4">
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            :alt="user.displayName"
            class="w-10 h-10 rounded-full"
          />
          <div>
            <p class="font-medium text-gray-900">{{ user.displayName }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          登出
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6 bg-white rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold mb-8">發布新文章</h1>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">標題</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">發布日期</label>
          <input
            type="date"
            id="date"
            v-model="formData.date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="summary" class="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea
            id="summary"
            v-model="formData.summary"
            required
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">內容</label>
          <textarea
            id="content"
            v-model="formData.content"
            required
            rows="10"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">標籤（用逗號分隔）</label>
          <input
            type="text"
            id="tags"
            v-model="formData.tagsInput"
            placeholder="例如：vTaiwan, 數位民主, 開放政府"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600">
            發布者：{{ user.displayName }}
          </div>
          <div class="flex space-x-4">
            <button
              type="button"
              @click="$router.push('/blogs')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? '發布中...' : '發布文章' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, database, blogsRef } from '../lib/firebase'
import { get, set, ref as dbRef } from 'firebase/database'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import GoogleLogin from '../components/GoogleLogin.vue'

const router = useRouter()
const user = ref(null)
const isSubmitting = ref(false)

const formData = reactive({
  title: '',
  date: new Date().toISOString().split('T')[0],
  summary: '',
  content: '',
  tagsInput: ''
})

// 監聽登入狀態
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})

// 獲取當前最大的 index
const getNextIndex = async () => {
  const snapshot = await get(blogsRef)
  const blogs = snapshot.val() || {}
  const indexes = Object.keys(blogs).map(Number)
  return indexes.length > 0 ? Math.max(...indexes) + 1 : 0
}

// 登出功能
const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/blogs')
  } catch (error) {
    console.error('Logout error:', error)
    alert('登出時發生錯誤，請稍後再試')
  }
}

const handleSubmit = async () => {
  if (!user.value) {
    alert('請先登入才能發布文章')
    return
  }

  try {
    isSubmitting.value = true
    const nextIndex = await getNextIndex()

    const newBlog = {
      title: formData.title,
      author: user.value.displayName,
      authorId: user.value.uid,
      authorPhotoURL: user.value.photoURL,
      date: formData.date,
      summary: formData.summary,
      content: formData.content,
      tags: formData.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    await set(dbRef(database, `blogs/${nextIndex}`), newBlog)
    router.push('/blogs')
  } catch (error) {
    console.error('Error posting blog:', error)
    alert('發布文章時發生錯誤，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>
