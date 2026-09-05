<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const features = [
  { number: '01', icon: '↗', title: '중요한 일에 집중하세요', description: '흩어져 있던 할 일을 모아, 오늘 무엇부터 시작할지 한눈에 확인하세요.', tag: '명확한 우선순위' },
  { number: '02', icon: '▦', title: '나만의 흐름을 만드세요', description: '생각을 정리하고 계획을 세우는 일까지. 내 방식에 맞는 공간을 만들어보세요.', tag: '유연한 공간' },
  { number: '03', icon: '◎', title: '작은 성장을 발견하세요', description: '하나씩 쌓이는 기록으로 어제보다 나아진 오늘을 만나보세요.', tag: '꾸준한 기록' },
]
const questions = [
  { title: '어떤 서비스인가요?', answer: '일과 일상을 한곳에서 정리하는 서비스를 위한 홈 화면 시안입니다. 서비스 이름과 소개는 실제 기획에 맞춰 변경할 수 있습니다.' },
  { title: '지금 바로 사용할 수 있나요?', answer: '현재는 홈 화면을 먼저 준비하고 있습니다. 회원가입, 할 일 관리, 기록 저장 기능은 아직 연결되지 않았습니다.' },
  { title: '모바일에서도 볼 수 있나요?', answer: '네. 휴대폰, 태블릿, 데스크톱 화면 크기에 맞춰 메뉴와 콘텐츠가 자연스럽게 배치됩니다.' },
]
</script>

<template>
  <a class="skip-link" href="#main">본문으로 건너뛰기</a>
  <header class="site-header">
    <div class="container nav-wrap">
      <a class="brand" href="#" aria-label="모아 홈"><span class="brand-symbol">m</span>모아<span class="brand-dot">.</span></a>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="navigation" @click="menuOpen = !menuOpen">{{ menuOpen ? '닫기 ✕' : '메뉴 ☰' }}</button>
      <nav id="navigation" :class="{ open: menuOpen }" aria-label="주 메뉴">
        <a href="#features" @click="menuOpen = false">서비스 소개</a>
        <a href="#preview" @click="menuOpen = false">미리보기</a>
        <a href="#faq" @click="menuOpen = false">자주 묻는 질문</a>
        <a class="nav-cta" href="#features" @click="menuOpen = false">둘러보기 <span>↗</span></a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> YOUR EVERYDAY, SIMPLIFIED</p>
        <h1 id="hero-title">흩어진 일상을 모아,<br>더 가벼운 <em>하루.</em></h1>
        <p class="hero-description">복잡한 일은 덜어내고, 중요한 일에 집중하세요.<br>나의 일과 일상을 연결하는 작은 시작, 모아.</p>
        <div class="hero-actions"><a class="button primary" href="#features">모아 알아보기 <span>↗</span></a><a class="text-link" href="#preview">어떤 모습인지 볼까요? <span>↓</span></a></div>
        <div class="hero-note"><span class="note-line"></span> 조금 더 단순하게, 조금 더 나답게.</div>
      </div>
      <div id="preview" class="preview-scene" aria-label="서비스 화면 예시">
        <div class="scene-orbit"></div>
        <div class="floating-label"><span>✦</span> 나에게 집중하는 시간</div>
        <div class="app-preview">
          <div class="preview-top"><span class="mini-brand">m<span> 나의 공간</span></span><span class="sample-label">미리보기</span></div>
          <div class="preview-greeting"><p>오늘도, 나의 속도로</p><h2>좋은 아침이에요 <span>☀</span></h2><p>작은 시작이 멋진 하루를 만들어요.</p></div>
          <div class="progress-card"><div><span>오늘의 작은 성취</span><strong>2 <small>/ 3</small></strong></div><div class="progress-track"><span></span></div><p>잘하고 있어요. 한 걸음만 더!</p></div>
          <div class="task-heading"><h3>오늘 할 일</h3><span>3개의 계획</span></div>
          <ul class="sample-tasks"><li class="done"><span class="check">✓</span><span>여유롭게 하루 계획하기</span><small>일상</small></li><li class="done"><span class="check">✓</span><span>새로운 아이디어 정리하기</span><small>업무</small></li><li><span class="check"></span><span>좋아하는 책 10쪽 읽기</span><small>나를 위해</small></li></ul>
        </div>
        <div class="floating-note"><span class="sparkle">✳</span><div><strong>작은 시작, 좋은 변화</strong><p>오늘의 나에게 한 걸음 더.</p></div></div>
        <span class="scene-caption">A LITTLE MORE SPACE FOR YOU</span>
      </div>
    </section>

    <div class="values-strip"><div class="container"><p>하루를 바꾸는 건,<br><strong>생각보다 작은 차이.</strong></p><span>덜 복잡하게</span><i>✳</i><span>더 편안하게</span><i>✳</i><span>나의 속도로</span></div></div>

    <section id="features" class="features container" aria-labelledby="features-title">
      <div class="section-heading"><div><p class="eyebrow">MADE FOR YOUR DAY</p><h2 id="features-title">당신의 하루에 필요한 만큼.</h2></div><p>많은 기능보다, 꼭 필요한 경험.<br>일상에 자연스럽게 스며드는 공간을 만나보세요.</p></div>
      <div class="feature-grid"><article v-for="feature in features" :key="feature.number" class="feature-card"><div class="feature-top"><span class="feature-icon">{{ feature.icon }}</span><span>{{ feature.number }}</span></div><h3>{{ feature.title }}</h3><p>{{ feature.description }}</p><span class="feature-tag">{{ feature.tag }}</span></article></div>
    </section>

    <section id="faq" class="faq container" aria-labelledby="faq-title"><div><p class="eyebrow">A FEW THINGS TO KNOW</p><h2 id="faq-title">궁금한 점이 있나요?</h2><p class="muted">시작하기 전에 알아두면 좋은 이야기.</p></div><div class="faq-list"><details v-for="question in questions" :key="question.title"><summary>{{ question.title }}<span aria-hidden="true">+</span></summary><p>{{ question.answer }}</p></details></div></section>
    <section class="closing container"><span>✳</span><h2>좋은 하루의 시작,<br>모아에서 함께.</h2><a class="button primary" href="#main">처음으로 돌아가기 ↑</a></section>
  </main>
  <footer class="container footer"><a class="brand" href="#">모아<span class="brand-dot">.</span></a><p>일과 일상 사이, 나를 위한 공간.</p><small>© {{ new Date().getFullYear() }} 모아. 홈 화면 시안.</small></footer>
</template>
