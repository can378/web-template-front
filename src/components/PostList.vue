<script setup>
import { computed, ref, watch } from 'vue'
const props = defineProps({ posts: { type: Array, default: () => [] } })
const emit = defineEmits(['open'])
const keyword = ref('')
const search = ref('')
const category = ref('전체')
const page = ref(1)
const pageSize = 8
const categories = computed(() => ['전체', ...new Set(props.posts.map(post => post.category))])
const filtered = computed(() => props.posts.filter(post =>
  (category.value === '전체' || post.category === category.value) &&
  `${post.title} ${post.author} ${post.content}`.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.id - a.id))
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const shown = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
watch([category, search], () => { page.value = 1 })
watch(pageCount, value => { page.value = Math.min(page.value, value) })
function reset() { keyword.value = ''; search.value = ''; category.value = '전체'; page.value = 1 }
</script>

<template>
  <section aria-label="게시물 목록" class="post-list">
    <div class="post-toolbar">
      <div class="post-filters" aria-label="게시물 분류">
        <button v-for="item in categories" :key="item" type="button" :aria-pressed="category === item" @click="category = item">{{ item }}</button>
      </div>
      <form class="post-search" role="search" @submit.prevent="search = keyword.trim()">
        <label class="post-sr-only" for="post-query">게시물 검색</label>
        <input id="post-query" v-model="keyword" type="search" placeholder="제목, 내용, 작성자 검색" />
        <button type="submit">검색</button>
      </form>
    </div>
    <div class="post-summary" role="status">총 <strong>{{ filtered.length }}</strong>개의 게시물<span v-if="search"> · “{{ search }}” 검색 결과</span></div>
    <div class="post-table-wrap">
      <table class="post-table">
        <caption class="post-sr-only">게시물 제목, 작성자, 작성일 목록</caption>
        <thead><tr><th scope="col" class="post-number">번호</th><th scope="col">제목</th><th scope="col" class="post-author">작성자</th><th scope="col" class="post-date">작성일</th></tr></thead>
        <tbody>
          <tr v-for="post in shown" :key="post.id" :class="{ 'post-pinned': post.pinned }">
            <td class="post-number"><span v-if="post.pinned" class="post-notice">공지</span><span v-else>{{ post.id }}</span></td>
            <td class="post-title-cell"><span class="post-category">{{ post.category }}</span><button class="post-title" type="button" @click="emit('open', post)">{{ post.title }}</button><span class="post-mobile-meta">{{ post.author }} · {{ post.date }}</span></td>
            <td class="post-author">{{ post.author }}</td><td class="post-date">{{ post.date }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!shown.length" class="post-empty"><h2>{{ posts.length ? '검색 결과가 없습니다' : '아직 등록된 게시물이 없습니다' }}</h2><p>{{ posts.length ? '다른 검색어나 분류로 다시 찾아보세요.' : '새로운 소식이 등록되면 여기서 확인할 수 있습니다.' }}</p><button v-if="posts.length" type="button" @click="reset">전체 게시물 보기</button></div>
    </div>
    <nav v-if="pageCount > 1" class="post-pagination" aria-label="게시물 페이지">
      <button type="button" :disabled="page === 1" @click="page--">이전</button>
      <button v-for="number in pageCount" :key="number" type="button" :aria-label="`${number}페이지`" :aria-current="page === number ? 'page' : undefined" @click="page = number">{{ number }}</button>
      <button type="button" :disabled="page === pageCount" @click="page++">다음</button>
    </nav>
  </section>
</template>
