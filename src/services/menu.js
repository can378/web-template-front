export function createMenuApi(baseUrl, fetcher = globalThis.fetch.bind(globalThis)) {
  return {
    async getMenus() {
      let response
      try {
        response = await fetcher(`${baseUrl.replace(/\/$/, '')}/api/menus`, {
          credentials: 'include', cache: 'no-store', signal: AbortSignal.timeout(10000),
        })
      } catch {
        throw new Error('메뉴 서버에 연결하지 못했습니다. 서버 실행 상태와 연결 주소를 확인해 주세요.')
      }
      if (!response.ok) {
        const messages = {
          401: '메뉴 조회 인증이 거부되었습니다. 서버 설정을 확인하거나 다시 로그인해 주세요.',
          403: '메뉴를 조회할 권한이 없습니다.',
          503: '메뉴 저장소에 연결할 수 없습니다. 서버의 DB 연결 설정을 확인해 주세요.',
        }
        throw new Error(messages[response.status] || `메뉴를 불러오지 못했습니다. 서버 오류 (${response.status})`)
      }
      try {
        const menus = await response.json()
        if (!Array.isArray(menus)) throw new Error('Invalid menu response')
        return menus
      } catch {
        throw new Error('메뉴를 불러오지 못했습니다. 서버 연결을 확인하고 다시 시도해 주세요.')
      }
    },
  }
}

export const { getMenus } = createMenuApi(import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8100')
