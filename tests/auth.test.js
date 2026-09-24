import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createAuthApi } from '../src/services/auth.js'

test('login sends form credentials and CSRF with cookies, then loads user after 204', async () => {
  const calls = []
  const api = createAuthApi('http://localhost:8100/', async (url, options) => {
    calls.push({ url, options })
    if (url.endsWith('/csrf')) return Response.json({ headerName: 'X-CSRF-TOKEN', token: 'fresh' })
    if (url.endsWith('/login')) return new Response(null, { status: 204 })
    return Response.json({ userId: 1, name: '테스트' })
  })
  assert.equal((await api.login('member01', 'secret-password')).name, '테스트')
  assert.deepEqual(calls.map(call => new URL(call.url).pathname), ['/api/auth/csrf', '/api/auth/login', '/api/users/me'])
  assert.equal(calls[1].options.body.get('loginId'), 'member01')
  assert.equal(calls[1].options.body.get('password'), 'secret-password')
  assert.equal(calls[1].options.headers['X-CSRF-TOKEN'], 'fresh')
  assert.ok(calls.every(call => call.options.credentials === 'include'))
})

test('anonymous session is normal, but bad credentials are an error', async () => {
  const api = createAuthApi('', async (url) => url.endsWith('/csrf')
    ? Response.json({ headerName: 'X-CSRF-TOKEN', token: 'fresh' })
    : new Response(null, { status: 401 }))
  assert.equal(await api.me(), null)
  await assert.rejects(api.login('member01', 'wrong'), error => error.status === 401)
})

test('logout fetches a new CSRF token and handles an empty success response', async () => {
  const calls = []
  const api = createAuthApi('', async (url, options) => {
    calls.push({ url, options })
    return url.endsWith('/csrf') ? Response.json({ headerName: 'X-CSRF-TOKEN', token: 'new-token' }) : new Response(null, { status: 204 })
  })
  await api.logout()
  assert.equal(calls[1].url, '/api/auth/logout')
  assert.equal(calls[1].options.headers['X-CSRF-TOKEN'], 'new-token')
})

test('rate limiting and network failure produce actionable messages', async () => {
  const limited = createAuthApi('', async () => new Response(null, { status: 429 }))
  await assert.rejects(limited.login('member01', 'password'), /1분/)
  const offline = createAuthApi('', async () => { throw new TypeError('fetch failed') })
  await assert.rejects(offline.me(), /서버에 연결/)
})
