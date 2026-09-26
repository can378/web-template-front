<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({ pending: Boolean, error: String })
const emit = defineEmits(['login'])
const loginId = ref('')
const password = ref('')
const showPassword = ref(false)

function submit() {
  emit('login', { loginId: loginId.value.trim(), password: password.value })
}
</script>

<template>
  <main id="main" tabindex="-1" class="login-page container">
    <section class="login-form" aria-labelledby="form-title">
      <h1 id="form-title">로그인</h1>
      <form @submit.prevent="submit" :aria-busy="pending">
        <div class="form-field">
          <label for="login-id">아이디</label>
          <input id="login-id" v-model="loginId" name="username" autocomplete="username" required maxlength="100" :disabled="pending" autocapitalize="none" :spellcheck="false">
        </div>
        <div class="form-field">
          <label for="login-password">비밀번호</label>
          <div class="password-field">
            <input id="login-password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required :disabled="pending">
            <button type="button" class="password-toggle" :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'" :aria-pressed="showPassword" @click="showPassword = !showPassword">{{ showPassword ? '숨기기' : '보기' }}</button>
          </div>
        </div>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="login-submit" type="submit" :disabled="pending || !loginId.trim() || !password">{{ pending ? '로그인 중…' : '로그인' }}</button>
      </form>
      <RouterLink class="back-link" to="/">홈으로</RouterLink>
    </section>
  </main>
</template>
