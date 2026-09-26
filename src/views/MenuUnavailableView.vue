<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { menuState } from '../services/menu-state.js'

const route = useRoute()
const router = useRouter()
const retryPath = computed(() => {
  const path = route.query.from
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')
    && router.resolve(path).meta.menuRequired ? path : null
})
</script>

<template>
  <main id="main" tabindex="-1" class="home-page container">
    <p>{{ menuState.state.error || '접근할 수 없는 메뉴입니다.' }}</p>
    <RouterLink v-if="retryPath" class="back-link" :to="retryPath">다시 확인</RouterLink>
    <RouterLink class="back-link" to="/">홈으로</RouterLink>
  </main>
</template>
