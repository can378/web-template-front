import { createRouter, createWebHashHistory } from 'vue-router'
import { menuState } from '../services/menu-state.js'
import { createMenuGuard } from './menu-guard.js'

export const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { title: '로그인' } },
  { path: '/menu-unavailable', name: 'menu-unavailable', component: () => import('../views/MenuUnavailableView.vue'), meta: { title: '메뉴 안내' } },
  { path: '/menu1', name: 'menu1', component: () => import('../views/Menu1View.vue'), meta: { menuRequired: true, title: '게시판' } },
  { path: '/menu2', name: 'menu2', component: () => import('../views/Menu2View.vue'), meta: { menuRequired: true, title: '메뉴2' } },
  { path: '/menu3', name: 'menu3', component: () => import('../views/Menu3View.vue'), meta: { menuRequired: true, title: '메뉴3' } },
  { path: '/menu4', name: 'menu4', component: () => import('../views/Menu4View.vue'), meta: { menuRequired: true, title: '메뉴4' } },
  { path: '/menu1/sub1', name: 'menu1-sub1', component: () => import('../views/Menu1Sub1View.vue'), meta: { menuRequired: true, title: '하위메뉴1' } },
  { path: '/menu1/sub2', name: 'menu1-sub2', component: () => import('../views/Menu1Sub2View.vue'), meta: { menuRequired: true, title: '하위메뉴2' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(createMenuGuard(menuState))

router.afterEach(to => {
  document.title = to.meta.title ? `${to.meta.title} — 메인제목` : '메인제목'
})

export default router
