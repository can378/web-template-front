<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import SubmenuItems from './SubmenuItems.vue'

defineProps({ menus: { type: Array, default: () => [] }, user: Object, checking: Boolean, pending: Boolean })
const emit = defineEmits(['logout'])
const route = useRoute()
const openMenu = ref(null)
const navigation = ref(null)

function closeOutside(event) {
  if (!navigation.value?.contains(event.target)) openMenu.value = null
}

function closeOnBlur(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) openMenu.value = null
}

function closeWithEscape(event) {
  const toggle = event.currentTarget.querySelector('.submenu-toggle')
  toggle?.focus()
  openMenu.value = null
}

watch(() => route.fullPath, () => { openMenu.value = null })
onMounted(() => document.addEventListener('pointerdown', closeOutside))
onUnmounted(() => document.removeEventListener('pointerdown', closeOutside))
</script>

<template>
  <header class="site-header">
    <div class="container nav-wrap">
      <RouterLink class="brand" to="/" aria-label="메인제목 홈">메인제목</RouterLink>
      <nav ref="navigation" class="main-menu" aria-label="주 메뉴">
        <div v-for="menu in menus" :key="menu.id" class="menu-group"
          @pointerenter="event => { if (event.pointerType === 'mouse' && menu.children?.length) openMenu = menu.id }"
          @pointerleave="event => { if (event.pointerType === 'mouse') openMenu = null }"
          @focusout="closeOnBlur" @keydown.esc.prevent.stop="closeWithEscape">
          <RouterLink v-if="menu.path" class="menu-item" :to="menu.path" @click="openMenu = null">{{ menu.label }}</RouterLink>
          <button v-else-if="menu.children?.length" type="button" class="menu-item menu-group-label"
            :aria-expanded="openMenu === menu.id" :aria-controls="`submenu-${menu.id}`"
            @click="openMenu = openMenu === menu.id ? null : menu.id">{{ menu.label }}</button>
          <span v-else class="menu-item">{{ menu.label }}</span>
          <button v-if="menu.children?.length" class="submenu-toggle" type="button"
            :aria-label="`${menu.label} 하위메뉴`" :aria-expanded="openMenu === menu.id" :aria-controls="`submenu-${menu.id}`"
            @click="openMenu = openMenu === menu.id ? null : menu.id"><span aria-hidden="true">⌄</span></button>
          <ul v-if="menu.children?.length" v-show="openMenu === menu.id" :id="`submenu-${menu.id}`" class="submenu">
            <SubmenuItems :menus="menu.children" @navigate="openMenu = null" />
          </ul>
        </div>
      </nav>
      <div class="auth-menu">
        <span v-if="checking" class="auth-check" role="status">로그인 확인 중…</span>
        <template v-else-if="user">
          <span class="user-greeting"><strong>{{ user.name }}</strong>님</span>
          <button class="nav-cta logout-button" type="button" :disabled="pending" @click="emit('logout')">{{ pending ? '로그아웃 중…' : '로그아웃' }}</button>
        </template>
        <RouterLink v-else-if="route.name !== 'login'" class="nav-cta" to="/login">로그인</RouterLink>
      </div>
    </div>
  </header>
</template>
