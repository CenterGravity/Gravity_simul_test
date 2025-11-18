## 프로젝트 실행 방법

- 의존성 설치: `pnpm install` (npm을 쓸 경우 `npm install`도 가능하지만 pnpm 권장).
- 개발 서버(핫 리로드): `pnpm dev -- --host --port 5174` 후 안내된 URL 접속. 종료는 Ctrl+C.
- 프로덕션 빌드: `pnpm build` → `dist/`에 번들 생성.
- 빌드 미리보기: `pnpm preview -- --host 0.0.0.0 --port 4173`로 로컬 서버 실행 후 접속. 종료는 Ctrl+C.

# 중력 계산

- 오일러 적분을 활용하여 중력을 계산함.

## 오류 기록

### 2025년 11월 13일

- 증상: 브라우저 콘솔에 `Uncaught SyntaxError: The requested module '/src/App.jsx?...' does not provide an export named 'default'`가 뜨며 렌더링이 중단됨.
- 원인: `src/main.jsx`는 `import App from './App.jsx'`로 기본 export를 요구하지만, 저장 과정 중 `export default App;` 선언이 제거되거나 HMR 캐시에 빈 모듈이 남으면 ES 모듈 로더가 default export를 찾지 못함.
- 해결 절차:
  1. `src/App.jsx`에 `export default function App()` 혹은 `function App() { ... } export default App;` 구문이 존재하는지 확인한다.
  2. 저장 후 dev 서버(`npm run dev`)를 완전히 재시작한다. HMR이 캐싱한 잘못된 모듈을 초기화하기 위함.
  3. 브라우저에서 강력 새로고침(Shift+Reload)으로 캐시를 비워 최신 번들을 다시 불러온다.
- 요약: `import App from ...` 형태는 반드시 “기본(default) export”가 있어야만 동작한다. 함수 선언과 동시에 `export default function App()`처럼 내보내도 되고, 함수를 선언한 뒤 마지막 줄에 `export default App;`을 붙여도 된다. 핵심은 어떤 방식이든 default export가 존재해야 하며, 그렇지 않으면 브라우저는 “이 모듈에는 기본 내보내기가 없다”고 판단해 위 오류를 발생시킨다.

  쉽게 말해 선언과 동시에 내보내기를 진행하지 않으면 브라우저가 없다고 판단하고 에러를 띄우는 것.

## npm → pnpm 마이그레이션 메모

- 전제: 로컬에 Node 18+ 설치, 프로젝트 루트(`/Users/kiwi/Desktop/개발/GVProject/Gravity_sim_demo`).
- `npm install -g pnpm` 또는 `corepack enable pnpm`으로 pnpm 설치/활성화.
- 기존 산출물 정리: `rm -rf node_modules package-lock.json` (pnpm-lock.yaml은 아직 없음).
- 패키지 설치: `pnpm install`로 `pnpm-lock.yaml` 생성 및 `node_modules` 재생성.
- 스크립트는 package.json 그대로 사용하되 실행 시 `npm run ...` 대신 `pnpm ...` 또는 `pnpm run ...` 사용.
- CI/배포 설정 시도: `npm ci`는 더 이상 쓰지 않고 `pnpm install --frozen-lockfile`로 고정된 의존성 설치.
- 마이그레이션 이유: 설치 속도(병렬·캐시)와 디스크 절약(하드링크), 더 일관된 lockfile, 워크스페이스 지원 강화 필요.
