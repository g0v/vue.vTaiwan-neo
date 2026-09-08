<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content max-w-3xl">
      <div class="vt-page-intro">
        <p class="vt-section-label">{{ $t('pageLabels.profile') }}</p>
        <h1 class="vt-page-title">{{ $t('profile.title') }}</h1>
      </div>

      <div v-if="!user" class="vt-glass-panel p-10 text-center sm:p-12">
        <div class="vt-topic-bubble vt-topic-bubble-red mx-auto mb-5">
          <span class="font-sans text-xl font-semibold" aria-hidden="true">V</span>
        </div>
        <h2 class="m-0 text-2xl">{{ $t('profile.title') }}</h2>
        <p class="text-vt-gray-700 mx-auto mt-3 mb-7 max-w-md leading-7">{{ $t('profile.loginRequired') }}</p>
        <GoogleLogin @login-success="$emit('login-success', $event)" />
      </div>

      <div v-else class="vt-glass-panel p-6 sm:p-9">
        <div class="mb-8 flex items-center gap-4">
          <img v-if="userData?.photoURL" :src="userData.photoURL" :alt="$t('profile.avatarAlt')" class="border-vt-border h-16 w-16 rounded-full border object-cover" />
          <div v-else class="bg-vt-red-tint text-democratic-red flex h-16 w-16 items-center justify-center rounded-full font-sans text-xl font-bold">
            {{ (user.displayName || user.email || 'V').slice(0, 1).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <h2 class="m-0 truncate text-xl">{{ editing ? $t('profile.editTitle') : user.displayName || $t('profile.notSet') }}</h2>
            <p class="text-vt-gray-700 truncate font-sans text-sm">{{ user.email }}</p>
          </div>
        </div>

        <div v-if="!editing">
          <dl class="grid gap-4 md:grid-cols-2">
            <div>
              <dt class="text-vt-gray-700 mb-2 font-sans text-xs font-semibold">{{ $t('profile.name') }}</dt>
              <dd class="border-vt-border bg-vt-bg-2 m-0 rounded-xl border px-4 py-3">{{ user.displayName || $t('profile.notSet') }}</dd>
            </div>
            <div>
              <dt class="text-vt-gray-700 mb-2 font-sans text-xs font-semibold">{{ $t('profile.email') }}</dt>
              <dd class="border-vt-border bg-vt-bg-2 m-0 rounded-xl border px-4 py-3">{{ user.email }}</dd>
            </div>
          </dl>
          <div class="mt-8 flex flex-wrap gap-3">
            <button type="button" class="vt-btn vt-btn-primary" @click="startEdit">{{ $t('common.edit') }}</button>
            <button type="button" class="vt-btn vt-btn-ghost" @click="$emit('logout')">{{ $t('common.logout') }}</button>
          </div>
        </div>

        <form v-else class="space-y-5" @submit.prevent="saveProfile">
          <div>
            <label for="displayName" class="text-vt-gray-700 mb-2 block font-sans text-xs font-semibold">{{ $t('profile.name') }} *</label>
            <input id="displayName" v-model="editForm.displayName" type="text" required class="vt-form-control" :placeholder="$t('profile.namePlaceholder')" />
          </div>
          <div>
            <label for="email" class="text-vt-gray-700 mb-2 block font-sans text-xs font-semibold">{{ $t('profile.email') }}</label>
            <input id="email" :value="user.email" type="email" disabled class="vt-form-control" />
            <p class="text-vt-gray-400 mt-1 font-sans text-xs">{{ $t('profile.emailReadonly') }}</p>
          </div>
          <div>
            <label for="uid" class="text-vt-gray-700 mb-2 block font-sans text-xs font-semibold">{{ $t('profile.userId') }}</label>
            <input id="uid" :value="user.uid" type="text" disabled class="vt-form-control font-mono" />
            <p class="text-vt-gray-400 mt-1 font-sans text-xs">{{ $t('profile.userIdReadonly') }}</p>
          </div>
          <div class="flex flex-wrap gap-3 pt-3">
            <button type="submit" :disabled="updating || !hasChanges" class="vt-btn vt-btn-primary disabled:cursor-not-allowed disabled:opacity-50">
              {{ updating ? $t('profile.updating') : $t('common.save') }}
            </button>
            <button type="button" :disabled="updating" class="vt-btn vt-btn-ghost disabled:opacity-50" @click="cancelEdit">{{ $t('common.cancel') }}</button>
          </div>
        </form>
      </div>
    </div>
  </section>
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
    alert(t('profile.updateFailed'))
  } finally {
    updating.value = false
  }
}
</script>
