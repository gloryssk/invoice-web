# 🤖 Claude Code 개발 지침

**Invoice Web Viewer**는 노션 기반 견적서를 웹에서 조회하고 관리하는 애플리케이션입니다.

## 🎯 프로젝트 설명

노션에서 작성한 견적서를 클라이언트에게 전문적인 웹 인터페이스로 제공하고, PDF 저장 기능을 통해 공유 및 관리의 편의성을 높입니다.

자세한 요구사항은 [@/docs/PRD.md](./docs/PRD.md) 참조

## 🛠️ 핵심 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0 + TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **Forms**: React Hook Form + Zod + Server Actions
- **State Management**: Zustand
- **UI Components**: Radix UI + Lucide Icons
- **Development**: ESLint + Prettier + Husky + lint-staged

## 📚 개발 가이드

- **📋 프로젝트 요구사항**: `@/docs/PRD.md`
- **📁 프로젝트 구조**: `@/docs/guides/project-structure.md`
- **🎨 스타일링 가이드**: `@/docs/guides/styling-guide.md`
- **🧩 컴포넌트 패턴**: `@/docs/guides/component-patterns.md`
- **⚡ Next.js 15.5.3 전문 가이드**: `@/docs/guides/nextjs-15.md`
- **📝 폼 처리 완전 가이드**: `@/docs/guides/forms-react-hook-form.md`

## 📋 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 🎨 코딩 스타일

- **들여쓰기**: 2칸
- **네이밍**: camelCase, PascalCase (컴포넌트)
- **구조**: 전체 구조를 먼저 개요로 작성한 후 세부 구현
- **주석**: 각 코드 블록마다 역할 설명

## ⚡ 자주 사용하는 명령어

```bash
# 개발
npm run dev         # 개발 서버 실행 (Turbopack)
npm run build       # 프로덕션 빌드
npm run check-all   # 모든 검사 통합 실행 (권장)

# 검사
npm run lint        # 린트 검사
npm run type-check  # 타입체크
npm run format      # 코드 포맷

# UI 컴포넌트
npx shadcn@latest add button    # 새 컴포넌트 추가
```

## ✅ 작업 완료 체크리스트

```bash
npm run check-all   # 모든 검사 통과 확인
npm run build       # 빌드 성공 확인
```

## 🔧 Git 규칙

- **커밋 메시지**: 한글로 작성
- **브랜치명**: `feature/기능명`, `bugfix/버그명`, `hotfix/긴급수정` 등
- **Important**: 커밋 전에 반드시 린트 실행 (`npm run lint`)

## ⚙️ 기술 스택 사항

### 상태관리

- **Zustand**: 가볍고 간단한 상태 관리

### 폼 처리

- **React Hook Form + Zod**: 타입 안전한 폼 검증

### UI 컴포넌트

- **shadcn/ui**: 커스터마이저 가능한 React 컴포넌트
- **Radix UI**: 접근성 좋은 기반
- **Lucide Icons**: 간단하고 명확한 아이콘

### 그 외

- **any 타입 금지**: 항상 구체적인 타입 사용
- **컴포넌트 분리**: 재사용 가능하도록 설계
- **반응형 필수**: 모든 페이지는 반응형으로 구현

💡 **상세 규칙은 위 개발 가이드 문서들을 참조하세요**
