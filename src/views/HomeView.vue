<script setup>
defineProps({ user: Object })
</script>

<template>
  <main id="main" tabindex="-1" class="home-page container">
    <h1>{{ user ? `${user.name}님, 안녕하세요.` : '모아' }}</h1>
    <p>{{ user ? '로그인되었습니다.' : '일과 일상을 정리하는 작은 공간.' }}</p>
  </main>
</template>
