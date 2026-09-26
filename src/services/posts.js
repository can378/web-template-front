const baseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8100'

export async function getPosts(boardCode = 'MENU1_BOARD', fetcher = globalThis.fetch.bind(globalThis)) {
  let response
  try {
    const query = new URLSearchParams({ boardCode })
    response = await fetcher(`${baseUrl.replace(/\/$/, '')}/api/boards/posts?${query}`, {
      credentials: 'include', cache: 'no-store', signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new Error('게시판 서버에 연결하지 못했습니다. 서버 실행 상태와 연결 주소를 확인해 주세요.')
  }
  if (!response.ok) throw new Error(`게시글을 불러오지 못했습니다. 서버 오류 (${response.status})`)
  const rows = await response.json()
  if (!Array.isArray(rows)) throw new Error('게시글 응답 형식이 올바르지 않습니다.')
  return rows.map(post => ({
    id: post.id,
    category: post.category,
    title: post.title,
    content: post.content,
    author: post.author || '탈퇴한 회원',
    date: new Intl.DateTimeFormat('ko-KR').format(new Date(post.createdAt)),
    pinned: post.pinned,
  }))
}
