<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import { authApi } from './services/auth'

const hash = ref(window.location.hash)
const user = ref(null)
const checking = ref(true)
const pending = ref(false)
const error = ref('')
const notice = ref('')
const isLogin = computed(() => hash.value === '#/login')

function updateRoute() {
  hash.value = window.location.hash
  error.value = ''
  document.title = isLogin.value ? '로그인 — 모아' : '모아'
  window.scrollTo(0, 0)
}

function focusMain() {
  document.getElementById('main')?.focus()
}

async function login(credentials) {
  if (pending.value) return
  pending.value = true
  error.value = ''
  notice.value = ''
  try {
    user.value = await authApi.login(credentials.loginId, credentials.password)
    window.location.hash = ''
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
    notice.value = '로그아웃했어요.'
  } catch (failure) {
    notice.value = failure.message
  } finally {
    pending.value = false
  }
}

onMounted(async () => {
  window.addEventListener('hashchange', updateRoute)
  updateRoute()
  try {
    user.value = await authApi.me()
    if (user.value && isLogin.value) window.location.hash = ''
  } catch (failure) {
    error.value = failure.message
  } finally {
    checking.value = false
  }
})
onUnmounted(() => window.removeEventListener('hashchange', updateRoute))
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="focusMain">본문으로 건너뛰기</a>
  <header class="site-header">
    <div class="container nav-wrap">
      <a class="brand" href="#" aria-label="모아 홈">모아</a>
      <nav aria-label="주 메뉴">
        <span v-if="checking" class="auth-check" role="status">로그인 확인 중…</span>
        <template v-else-if="user">
          <span class="user-greeting"><strong>{{ user.name }}</strong>님</span>
          <button class="nav-cta logout-button" type="button" :disabled="pending" @click="logout">{{ pending ? '로그아웃 중…' : '로그아웃' }}</button>
        </template>
        <a v-else-if="!isLogin" class="nav-cta" href="#/login">로그인</a>
      </nav>
    </div>
  </header>
  <div v-if="notice" class="session-notice container" role="status"><span>{{ notice }}</span><button type="button" aria-label="알림 닫기" @click="notice = ''">✕</button></div>
  <LoginView v-if="isLogin" :pending="pending || checking" :error="error" @login="login" />
  <HomeView v-else :user="user" />
</template>
