<template>
  <div class="min-h-screen flex flex-col">
    <Header :user="user" @logout="handleLogout" @show-login="showLoginModal = true" />
    <main class="flex-grow">
      <!-- Debug info -->
      <div v-if="false" class="text-xs text-gray-500 p-2">
        Debug: user={{ user }}, userData={{ userData }}
      </div>
      <router-view :user="user" :userData="userData" />
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
import { ref, onMounted, nextTick } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import GoogleLogin from './components/GoogleLogin.vue'
import IconWrapper from './components/IconWrapper.vue'

import { database, usersRef } from './lib/firebase'
import { ref as dbRef, get, set, update } from 'firebase/database'

const user = ref(null)
const userData = ref(null)
const showLoginModal = ref(false)

// 獲取用戶詳細資訊
const loadUserData = async (uid) => {
  try {
    console.log('Loading user data for uid:', uid)
    const userSnapshot = await get(dbRef(database, `users/${uid}`))
    const data = userSnapshot.val()
    console.log('User data from Firebase:', data)

    // 確保響應式更新
    userData.value = data
    console.log('userData.value after setting:', userData.value)

    // 強制觸發響應式更新
    await nextTick()
    console.log('userData.value after nextTick:', userData.value)
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

// 監聽登入狀態
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    if (currentUser) {
      showLoginModal.value = false // 登入成功後關閉模態框
      loadUserData(currentUser.uid)
    } else {
      userData.value = null
    }
  })
})

// 處理登入成功
const handleLoginSuccess = async (userData) => {
  user.value = userData
  showLoginModal.value = false

  // 如果Firebase Realtime Database中沒有這個使用者，則新增使用者
  const userRef = dbRef(usersRef, userData.uid)
  const userDoc = await get(userRef)
  if (!userDoc.exists()) {
    set(userRef, {
      name: userData.displayName,
      email: userData.email,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoURL: userData.photoURL,
      uid: userData.uid,
      isAdmin: false,
      isSuperAdmin: false,
      isActive: true,
      isDeleted: false,
    }).then(() => {
      console.log('User added to database')
      loadUserData(userData.uid)
    }).catch((error) => {
      console.error('Error adding user to database:', error)
    })
  } else {
    loadUserData(userData.uid)
  }
}

// 處理登出
const handleLogout = async () => {
  try {
    const auth = getAuth()
    await signOut(auth)
    user.value = null
    userData.value = null
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
