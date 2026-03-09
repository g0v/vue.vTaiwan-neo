<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <div class="rounded-lg bg-white p-6 shadow-md">
      <h1 class="mb-6 text-3xl font-bold text-gray-800">{{ $t('profile.title') }}</h1>

      <!-- 登入狀態檢查 -->
      <div v-if="!user" class="py-8 text-center">
        <p class="mb-4 text-gray-600">{{ $t('profile.loginRequired') }}</p>
        <GoogleLogin @login-success="$emit('login-success', $event)" />
      </div>

      <!-- 個人資料顯示模式 -->
      <div v-else-if="!editing" class="space-y-6">
        <div class="mb-6 flex items-center space-x-4">
          <img v-if="userData && userData.photoURL" :src="userData.photoURL" :alt="userData.name || '用戶頭像'" class="h-16 w-16 rounded-full" />
          <div v-else class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
            <span class="text-xl text-gray-600">👤</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ user.displayName || '未設定姓名' }}</h2>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>

        <!-- 用戶資料顯示 -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('profile.name') }}</label>
            <div class="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800">
              {{ user.displayName || '未設定' }}
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('profile.email') }}</label>
            <div class="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800">
              {{ user.email }}
            </div>
          </div>
          <!-- <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">用戶ID</label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 font-mono text-sm">
              {{ user.uid }}
            </div>
          </div> -->
        </div>

        <!-- 操作按鈕 -->
        <div class="flex space-x-4 pt-6">
          <button @click="startEdit" class="rounded-md bg-democratic-red px-6 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-democratic-red focus:ring-offset-2">
            {{ $t('common.edit') }}
          </button>
          <button @click="$emit('logout')" class="rounded-md border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            {{ $t('common.logout') }}
          </button>
        </div>
      </div>

      <!-- 個人資料編輯模式 -->
      <div v-else class="space-y-6">
        <div class="mb-6 flex items-center space-x-4">
          <img v-if="userData && userData.photoURL" :src="userData.photoURL" :alt="userData.name || '用戶頭像'" class="h-16 w-16 rounded-full" />
          <div v-else class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
            <span class="text-xl text-gray-600">👤</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800">編輯個人資料</h2>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <!-- 姓名欄位 (可編輯) -->
          <div>
            <label for="displayName" class="mb-2 block text-sm font-medium text-gray-700">
              {{ $t('profile.name') }}
              <span class="text-red-500">*</span>
            </label>
            <input
              id="displayName"
              v-model="editForm.displayName"
              type="text"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-democratic-red focus:outline-none focus:ring-2 focus:ring-democratic-red"
              placeholder="請輸入您的姓名"
            />
          </div>

          <!-- Email 欄位 (僅顯示，不可編輯) -->
          <div>
            <label for="email" class="mb-2 block text-sm font-medium text-gray-700">
              {{ $t('profile.email') }}
            </label>
            <input id="email" :value="user.email" type="email" disabled class="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm" />
            <p class="mt-1 text-xs text-gray-500">Email 無法編輯</p>
          </div>

          <!-- UID 欄位 (僅顯示，不可編輯) -->
          <div>
            <label for="uid" class="mb-2 block text-sm font-medium text-gray-700"> 用戶ID </label>
            <input id="uid" :value="user.uid" type="text" disabled class="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-500 shadow-sm" />
            <p class="mt-1 text-xs text-gray-500">用戶ID 無法編輯</p>
          </div>

          <!-- 提交按鈕 -->
          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              :disabled="updating || !hasChanges"
              class="rounded-md bg-democratic-red px-6 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-democratic-red focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ updating ? '更新中...' : $t('common.save') }}
            </button>

            <button
              type="button"
              @click="cancelEdit"
              :disabled="updating"
              class="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
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
import { useHead } from '@unhead/vue'
import GoogleLogin from '../components/GoogleLogin.vue'

const { t } = useI18n()
useHead({
  title: t('profile.title') + ' | vTaiwan',
})

// Props
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  userData: {
    type: Object,
    default: () => ({}),
  },
})

// Emits
const emit = defineEmits(['login-success', 'logout', 'profile-updated'])

// 響應式數據
const editing = ref(false)
const updating = ref(false)

// 編輯表單數據 (副本)
const editForm = reactive({
  displayName: '',
})

// 計算屬性
const hasChanges = computed(() => {
  if (!props.user) return false
  return editForm.displayName !== (props.user.displayName || '')
})

// 監聽用戶變化，更新編輯表單
watch(
  () => props.user,
  newUser => {
    if (newUser) {
      editForm.displayName = newUser.displayName || ''
    } else {
      editForm.displayName = ''
    }
  },
  { immediate: true }
)

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
      displayName: editForm.displayName.trim(),
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
