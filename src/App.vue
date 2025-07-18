<template>
  <div class="min-h-screen flex flex-col">
    <Header :user="user" :userData="userData" @logout="handleLogout" @show-login="showLoginModal = true" />
    <main class="flex-grow">
      <!-- Debug info -->
      <div v-if="false" class="text-xs text-gray-500 p-2">
        Debug: user={{ user }}, userData={{ userData }}
      </div>
      <router-view
        :user="user"
        :userData="userData"
        @login-success="handleLoginSuccess"
        @logout="handleLogout"
        @profile-updated="handleProfileUpdated"
      />
    </main>
    <Footer />

    <!-- 登入模態框 -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">{{ $t('auth.loginTitle') }}</h2>
          <button @click="showLoginModal = false" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">
            ×
          </button>
        </div>

        <GoogleLogin @login-success="handleLoginSuccess" />

        <div class="mt-4 text-center">
          <button @click="showLoginModal = false" class="text-gray-500 hover:text-gray-700">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import GoogleLogin from './components/GoogleLogin.vue'
import IconWrapper from './components/IconWrapper.vue'

import { database, usersRef } from './lib/firebase'
import { ref as dbRef, get, set, update } from 'firebase/database'

const { t } = useI18n()

const user = ref(null)
const userData = ref({})
const showLoginModal = ref(false)

// 獲取用戶詳細資訊
const loadUserData = async (uid) => {
  try {
    // console.log('Loading user data for uid:', uid)
    const userSnapshot = await get(dbRef(database, `users/${uid}`))
    const data = userSnapshot.val()
    // console.log('User data from Firebase:', data)

    // 確保響應式更新
    if (data) {
      userData.value = data
      if (!userData.value.uid) {
        userData.value.uid = uid
      }
    } else {
      console.warn('No user data found in database for uid:', uid)
      userData.value = { uid }
    }

    // 強制觸發響應式更新
    await nextTick()
    // console.log('userData.value after nextTick:', userData.value)
  } catch (error) {
    console.error('Error loading user data:', error)
    userData.value = { uid }
  }
}

// 監聽登入狀態
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, async (currentUser) => {
    //console.log('Auth state changed:', currentUser)
    user.value = currentUser
    if (currentUser) {
      showLoginModal.value = false // 登入成功後關閉模態框

      // 檢查並創建用戶資料
      try {
        const userRef = dbRef(database, `users/${currentUser.uid}`)
        const userSnapshot = await get(userRef)

        if (!userSnapshot.exists()) {
          console.log('User does not exist in database, creating new user...')
          await set(userRef, {
            name: currentUser.displayName,
            email: currentUser.email,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            isAdmin: false,
            isSuperAdmin: false,
            isActive: true,
            isDeleted: false,
          })
          console.log('New user created successfully')
        }

        // 載入用戶資料
        await loadUserData(currentUser.uid)
      } catch (error) {
        console.error('Error handling user authentication:', error)
      }
    } else {
      userData.value = {}
    }
  })
})

// 處理登入成功（這個函數主要用於關閉模態框）
const handleLoginSuccess = async (firebaseUser) => {
  console.log('handleLoginSuccess called with:', firebaseUser)
  // onAuthStateChanged 會自動處理用戶創建，這裡只需要關閉模態框
  showLoginModal.value = false
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
    alert(t('auth.logoutError'))
  }
}

// 處理個人資料更新
const handleProfileUpdated = async (updatedData) => {
  if (user.value) {
    // 更新 Firebase User 對象的本地副本
    user.value = {
      ...user.value,
      ...updatedData
    }

    // 如果需要，也可以更新 userData
    userData.value = {
      ...userData.value,
      name: updatedData.displayName
    }

    // 更新 Firebase 的 userData
    const userRef = dbRef(database, `users/${user.value.uid}`)

    update(userRef, {
      name: updatedData.displayName
    }).then(() => {
      console.log('Profile updated successfully')
    }).catch((error) => {
      console.error('Error updating profile:', error)
    })

  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
