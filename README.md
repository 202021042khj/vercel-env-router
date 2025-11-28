# Vercel Environment Router

Vercel 배포를 위한 브랜치별 `vercel.json` 자동 생성 도구

## 문제점

여러 환경(운영, 스테이징, 개발)으로 Vercel에 배포할 때, 각 브랜치마다 다른 백엔드 API URL이 필요합니다. `vercel.json`을 수동으로 관리하거나 프로젝트마다 커스텀 빌드 스크립트를 작성하는 것은 번거롭고 오류가 발생하기 쉽습니다.

## 해결책

`vercel-env-router`는 현재 git 브랜치를 기반으로 `vercel.json`을 자동 생성하며, 런타임 검증이 포함된 타입 안전 설정을 제공합니다.

## 주요 기능

- ✅ **타입 안전 설정**: TypeScript + Zod 검증
- ✅ **브랜치 기반 라우팅**: 자동 환경 감지
- ✅ **CLI 도구**: 모든 프로젝트에서 사용 가능한 간단한 명령어
- ✅ **Vite 플러그인**: 개발 중 자동 생성
- ✅ **제로 설정**: 커스터마이징 옵션이 있는 합리적인 기본값
- ✅ **모노레포 지원**: pnpm workspace 호환
- ✅ **완전한 테스트 커버리지**: 포괄적인 테스트 스위트

## 빠른 시작

### 설치

```bash
pnpm add -D @vercel-env-router/cli @vercel-env-router/core
```

### 초기화

```bash
npx vercel-env-router init
```

`vercel-env-router.config.ts` 파일이 생성됩니다:

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: process.env.PROD_API_URL || 'https://api.production.example.com',
    },
    staging: {
      branch: 'staging',
      apiUrl: process.env.STAGING_API_URL || 'https://api.staging.example.com',
    },
    development: {
      branch: 'dev',
      apiUrl: process.env.DEV_API_URL || 'http://localhost:3000',
    },
  },
})
```

### 빌드 스크립트에 추가

```json
{
  "scripts": {
    "build": "vercel-env-router generate && vite build"
  }
}
```

### 배포

```bash
# Vercel 대시보드에서 환경 변수 설정
PROD_API_URL=https://api.production.example.com
STAGING_API_URL=https://api.staging.example.com
DEV_API_URL=https://api.dev.example.com

# 배포
vercel --prod
```

## 작동 원리

1. **설정**: `vercel-env-router.config.ts`에 환경과 백엔드 URL 정의
2. **감지**: `VERCEL_GIT_COMMIT_REF` 환경 변수에서 현재 브랜치 감지
3. **생성**: 현재 환경에 맞는 올바른 rewrite가 포함된 `vercel.json` 자동 생성
4. **배포**: Vercel이 생성된 `vercel.json`을 사용하여 API 요청 프록시

## 아키텍처

```
브라우저 (HTTPS) → https://your-app.vercel.app/api/users
                 ↓
        Vercel Edge Network (vercel.json rewrite)
                 ↓
      백엔드 (HTTP/HTTPS) → https://api.production.example.com/api/users
```

## 패키지

- [`@vercel-env-router/core`](./packages/core) - 타입 정의와 로직이 포함된 핵심 라이브러리
- [`@vercel-env-router/cli`](./packages/cli) - 커맨드라인 인터페이스
- [`@vercel-env-router/vite`](./packages/vite) - 자동 생성을 위한 Vite 플러그인

## 예제

- [기본 사용법](./examples/basic) - 세 가지 환경을 사용한 간단한 설정
- [멀티 백엔드](./examples/multi-backend) - 여러 백엔드 서비스를 사용한 고급 사용법
- [마이그레이션 가이드](./examples/migration) - 수동 스크립트에서 마이그레이션

## CLI 명령어

### `init`

새 설정 파일 생성:

```bash
vercel-env-router init
```

### `generate`

설정에서 `vercel.json` 생성:

```bash
vercel-env-router generate
```

옵션:

- `-c, --config <path>` - 설정 파일 경로
- `-o, --output <path>` - vercel.json 출력 경로
- `-b, --branch <name>` - 브랜치 이름 오버라이드
- `--no-validate` - 검증 건너뛰기

### `validate`

설정 파일 검증:

```bash
vercel-env-router validate
```

옵션:

- `-c, --config <path>` - 설정 파일 경로
- `--check-env-vars` - 환경 변수 가용성 확인

## Vite 플러그인

개발 중 자동 생성:

```typescript
// vite.config.ts
import { vercelEnvRouter } from '@vercel-env-router/vite'

export default {
  plugins: [
    vercelEnvRouter({
      verbose: true,
    }),
  ],
}
```

## 설정

### 기본 설정

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: 'https://api.production.example.com',
    },
  },
})
```

