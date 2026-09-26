<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { useAuth } from './composables/useAuth'
import { hasMenuPath, menuState } from './services/menu-state.js'

const route = useRoute()
const router = useRouter()
const { state: menuData, refresh: refreshMenus, ensureLoaded: ensureMenus } = menuState
const { user, checking, pending, error, notice, login, logout, checkSession } = useAuth(router, refreshMenus)
const canShowPage = computed(() => !route.meta.menuRequired || (
  !pending.value && !menuData.loading && !menuData.error && hasMenuPath(menuData.menus, route.path)
))

function focusMain() {
  document.getElementById('main')?.focus()
}

watch(() => route.fullPath, () => { error.value = '' })
onMounted(async () => {
  await checkSession()
  if (!route.meta.menuRequired && route.name !== 'menu-unavailable') await ensureMenus()
})
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="focusMain">본문으로 건너뛰기</a>
  <AppHeader :menus="menuData.menus" :user="user" :checking="checking" :pending="pending" @logout="logout" />
  <div v-if="menuData.loading" class="session-notice container" role="status">메뉴 불러오는 중…</div>
  <div v-else-if="menuData.error && route.name !== 'menu-unavailable'" class="session-notice container" role="alert">
    <span>{{ menuData.error }}</span><button type="button" @click="refreshMenus">다시 시도</button>
  </div>
  <div v-if="notice" class="session-notice container" role="status"><span>{{ notice }}</span><button type="button" aria-label="알림 닫기" @click="notice = ''">✕</button></div>
  <RouterView v-if="canShowPage" v-slot="{ Component }">
    <component :is="Component" v-bind="route.name === 'login' ? { pending: pending || checking, error, onLogin: login } : route.name === 'home' ? { user } : {}" />
  </RouterView>
</template>
