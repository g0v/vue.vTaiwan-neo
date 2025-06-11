<template>
  <div>
    <button
      v-if="!user"
      @click="handleGoogleLogin"
      class="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
      :disabled="isLoading"
    >
      <span class="mr-2">🔑</span>
      {{ isLoading ? '登入中...' : '使用 Google 登入' }}
    </button>
    <div v-else class="flex items-center space-x-4">
      <span class="text-gray-700">歡迎，{{ user.displayName }}</span>
      <button
        @click="handleLogout"
        class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
      >
        登出
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, database, usersRef } from '../lib/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { set, ref as dbRef } from 'firebase/database'

const user = ref(null)
const isLoading = ref(false)

// 監聽登入狀態
onMounted(() => {
  console.log('Setting up auth state listener')
  onAuthStateChanged(auth, async (currentUser) => {
    console.log('Auth state changed:', currentUser)
    user.value = currentUser
  })
})

// Google 登入
const handleGoogleLogin = async () => {
  try {
    console.log('Starting Google login...')
    isLoading.value = true
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    console.log('Google login successful:', result.user)

    // 將用戶資料寫入 usersRef
    const userData = {
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      lastLogin: new Date().toISOString()
    }

    console.log('Saving user data:', userData)
    await set(dbRef(database, `users/${result.user.uid}`), userData)
    console.log('User data saved successfully')
  } catch (error) {
    console.error('Google login error:', error)
    alert('登入時發生錯誤，請稍後再試')
  } finally {
    isLoading.value = false
  }
}

// 登出
const handleLogout = async () => {
  try {
    console.log('Logging out...')
    await signOut(auth)
    console.log('Logout successful')
  } catch (error) {
    console.error('Logout error:', error)
    alert('登出時發生錯誤，請稍後再試')
  }
}
</script>
