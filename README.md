# web-template-front

Vue 3와 Vite로 만든 프런트엔드 프로젝트입니다.

## 로그인

- 로그인 화면: `http://localhost:3100/#/login`
- Spring Boot 서버를 `http://localhost:8100`에서 실행한 뒤 등록된 계정으로 로그인합니다.
- CSRF 토큰 발급 → 로그인(form-urlencoded) → 내 정보 조회 순서로 연결합니다.
- 새로고침 시 서버 세션으로 로그인 상태를 복원하며 비밀번호나 토큰을 localStorage에 저장하지 않습니다.
- API 주소 변경은 `.env`에 `VITE_API_BASE_URL=http://localhost:8100`을 지정하고 Vite를 재시작합니다. 이 값에는 비밀 정보를 넣지 않습니다.
- 운영 환경에서는 실제 HTTPS API 주소와 서버의 `FRONTEND_ORIGIN`, 보안 쿠키 설정을 맞춰야 합니다.
- `npm.cmd test`로 로그인 요청·CSRF·오류 처리 테스트를 실행합니다.

## 실행

```powershell
npm.cmd install
npm.cmd run dev
```

터미널에 표시되는 주소로 접속하면 됩니다. 기본 주소는 `http://localhost:3100`입니다.

## GitHub Actions 배포

`.github/workflows/deploy.yml`은 `main` 브랜치에 푸시하거나 Actions에서 수동 실행하면 정적 사이트 Docker 이미지를 빌드해 SSH로 Linux Docker 서버에 배포합니다.

GitHub 저장소의 **Settings → Secrets and variables → Actions**에서 설정합니다.

- Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_PRIVATE_KEY`
- Variables: `DEPLOY_PATH` (서버의 절대 경로, 백엔드 저장소와 같은 값 권장), `DEPLOY_PLATFORM` (`linux/amd64` 또는 `linux/arm64`), `VITE_API_BASE_URL` (브라우저에서 접근할 백엔드의 전체 origin, 예: `https://api.example.com`)

배포 서버에는 Docker가 설치되어 있어야 하며 SSH 사용자가 Docker 실행 권한과 `DEPLOY_PATH` 쓰기 권한을 가져야 합니다. 프론트엔드는 호스트 포트 `8080`으로 열립니다. 두 컨테이너를 같은 서버에서 실행하면 보안그룹/방화벽과 리버스 프록시에서 프론트엔드와 API 경로를 외부에 연결하세요.

## 자주 쓰는 명령어

```powershell
# 개발 서버 실행
npm.cmd run dev

# 배포용 빌드
npm.cmd run build

# 빌드 결과 미리보기
npm.cmd run preview
```

PowerShell 실행 정책으로 `npm` 실행이 막히면 `npm.cmd`를 사용하세요.

## 프런트엔드 구조와 확장

- `src/router/index.js`: 주소, 페이지 컴포넌트, 브라우저 탭 제목을 등록합니다. 기존 링크와 정적 호스팅을 위해 해시 라우팅을 사용합니다.
- `src/config/menus.js`: 메뉴 형식 참고용 예시입니다. 실행 중에는 사용하지 않으며 실제 메뉴는 DB에서 관리합니다.
- `src/services/menu.js`: 세션 쿠키와 함께 `GET /api/menus`를 호출합니다. 인증 API와 같은 `VITE_API_BASE_URL`을 사용합니다.
- `src/services/menu-state.js`: 메뉴 로딩·오류 상태 및 재조회 관리. 이전 세션의 늦은 응답은 무시합니다.
- `src/router/menu-guard.js`: `meta.menuRequired: true`인 페이지 진입 시 이미 불러온 메뉴로 경로 접근을 검사합니다. 최초 조회는 진행 중인 요청을 공유합니다.
- `src/components/AppHeader.vue`: 메뉴 렌더링, hover, 모바일 토글, 키보드 및 바깥 클릭 처리를 담당합니다.
- `src/views/`: 홈, 로그인, 메뉴별 페이지 본문입니다.
- `src/composables/useAuth.js`: 앱에서 생성하는 로그인 상태와 세션 확인, 로그인·로그아웃 처리를 담당합니다.
- `src/App.vue`: 공통 레이아웃과 상태, 라우터 화면을 연결합니다.

### 페이지 추가

1. `src/views/`에 페이지 컴포넌트를 만듭니다.
2. `src/router/index.js`에 고유한 `path`, `name`, 컴포넌트와 `meta.title`을 등록합니다.
3. 관리자 메뉴 API로 DB에 같은 `menu_path`를 가진 메뉴를 추가하고 허용 역할을 설정합니다. 역할을 연결하지 않으면 공개 메뉴입니다.
4. 메뉴로 접근을 제한할 라우트에 `meta.menuRequired: true`를 지정합니다.

헤더는 그룹 메뉴(`path: null`)와 여러 단계 하위메뉴를 표시합니다. DB 메뉴는 등록된 프런트엔드 경로를 가리켜야 하며 메뉴 추가만으로 페이지 기능이 생성되지는 않습니다. 각 업무 API의 서버 권한 검사는 별도로 필요합니다.

초기 접속 및 로그인·로그아웃 후 메뉴를 조회합니다. 빈 응답은 메뉴 없음으로 표시하며, 실패 시 로컬 예시로 대체하지 않고 재시도 안내를 표시합니다. 역할이 없는 메뉴는 누구나 볼 수 있고, 역할이 연결된 메뉴는 일치하는 사용자 역할이 필요합니다. 페이지 이동에서는 메뉴를 재조회하지 않으므로 외부에서 변경한 메뉴·권한은 새로고침이나 로그인·로그아웃 후 반영됩니다. 메뉴 접근 불가 화면은 새로 조회해 다시 확인할 수 있습니다.
