import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createMenuApi } from '../src/services/menu.js'
import { createMenuState, hasMenuPath } from '../src/services/menu-state.js'
import { createMenuGuard } from '../src/router/menu-guard.js'

const tree = [{ id: 1, label: 'Group', path: null, children: [
  { id: 2, label: 'Menu', path: '/menu1', children: [] },
] }]

test('menu requests include session cookies and bypass cached permissions', async () => {
  const api = createMenuApi('http://localhost:8100/', async (url, options) => {
    assert.equal(url, 'http://localhost:8100/api/menus')
    assert.equal(options.credentials, 'include')
    assert.equal(options.cache, 'no-store')
    return Response.json(tree)
  })
  assert.deepEqual(await api.getMenus(), tree)
})

test('empty menus stay empty and errors never fall back to static menus', async () => {
  assert.deepEqual(await createMenuApi('', async () => Response.json([])).getMenus(), [])
  for (const fetcher of [
    async () => new Response(null, { status: 500 }),
    async () => { throw new Error('offline') },
    async () => Response.json({ error: 'invalid' }),
  ]) {
    await assert.rejects(createMenuApi('', fetcher).getMenus(), /메뉴.*(못했습니다)/)
  }
})

test('menu storage failures are distinguished from authentication errors', async () => {
  await assert.rejects(createMenuApi('', async () => new Response(null, { status: 503 })).getMenus(), /DB 연결 설정/)
  await assert.rejects(createMenuApi('', async () => new Response(null, { status: 401 })).getMenus(), /인증이 거부/)
})

test('refresh clears prior permissions and ignores an older session response', async () => {
  const resolvers = []
  const store = createMenuState(() => new Promise(resolve => resolvers.push(resolve)))
  const first = store.refresh()
  const second = store.refresh()
  resolvers[1]([])
  await second
  resolvers[0](tree)
  await first
  assert.deepEqual(store.state.menus, [])
  assert.equal(store.state.loading, false)
})

test('guard reuses menus and applies refreshed permissions after session changes', async () => {
  let result = tree
  let fail = false
  let calls = 0
  const store = createMenuState(async () => {
    calls++
    if (fail) throw new Error('offline')
    return result
  })
  const guard = createMenuGuard(store)
  const target = { path: '/menu1', meta: { menuRequired: true } }
  assert.equal(await guard({ path: '/', meta: {} }), true)
  assert.equal(calls, 0)
  assert.equal(await guard(target), true)
  assert.equal(hasMenuPath(tree, '/menu2'), false)
  assert.equal(await guard(target), true)
  assert.equal(calls, 1)
  assert.equal(store.state.loading, false)
  result = []
  await store.refresh()
  assert.equal((await guard(target)).name, 'menu-unavailable')
  fail = true
  await store.refresh()
  assert.equal((await guard(target)).name, 'menu-unavailable')
  assert.deepEqual(store.state.menus, [])
  assert.equal(store.state.error, 'offline')
})


test('initial menu requests share one load and cache an empty result', async () => {
  let finish
  let calls = 0
  const store = createMenuState(() => {
    calls++
    return new Promise(resolve => { finish = resolve })
  })
  const first = store.ensureLoaded()
  const second = store.ensureLoaded()
  assert.equal(calls, 1)
  finish([])
  assert.equal(await first, true)
  assert.equal(await second, true)
  assert.equal(await store.ensureLoaded(), true)
  assert.equal(calls, 1)
})

test('retry from unavailable page refreshes a previously missing menu', async () => {
  let result = []
  const store = createMenuState(async () => result)
  const guard = createMenuGuard(store)
  const target = { path: '/menu1', meta: { menuRequired: true } }
  assert.equal((await guard(target)).name, 'menu-unavailable')
  result = tree
  assert.equal(await guard(target, { name: 'menu-unavailable' }), true)
})
