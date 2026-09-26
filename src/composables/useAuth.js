import { ref } from 'vue'
import { authApi } from '../services/auth'

export function useAuth(router, onSessionChanged = async () => {}) {
  const user = ref(null)
  const checking = ref(true)
  const pending = ref(false)
  const error = ref('')
  const notice = ref('')

  async function login(credentials) {
    if (pending.value) return
    pending.value = true
    error.value = ''
    notice.value = ''
    try {
      user.value = await authApi.login(credentials.loginId, credentials.password)
      await onSessionChanged()
      await router.push('/')
      notice.value = '로그인했어요. 오늘도 좋은 하루 보내세요.'
    } catch (failure) {
      error.value = failure.message
    } finally {
      pending.value = false
    }
  }

  async function logout() {
    if (pending.value) return
    pending.value = true
    notice.value = ''
    try {
      await authApi.logout()
      user.value = null
      await onSessionChanged()
      await router.replace('/')
      notice.value = '로그아웃했어요.'
    } catch (failure) {
      notice.value = failure.message
    } finally {
      pending.value = false
    }
  }

  async function checkSession() {
    try {
      user.value = await authApi.me()
      if (user.value && router.currentRoute.value.name === 'login') await router.replace('/')
    } catch (failure) {
      error.value = failure.message
    } finally {
      checking.value = false
    }
  }

  return { user, checking, pending, error, notice, login, logout, checkSession }
}
