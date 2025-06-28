<template>
  <div class="text-center">
    <button
      @click="handleGoogleLogin"
      :disabled="loading"
      class="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-democratic-red disabled:opacity-50"
    >
      <img
        v-if="!loading"
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        class="w-5 h-5 mr-2"
      />
      <span v-if="loading" class="animate-spin mr-2">⏳</span>
      {{ loading ? $t('auth.loggingIn') : $t('auth.loginWithGoogle') }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loading = ref(false)

// 發送登入成功事件
const emit = defineEmits(['login-success'])

const handleGoogleLogin = async () => {
  try {
    loading.value = true
    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // 發送登入成功事件給父組件
    emit('login-success', user)

    console.log('Google login successful:', user)
  } catch (error) {
    console.error('Google login error:', error)
    alert(t('auth.loginFailed'))
  } finally {
    loading.value = false
  }
}
</script>
