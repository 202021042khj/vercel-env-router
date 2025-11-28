# 개발 환경 설정 가이드

이 가이드는 로컬 개발을 위한 프로젝트 설정을 도와줍니다.

## 사전 요구사항

- Node.js >= 18
- pnpm >= 8

## 설치

### 1. pnpm 활성화

```bash
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

권한 문제가 발생하면 pnpm을 전역으로 설치하세요:

```bash
npm install -g pnpm@8.15.0
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 모든 패키지 빌드

```bash
pnpm build
```

다음 패키지들이 빌드됩니다:

- `@vercel-env-router/core`
- `@vercel-env-router/cli`
- `@vercel-env-router/vite`

### 4. 테스트 실행

```bash
pnpm test
```

커버리지와 함께:

```bash
pnpm test:coverage
```

### 5. 린트 및 포맷

```bash
# 린트
pnpm lint

# 린트 이슈 자동 수정
pnpm lint:fix

# 코드 포맷
pnpm format

# 포맷 확인
pnpm format:check
```

## 개발 워크플로우

### Core 패키지 작업

```bash
cd packages/core

# Watch 모드
pnpm dev

# 테스트 실행
pnpm test
```

### CLI 작업

```bash
cd packages/cli

# 빌드
pnpm build

# 로컬 테스트
node dist/index.js init
```

### Vite 플러그인 작업

```bash
cd packages/vite-plugin

# Watch 모드
pnpm dev
```

### 예제에서 테스트

```bash
cd examples/basic

# 의존성 설치 (로컬 패키지로 링크됨)
pnpm install

# CLI 테스트
pnpm vercel-env-router generate

# Vite 플러그인 테스트
pnpm dev
```

## 프로젝트 구조

```
vercel-env-router/
├── packages/
│   ├── core/              # 핵심 라이브러리
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   ├── cli/               # CLI 도구
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   └── vite-plugin/       # Vite 플러그인
│       ├── src/
│       ├── tests/
│       └── package.json
├── examples/              # 예제 프로젝트
│   ├── basic/
│   ├── multi-backend/
│   └── migration/
├── docs/                  # 문서
│   ├── guide.md
│   ├── api.md
│   ├── configuration.md
│   └── troubleshooting.md
└── .github/
    └── workflows/
        └── ci.yml         # GitHub Actions CI
```

## 일반 작업

### 새 의존성 추가

core 패키지의 경우:

```bash
cd packages/core
pnpm add zod
```

개발 의존성의 경우:

```bash
pnpm add -D vitest
```

### 새 테스트 생성

```bash
# 테스트 파일 생성
touch packages/core/tests/new-feature.test.ts

# 특정 테스트 실행
pnpm test new-feature
```

### 문서 업데이트

`docs/` 디렉토리의 파일을 수정하고 예제에서 확인하세요.

## 문제 해결

### pnpm을 찾을 수 없음

```bash
# corepack 재활성화
corepack enable

# 또는 전역 설치
npm install -g pnpm@8.15.0
```

### 빌드 오류

```bash
# 클린 및 재빌드
pnpm clean
pnpm install
pnpm build
```

### 테스트 실패

```bash
# 상세 출력으로 테스트 실행
pnpm test --reporter=verbose

# 특정 테스트 파일 실행
pnpm test generator.test.ts
```

## 다음 단계

설정 후:

1. [기여 가이드라인](./CONTRIBUTING.md) 읽기
2. [예제](./examples) 확인
3. [API 문서](./docs/api.md) 검토
4. 모든 것이 작동하는지 테스트 실행
