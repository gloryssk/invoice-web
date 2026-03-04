# 노션 기반 견적서 웹 뷰어

노션에서 작성한 견적서를 클라이언트에게 전문적인 웹 인터페이스로 제공하고, PDF 저장 기능을 통해 공유 및 관리의 편의성을 높이는 웹 애플리케이션입니다.

## 프로젝트 개요

### 목적

- 노션 데이터베이스를 기반으로 견적서를 웹에서 조회 가능하게 함
- 클라이언트가 노션 계정 없이 간편하게 견적서 확인
- 관리자가 대시보드에서 모든 견적서를 한눈에 관리

### 핵심 기능

- **공개 견적서 뷰어** (`/view/:slug`): 누구나 접근 가능한 공개 링크
- **PDF 다운로드**: 웹 뷰어에서 한 번에 PDF로 저장
- **관리자 대시보드** (`/dashboard`): 패스워드 기반 인증으로 모든 견적서 관리
- **링크 공유**: 각 견적서의 공개 링크를 쉽게 복사하여 클라이언트에게 공유
- **반응형 디자인**: 모든 디바이스 (PC, 태블릿, 모바일)에 최적화

## 페이지 구조

```
루트 (/)
  ├─ 견적서 뷰어
  │   └─ /view/[slug]              공개 견적서 조회 및 PDF 다운로드
  │
  ├─ 관리자 영역
  │   ├─ /dashboard                인증 페이지 및 견적서 목록
  │   └─ /api/invoices             노션 API 동기화 (백엔드)
  │
  └─ 홈페이지 (/)
```

## 기술 스택

| 카테고리             | 기술            | 버전   |
| -------------------- | --------------- | ------ |
| **Framework**        | Next.js         | 15.5.3 |
| **Runtime**          | React           | 19.1.0 |
| **Language**         | TypeScript      | 5      |
| **Styling**          | TailwindCSS     | v4     |
| **UI Components**    | shadcn/ui       | latest |
| **Forms**            | React Hook Form | latest |
| **Validation**       | Zod             | latest |
| **State Management** | Zustand         | latest |
| **Icons**            | Lucide React    | latest |

## 설치 및 실행

### 사전 요구사항

- Node.js 18.17 이상
- npm 또는 yarn

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd invoice-web
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 설정합니다:

```env
# 노션 API 설정
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id

# 관리자 패스워드
ADMIN_PASSWORD=your_admin_password
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 앱이 실행됩니다.

## 주요 명령어

```bash
# 개발 서버 실행 (Turbopack)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 빌드 실행
npm start

# 모든 검사 실행 (린트, 타입체크, 포맷)
npm run check-all

# 린트 검사
npm run lint

# 타입체크
npm run type-check

# 포맷 (Prettier)
npm run format
```

## 개발 가이드

자세한 개발 가이드는 `docs/` 디렉토리를 참고하세요:

- **프로젝트 요구사항**: `@/docs/PRD.md` - 전체 기능 명세 및 개발 로드맵
- **프로젝트 구조**: `@/docs/guides/project-structure.md` - 폴더 및 파일 구조 가이드
- **스타일링 가이드**: `@/docs/guides/styling-guide.md` - TailwindCSS 및 Tailwind 규칙
- **컴포넌트 패턴**: `@/docs/guides/component-patterns.md` - 재사용 가능한 컴포넌트 작성 방법
- **Next.js 15 가이드**: `@/docs/guides/nextjs-15.md` - Next.js 15의 새로운 기능 및 모범 사례
- **폼 처리 가이드**: `@/docs/guides/forms-react-hook-form.md` - React Hook Form + Zod 사용 방법

## 코딩 규칙

### 언어 및 커뮤니케이션

- 코드 주석: 한국어
- 커밋 메시지: 한국어
- 변수명/함수명: 영어 (camelCase, PascalCase)

### 스타일 규칙

- 들여쓰기: 2칸 스페이스
- 린트: ESLint + Prettier (자동 포맷)
- 타입: TypeScript (any 타입 금지)

### Git 규칙

- 브랜치 이름: `feature/기능명`, `bugfix/버그명`, `hotfix/긴급수정`
- 커밋 전: `npm run lint` 실행 필수

## 프로젝트 상태

현재 프로젝트는 **MVP 개발 단계**입니다.

### 완료된 작업

- 프로젝트 초기 설정 및 개발 환경 구성
- 기본 페이지 및 레이아웃 구조
- 스타터 템플릿 정리

### 진행 예정

- Phase 1: 공개 견적서 뷰어 페이지 구현
- Phase 2: 관리자 대시보드 구현
- Phase 3: 노션 API 통합
- Phase 4: PDF 다운로드 기능
- Phase 5: 배포 및 최적화

## 배포

이 프로젝트는 [Vercel](https://vercel.com)에 배포되도록 최적화되어 있습니다.

1. 로컬 리포지토리를 GitHub에 푸시합니다.
2. Vercel 대시보드에서 프로젝트를 연결합니다.
3. 환경 변수를 설정합니다.
4. 배포합니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/deployment)를 참고하세요.

## 라이센스

MIT

## 지원

문제가 발생하거나 질문이 있으면 이슈를 생성해주세요.
