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
      <!-- 編輯按鈕區域 -->
      <div v-if="canEdit" class="flex justify-end mb-6 space-x-3">
        <button
          v-if="!isEditing"
          @click="startEdit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          編輯文章
        </button>
        <button
          v-if="!isEditing"
          @click="showDeleteConfirm = true"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          刪除文章
        </button>
        <div v-if="isEditing" class="flex space-x-3">
          <button
            @click="saveEdit"
            :disabled="isSaving"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {{ isSaving ? '儲存中...' : '儲存' }}
          </button>
          <button
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
        </div>
      </div>

      <header class="mb-8">
        <!-- 編輯模式：標題輸入 -->
        <div v-if="isEditing" class="mb-4">
          <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-1">標題</label>
          <input
            id="edit-title"
            v-model="editForm.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <!-- 顯示模式：標題 -->
        <h1 v-else class="text-4xl font-bold mb-4">{{ blog.title }}</h1>

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

        <!-- 編輯模式：發佈日期輸入 -->
        <div v-if="isEditing" class="mb-4">
          <label for="edit-date" class="block text-sm font-medium text-gray-700 mb-1">發布日期</label>
          <input
            id="edit-date"
            v-model="editForm.date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 編輯模式：標籤輸入 -->
        <div v-if="isEditing" class="mb-6">
          <label for="edit-tags" class="block text-sm font-medium text-gray-700 mb-1">標籤（用逗號分隔）</label>
          <input
            id="edit-tags"
            v-model="editForm.tagsInput"
            type="text"
            placeholder="例如：vTaiwan, 數位民主, 開放政府"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <!-- 顯示模式：標籤 -->
        <div v-else class="flex flex-wrap gap-2 mb-6">
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
        <!-- 編輯模式：大綱輸入 -->
        <div v-if="isEditing" class="mb-8">
          <label for="edit-summary" class="block text-sm font-medium text-gray-700 mb-1">大綱</label>
          <textarea
            id="edit-summary"
            v-model="editForm.summary"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <!-- 顯示模式：大綱 -->
        <p v-else class="text-xl text-gray-700 mb-8">{{ blog.summary }}</p>

        <!-- 編輯模式：內容輸入 -->
        <div v-if="isEditing" class="mb-8">
          <label for="edit-content" class="block text-sm font-medium text-gray-700 mb-1">內容 (Markdown)</label>
          <textarea
            id="edit-content"
            v-model="editForm.content"
            rows="20"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="在此輸入 Markdown 格式的內容..."
          ></textarea>
          <!-- 預覽區域 -->
          <div class="mt-4">
            <h3 class="text-lg font-semibold mb-2">預覽</h3>
            <div v-html="previewContent" class="markdown-content border border-gray-200 rounded-md p-4 bg-gray-50"></div>
          </div>
        </div>
        <!-- 顯示模式：內容 -->
        <div v-else v-html="renderedContent" class="markdown-content"></div>
      </div>
    </article>

    <!-- 刪除確認對話框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">確認刪除</h3>
        <p class="text-gray-600 mb-6">您確定要刪除這篇文章嗎？此操作無法復原。</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="deleteBlog"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ isDeleting ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { database, blogsRef } from '../lib/firebase'
import { onValue, set, remove, ref as dbRef } from 'firebase/database'
import { marked } from 'marked'

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

console.log('BlogDetailView props received:', props)

const route = useRoute()
const router = useRouter()
const blog = ref(null)
const loading = ref(true)
const isEditing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)
let unsubscribe = null

// 編輯表單資料
const editForm = ref({
  title: '',
  summary: '',
  content: '',
  tagsInput: '',
  date: ''
})

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

// 檢查用戶是否有編輯權限
const canEdit = computed(() => {
  console.log('=== canEdit computed ===')
  console.log('props.user:', props.user)
  console.log('props.userData:', props.userData)
  console.log('blog.value:', blog.value)

  if (!props.user || !blog.value) {
    console.log('Missing user or blog, returning false')
    return false
  }

  const isAuthor = props.user.uid === blog.value.authorId
  const isAdmin = props.userData && props.userData.isAdmin === true

  console.log('isAuthor:', isAuthor, 'props.user.uid:', props.user.uid, 'blog.value.authorId:', blog.value.authorId)
  console.log('isAdmin:', isAdmin, 'props.userData.isAdmin:', props.userData?.isAdmin)

  const result = isAuthor || isAdmin
  console.log('Final result:', result)
  return result
})

// 渲染 Markdown 內容
const renderedContent = computed(() => {
  if (!blog.value || !blog.value.content) return ''
  return marked(blog.value.content)
})

// 預覽內容
const previewContent = computed(() => {
  if (!editForm.value.content) return ''
  return marked(editForm.value.content)
})

// 開始編輯
const startEdit = () => {
  editForm.value = {
    title: blog.value.title,
    summary: blog.value.summary,
    content: blog.value.content,
    tagsInput: (blog.value.tags || []).join(', '),
    date: blog.value.date
  }
  isEditing.value = true
}

// 取消編輯
const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {
    title: '',
    summary: '',
    content: '',
    tagsInput: '',
    date: ''
  }
}

// 儲存編輯
const saveEdit = async () => {
  if (!blog.value) return

  try {
    isSaving.value = true

    const updatedBlog = {
      ...blog.value,
      title: editForm.value.title,
      summary: editForm.value.summary,
      content: editForm.value.content,
      tags: editForm.value.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: editForm.value.date
    }

    set(dbRef(database, `blogs/${blog.value.id}`), updatedBlog).then(() => {
      console.log('Blog updated successfully')

      isEditing.value = false

      console.log('editForm.value.title', editForm.value.title)
      console.log('blog.value.title', blog.value ? blog.value.title : 'null')
      // 如果標題有變更，更新路由
      if (!blog.value || blog.value.title !== editForm.value.title) {
        console.log('blog.value.title !== editForm.value.title')
        const newTitle = encodeURIComponent(editForm.value.title)
        const newPath = `/blogs/${newTitle}`

        // 更新路由，這會自動觸發路由監聽器重新載入資料
        router.replace(newPath)
      }
    }).catch((error) => {
      console.error('Error updating blog:', error)
    })
  } catch (error) {
    console.error('Error saving blog:', error)
    alert('儲存時發生錯誤，請稍後再試')
  } finally {
    isSaving.value = false
  }
}

// 刪除部落格
const deleteBlog = async () => {
  if (!blog.value) return

  try {
    isDeleting.value = true
    await remove(dbRef(database, `blogs/${blog.value.id}`))
    showDeleteConfirm.value = false
    router.push('/blogs')
  } catch (error) {
    console.error('Error deleting blog:', error)
    alert('刪除時發生錯誤，請稍後再試')
  } finally {
    isDeleting.value = false
  }
}

const loadBlog = () => {
  // 取消之前的監聽器
  if (unsubscribe) {
    unsubscribe()
  }

  loading.value = true
  const title = route.params.title

  unsubscribe = onValue(blogsRef, (snapshot) => {
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

// 組件卸載時清理監聽器
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
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
