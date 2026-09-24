export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.status = status
  }
}

export function createAuthApi(baseUrl, fetcher = globalThis.fetch.bind(globalThis)) {
  const base = baseUrl.replace(/\/$/, '')

  async function request(path, options = {}) {
    let response
    try {
      response = await fetcher(`${base}${path}`, {
        ...options,
        credentials: 'include',
        signal: AbortSignal.timeout(10000),
      })
    } catch {
      throw new ApiError('서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.')
    }
    if (!response.ok) {
      const messages = {
        401: '아이디 또는 비밀번호를 확인해 주세요.',
        403: '요청을 확인하지 못했어요. 다시 시도해 주세요.',
        429: '로그인 시도가 많아요. 1분 뒤 다시 시도해 주세요.',
      }
      throw new ApiError(messages[response.status] || '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.', response.status)
    }
    return response.status === 204 ? null : response.json()
  }

  async function mutate(path, body) {
    const csrf = await request('/api/auth/csrf')
    return request(path, {
      method: 'POST',
      headers: { [csrf.headerName]: csrf.token },
      ...(body ? { body } : {}),
    })
  }

  return {
    async me() {
      try {
        return await request('/api/users/me')
      } catch (error) {
        if (error.status === 401) return null
        throw error
      }
    },
    async login(loginId, password) {
      await mutate('/api/auth/login', new URLSearchParams({ loginId, password }))
      const user = await request('/api/users/me')
      return user
    },
    async logout() {
      await mutate('/api/auth/logout')
    },
  }
}

export const authApi = createAuthApi(import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8100')