### 고급 설정

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: 'https://api.production.example.com',
      // 환경별 rewrites
      customRewrites: [
        {
          source: '/auth/(.*)',
          destination: 'https://auth.production.example.com/$1',
        },
      ],
      // 환경별 headers
      customHeaders: [
        {
          source: '/api/(.*)',
          headers: [{ key: 'X-Environment', value: 'production' }],
        },
      ],
    },
  },
  // 모든 환경에 적용되는 전역 rewrites
  rewrites: [
    {
      source: '/(.*)',
      destination: '/',
    },
  ],
  // 모든 환경에 적용되는 전역 headers
  headers: [
    {
      source: '/assets/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
})
```

## 문서

- [시작 가이드](./docs/guide.md)
- [API 레퍼런스](./docs/api.md)
- [설정 옵션](./docs/configuration.md)
- [문제 해결](./docs/troubleshooting.md)

## 개발

### 설정

```bash
# 저장소 클론
git clone https://github.com/202021042khj/vercel-env-router.git
cd vercel-env-router

# 의존성 설치
pnpm install

# 패키지 빌드
pnpm build

# 테스트 실행
pnpm test
```

### 프로젝트 구조

```
vercel-env-router/
├── packages/
│   ├── core/              # 핵심 라이브러리
│   ├── cli/               # CLI 도구
│   └── vite-plugin/       # Vite 플러그인
├── examples/              # 예제 프로젝트
├── docs/                  # 문서
└── tests/                 # 통합 테스트
```

## 테스트

```bash
# 모든 테스트 실행
pnpm test

# 커버리지와 함께 테스트 실행
pnpm test:coverage

# 타입 체크
pnpm typecheck

# 린팅
pnpm lint
```

## 왜 vercel-env-router인가?

### 이전

```javascript
// 각 프로젝트마다 수동 스크립트
const fs = require('fs')
const backendUrl = process.env.API_URL || 'http://localhost:3000'
const config = {
  rewrites: [{ source: '/api/(.*)', destination: `${backendUrl}/api/$1` }],
}
fs.writeFileSync('vercel.json', JSON.stringify(config))
```

문제점:

- ❌ 타입 안전성 없음
- ❌ 검증 없음
- ❌ 프로젝트마다 복사-붙여넣기
- ❌ 유지보수 어려움

### 이후

```typescript
// 재사용 가능한 타입 안전 설정
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: { branch: 'main', apiUrl: process.env.PROD_API_URL },
  },
})
```

장점:

- ✅ 완전한 TypeScript 지원
- ✅ Zod를 사용한 런타임 검증
- ✅ 재사용 가능한 NPM 패키지
- ✅ 쉬운 유지보수

## 실제 사용 사례

이 라이브러리는 Vercel 배포를 위한 브랜치별 환경 관리가 필요했던 실제 운영 프로젝트(DAYBEAU-ADMIN-FE)에서 추출되었습니다.

## 기여하기

기여를 환영합니다! 먼저 [기여 가이드라인](./CONTRIBUTING.md)을 읽어주세요.

## 라이선스

MIT © 202021042khj

## 개발 & 기여

### 브랜치 전략

이 프로젝트는 **GitHub Flow** 브랜칭 모델을 따릅니다:

- `main`: 운영 준비 완료 코드, 항상 배포 가능
- `feature/*`, `fix/*`, `chore/*`: 특정 변경을 위한 단기 브랜치

**워크플로우**:

1. `main`에서 feature 브랜치 생성
2. 변경 사항 작성 및 커밋
3. changeset 생성: `pnpm changeset`
4. 푸시 후 Pull Request 생성
5. PR이 병합되면 Changesets Action이 "Version Packages" PR 생성
6. Version PR을 병합하면 자동으로 npm에 배포

### Changeset 생성

배포해야 할 변경 사항이 있을 때:

```bash
pnpm changeset
```

변경된 패키지, 버전 증가 타입(major/minor/patch), 요약을 선택합니다.

### 배포 프로세스

이 프로젝트는 자동 버전 관리와 배포를 위해 [Changesets](https://github.com/changesets/changesets)를 사용합니다:

1. **개발**: feature 브랜치를 생성하고 변경 사항 작성
2. **Changeset**: `pnpm changeset`을 실행하여 변경 사항 문서화
3. **PR**: `main`에 Pull Request 생성
4. **자동 버전 관리**: PR이 병합되면 Changesets가 "Version Packages" PR 생성/업데이트
5. **배포**: Version PR을 병합하면 자동으로 npm에 배포

### 로컬 개발

```bash
# 의존성 설치
pnpm install

# 모든 패키지 빌드
pnpm build

# 테스트 실행
pnpm test

# 린트 & 포맷
pnpm lint
pnpm format
```

## 링크

- [문서](./docs/guide.md)
- [예제](./examples)
- [이슈](https://github.com/202021042khj/vercel-env-router/issues)
- [변경 로그](./CHANGELOG.md)
