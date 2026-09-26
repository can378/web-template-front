<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostList from '../components/PostList.vue'
import { getPosts } from '../services/posts'
import '../assets/posts.css'
const route = useRoute()
const router = useRouter()
const posts = ref([])
const loading = ref(true)
const loadError = ref('')
onMounted(async () => {
  try { posts.value = await getPosts() }
  catch (error) { loadError.value = error.message }
  finally { loading.value = false }
})
const selected = computed(() => posts.value.find(post => String(post.id) === route.query.post))
const detailRequested = computed(() => typeof route.query.post === 'string')
function open(post) { router.push({ path: route.path, query: { ...route.query, post: String(post.id) } }) }
function back() { const query = { ...route.query }; delete query.post; router.push({ path: route.path, query }) }
</script>

<template>
  <main id="main" tabindex="-1" class="posts-page container">
    <div class="posts-heading"><h1>게시판</h1></div>
    <section v-if="loading" class="post-empty" role="status"><p>게시글을 불러오는 중입니다.</p></section>
    <section v-else-if="loadError" class="post-empty" role="alert"><h2>게시글을 불러오지 못했습니다</h2><p>{{ loadError }}</p></section>
    <section v-else-if="selected" class="post-detail" aria-labelledby="post-detail-title">
      <button type="button" class="post-back" @click="back">← 목록으로</button>
      <header><span class="post-category">{{ selected.category }}</span><h2 id="post-detail-title">{{ selected.title }}</h2><p>{{ selected.author }}<span aria-hidden="true"> · </span><time>{{ selected.date }}</time></p></header>
      <div class="post-content">{{ selected.content }}</div>
      <footer><button type="button" @click="back">목록으로 돌아가기</button></footer>
    </section>
    <section v-else-if="detailRequested" class="post-empty"><h2>게시물을 찾을 수 없습니다</h2><p>목록에서 다른 게시물을 선택해 주세요.</p><button type="button" @click="back">목록으로</button></section>
    <PostList v-if="!loading && !loadError" v-show="!detailRequested" :posts="posts" @open="open" />
  </main>
</template>
