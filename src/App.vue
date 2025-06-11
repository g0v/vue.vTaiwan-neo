<template>
  <div class="min-h-screen flex flex-col">
    <Header :user="user" @logout="handleLogout" @show-login="showLoginModal = true" />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer />

    <!-- 登入模態框 -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">登入</h2>
          <button @click="showLoginModal = false" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">
            ×
          </button>
        </div>

        <GoogleLogin @login-success="handleLoginSuccess" />

        <div class="mt-4 text-center">
          <button @click="showLoginModal = false" class="text-gray-500 hover:text-gray-700">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import GoogleLogin from './components/GoogleLogin.vue'
import IconWrapper from './components/IconWrapper.vue'

const user = ref(null)
const showLoginModal = ref(false)

// 監聽登入狀態
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    if (currentUser) {
      showLoginModal.value = false // 登入成功後關閉模態框
    }
  })
})

// 處理登入成功
const handleLoginSuccess = (userData) => {
  user.value = userData
  showLoginModal.value = false
}

// 處理登出
const handleLogout = async () => {
  try {
    const auth = getAuth()
    await signOut(auth)
    user.value = null
  } catch (error) {
    console.error('Logout error:', error)
    alert('登出時發生錯誤，請稍後再試')
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
