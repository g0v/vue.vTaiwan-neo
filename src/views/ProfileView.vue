<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ $t('profile.title') }}</h1>

      <!-- 登入狀態檢查 -->
      <div v-if="!user" class="text-center py-8">
        <p class="text-gray-600 mb-4">{{ $t('profile.loginRequired') }}</p>
        <GoogleLogin @login-success="$emit('login-success', $event)" />
      </div>

      <!-- 個人資料顯示模式 -->
      <div v-else-if="!editing" class="space-y-6">
        <div class="flex items-center space-x-4 mb-6">
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            :alt="user.displayName || '用戶頭像'"
            class="w-16 h-16 rounded-full"
          />
          <div v-else class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span class="text-gray-600 text-xl">👤</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ user.displayName || '未設定姓名' }}</h2>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>

        <!-- 用戶資料顯示 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('profile.name') }}</label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800">
              {{ user.displayName || '未設定' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('profile.email') }}</label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800">
              {{ user.email }}
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">用戶ID</label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 font-mono text-sm">
              {{ user.uid }}
            </div>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex space-x-4 pt-6">
          <button
            @click="startEdit"
            class="px-6 py-2 bg-democratic-red text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-democratic-red"
          >
            {{ $t('common.edit') }}
          </button>
          <button
            @click="$emit('logout')"
            class="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {{ $t('common.logout') }}
          </button>
        </div>
      </div>

      <!-- 個人資料編輯模式 -->
      <div v-else class="space-y-6">
        <div class="flex items-center space-x-4 mb-6">
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            :alt="editForm.displayName || '用戶頭像'"
            class="w-16 h-16 rounded-full"
          />
          <div v-else class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span class="text-gray-600 text-xl">👤</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800">編輯個人資料</h2>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <!-- 姓名欄位 (可編輯) -->
          <div>
            <label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('profile.name') }}
              <span class="text-red-500">*</span>
            </label>
            <input
              id="displayName"
              v-model="editForm.displayName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-democratic-red focus:border-democratic-red"
              placeholder="請輸入您的姓名"
            />
          </div>

          <!-- Email 欄位 (僅顯示，不可編輯) -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('profile.email') }}
            </label>
            <input
              id="email"
              :value="user.email"
              type="email"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p class="text-xs text-gray-500 mt-1">Email 無法編輯</p>
          </div>

          <!-- UID 欄位 (僅顯示，不可編輯) -->
          <div>
            <label for="uid" class="block text-sm font-medium text-gray-700 mb-2">
              用戶ID
            </label>
            <input
              id="uid"
              :value="user.uid"
              type="text"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed font-mono text-sm"
            />
            <p class="text-xs text-gray-500 mt-1">用戶ID 無法編輯</p>
          </div>

          <!-- 提交按鈕 -->
          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              :disabled="updating || !hasChanges"
              class="px-6 py-2 bg-democratic-red text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-democratic-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ updating ? '更新中...' : $t('common.save') }}
            </button>

            <button
              type="button"
              @click="cancelEdit"
              :disabled="updating"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {{ $t('common.cancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import GoogleLogin from '../components/GoogleLogin.vue'

const { t } = useI18n()

// Props
const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  userData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['login-success', 'logout', 'profile-updated'])

// 響應式數據
const editing = ref(false)
const updating = ref(false)

// 編輯表單數據 (副本)
const editForm = reactive({
  displayName: ''
})

// 計算屬性
const hasChanges = computed(() => {
  if (!props.user) return false
  return editForm.displayName !== (props.user.displayName || '')
})

// 監聽用戶變化，更新編輯表單
watch(() => props.user, (newUser) => {
  if (newUser) {
    editForm.displayName = newUser.displayName || ''
  } else {
    editForm.displayName = ''
  }
}, { immediate: true })

// 開始編輯
const startEdit = () => {
  if (!props.user) return
  editing.value = true
  editForm.displayName = props.user.displayName || ''
}

// 取消編輯
const cancelEdit = () => {
  editing.value = false
  if (props.user) {
    editForm.displayName = props.user.displayName || ''
  }
}

// 儲存個人資料
const saveProfile = async () => {
  if (!props.user || updating.value) return

  try {
    updating.value = true

    // 通知父組件更新成功
    emit('profile-updated', {
      displayName: editForm.displayName.trim()
    })

    editing.value = false
  } catch (error) {
    console.error('更新個人資料失敗:', error)
    alert('更新失敗，請重試')
  } finally {
    updating.value = false
  }
}
</script>
