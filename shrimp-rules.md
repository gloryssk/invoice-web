# AI 에이전트 개발 표준 가이드

## 프로젝트 개요

**프로젝트명**: Invoice Web Viewer

**목적**: 노션 기반 견적서를 웹에서 조회하고 관리하는 애플리케이션

**기술 스택**:

- Framework: Next.js 15.5.3 (App Router + Turbopack)
- Runtime: React 19.1.0 + TypeScript 5
- Styling: TailwindCSS v4 + shadcn/ui (new-york style)
- Forms: React Hook Form + Zod (계획)
- State: Zustand (계획)
- UI: Radix UI + Lucide Icons
- Development: ESLint 9 + Prettier + Husky + lint-staged

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
invoice-web/
├── src/
│   ├── app/                    # Next.js App Router (페이지, 레이아웃)
│   │   ├── layout.tsx          # 루트 레이아웃 (모든 페이지에 적용)
│   │   ├── page.tsx            # 홈페이지
│   │   └── [동적라우트]/       # 동적 라우팅
│   │
│   ├── components/             # 재사용 가능한 React 컴포넌트
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   │   ├── header.tsx      # 상단 헤더
│   │   │   ├── footer.tsx      # 하단 푸터
│   │   │   └── container.tsx   # 컨테이너 래퍼
│   │   │
│   │   └── providers/          # Context/Provider 컴포넌트
│   │       └── theme-provider.tsx
│   │
│   ├── lib/                    # 유틸리티 함수 및 설정
│   │   ├── utils.ts            # 공통 유틸리티
│   │   ├── env.ts              # 환경 변수 검증
│   │   └── ...
│   │
│   ├── hooks/                  # React 커스텀 훅 (향후 추가)
│   ├── stores/                 # Zustand 상태관리 (향후 추가)
│   ├── services/               # API 호출, 외부 서비스 (향후 추가)
│   ├── types/                  # TypeScript 타입 정의
│   └── globals.css             # 글로벌 스타일
│
├── docs/                       # 프로젝트 문서
│   ├── PRD.md                  # 제품 요구사항 문서
│   └── guides/                 # 개발 가이드
│       ├── project-structure.md
│       ├── styling-guide.md
│       ├── component-patterns.md
│       ├── forms-react-hook-form.md
│       └── nextjs-15.md
│
├── public/                     # 정적 자산 (이미지, 폰트 등)
├── .vscode/                    # VS Code 설정
├── next.config.ts              # Next.js 설정
├── tsconfig.json               # TypeScript 설정
├── tailwind.config.ts          # Tailwind CSS 설정
├── eslint.config.mjs           # ESLint 설정
├── .prettierrc                 # Prettier 설정
├── CLAUDE.md                   # Claude Code 개발 지침 (사용자용)
├── shrimp-rules.md             # AI 에이전트 표준 (AI용) ← 이 파일
└── package.json                # NPM 의존성
```

### 모듈 분류

- **Page Components** (`src/app/*/page.tsx`): 페이지 레벨 컴포넌트, 클라이언트/서버 컴포넌트 혼합 가능
- **Layout Components** (`src/components/layout/*`): 레이아웃 공통 컴포넌트, 모든 페이지에서 재사용
- **UI Components** (`src/components/ui/*`): shadcn/ui 기반 저수준 UI 컴포넌트, 스타일링만 담당
- **Feature Components** (`src/components/*`): 특정 기능 전용 컴포넌트 (향후 추가)
- **Providers** (`src/components/providers/*`): Context/Provider 컴포넌트, 상태 관리 및 설정
- **Hooks** (`src/hooks/*`): React 커스텀 훅 (향후 추가)
- **Stores** (`src/stores/*`): Zustand 상태관리 (향후 추가)
- **Services** (`src/services/*`): API 호출, 데이터 처리 (향후 추가)
- **Types** (`src/types/*`): TypeScript 인터페이스/타입 정의 (향후 추가)

---

## 코드 표준

### 네이밍 규칙

| 대상                  | 규칙                           | 예제                                                |
| --------------------- | ------------------------------ | --------------------------------------------------- |
| 변수                  | camelCase                      | `invoiceList`, `userEmail`, `isLoading`             |
| 함수                  | camelCase (동사로 시작)        | `getInvoice()`, `calculateTotal()`, `handleClick()` |
| React 컴포넌트        | PascalCase                     | `InvoiceCard`, `UserProfile`, `Header`              |
| 상수                  | UPPER_SNAKE_CASE               | `MAX_FILE_SIZE`, `API_TIMEOUT`                      |
| 파일명 (컴포넌트)     | kebab-case                     | `invoice-card.tsx`, `user-profile.tsx`              |
| 파일명 (유틸리티)     | kebab-case 또는 camelCase      | `format-date.ts` 또는 `formatDate.ts`               |
| 디렉토리명            | kebab-case                     | `src/components/ui/`, `src/lib/`                    |
| TypeScript 인터페이스 | I + PascalCase 또는 PascalCase | `IUser` 또는 `User` (권장: PascalCase)              |
| TypeScript 타입       | PascalCase                     | `UserType`, `InvoiceStatus`                         |

### 포매팅 규칙

- **들여쓰기**: 2칸 스페이스
- **Line Length**: 80자 (Prettier 기본값)
- **Quote**: 큰따옴표 (")
- **세미콜론**: 필수
- **Trailing Comma**: ES5 스타일

### 주석 규칙

- **언어**: 한국어
- **패턴**: 각 코드 블록마다 역할 설명
- **위치**: 코드 위에 배치
- **형식**:

  ```typescript
  // 설명하는 주석
  const variable = value

  // 함수의 전체 구조를 먼저 개요로 작성
  // 1. 데이터 검증
  // 2. 변환 처리
  // 3. 결과 반환
  function processData(input: string) {
    // 1. 데이터 검증
    if (!input) throw new Error('Invalid input')

    // 2. 변환 처리
    const result = input.toUpperCase()

    // 3. 결과 반환
    return result
  }
  ```

### TypeScript 규칙

- **any 타입 금지**: 항상 구체적인 타입 사용
- **암시적 any 금지**: `noImplicitAny: true`
- **타입 검사 엄격**: `strict: true`

---

## 코드 구현 표준

### React 컴포넌트 패턴

#### 1. 클라이언트 컴포넌트 (클릭, 상태 관리 등)

```typescript
'use client';  // 반드시 상단에 선언

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: ComponentProps) {
  // 1. 상태 선언
  const [isOpen, setIsOpen] = useState(false);

  // 2. 핸들러 함수
  const handleClick = () => {
    setIsOpen(!isOpen);
    onAction?.();
  };

  // 3. 렌더링
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>클릭</Button>
    </div>
  );
}
```

#### 2. 서버 컴포넌트 (async 컴포넌트)

```typescript
// 'use client' 선언 없음

import { db } from '@/lib/db';

interface PageProps {
  params: { id: string };
}

export default async function InvoicePage({ params }: PageProps) {
  // 1. 서버 데이터 페칭
  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
  });

  // 2. 에러 처리
  if (!invoice) return <div>견적서를 찾을 수 없습니다.</div>;

  // 3. 렌더링
  return (
    <div>
      <h1>{invoice.title}</h1>
      <p>{invoice.description}</p>
    </div>
  );
}
```

#### 3. Props 검증

```typescript
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Container({
  children,
  className = '',
  maxWidth = 'lg',
}: ContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  return (
    <div className={`mx-auto ${maxWidthClass} ${className}`}>
      {children}
    </div>
  );
}
```

### Next.js App Router 패턴

#### 1. 레이아웃 구조

```typescript
// src/app/layout.tsx
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Invoice Web Viewer',
  description: '노션 기반 견적서 관리 애플리케이션',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 2. 동적 라우트

```typescript
// src/app/invoices/[id]/page.tsx
interface InvoicePageProps {
  params: { id: string };
  searchParams: { tab?: string };
}

export default async function InvoicePage({
  params,
  searchParams,
}: InvoicePageProps) {
  const invoice = await fetchInvoice(params.id);
  return <InvoiceDetail invoice={invoice} tab={searchParams.tab} />;
}

// generateStaticParams는 정적 생성을 위해 필요시 추가
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
```

### shadcn/ui 컴포넌트 사용

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export function InvoiceForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>견적서 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="견적서 제목" />
        <Button className="mt-4">저장</Button>
      </CardContent>
    </Card>
  );
}
```

### Tailwind CSS 사용

```typescript
// ✅ DO: Utility classes 조합
<div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
  <h2 className="text-lg font-semibold text-gray-900">제목</h2>
  <span className="text-sm text-gray-500">부제목</span>
</div>

// ✅ DO: 반응형 클래스
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} />)}
</div>

// ❌ DON'T: 인라인 스타일
<div style={{ color: 'red', fontSize: '16px' }}>텍스트</div>

// ❌ DON'T: 커스텀 CSS 클래스 (shadcn/ui 있으면 사용)
<style>{`.custom { color: red; }`}</style>
```

---

## 프레임워크/라이브러리 사용 표준

### Next.js 15.5.3

- **App Router 필수**: Pages Router 사용 금지
- **Server Components 권장**: 기본적으로 서버 컴포넌트, 필요시 `'use client'`
- **동적 임포트**: 무거운 컴포넌트는 `dynamic()` 사용
- **환경 변수**: `.env.local` 파일 사용, `NEXT_PUBLIC_` 프리픽스로 공개 변수 표시

### React 19

- **함수형 컴포넌트**: 클래스형 컴포넌트 금지
- **Hooks 필수**: useState, useEffect, useContext 등 활용
- **Key Props**: 리스트 렌더링시 고유한 key 필수

### TailwindCSS v4

- **Utility-First**: 커스텀 CSS 최소화
- **@apply 권장**: 반복되는 스타일 패턴은 @apply로 정의
- **config 사용**: 프로젝트 컬러, 글꼴 등은 tailwind.config.ts에 정의

### shadcn/ui

- **컴포넌트 추가**: `npx shadcn@latest add [component-name]`
- **커스터마이징**: 필요시 `src/components/ui/` 파일 직접 수정
- **Radix UI 기반**: 접근성 고려된 컴포넌트 사용

### Lucide Icons

```typescript
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// 사용 예
<Button variant="ghost" size="sm">
  <AlertCircle className="h-4 w-4" />
  경고
</Button>
```

### ESLint + Prettier

- **린트 검사**: `npm run lint`
- **포맷 검사**: `npm run format:check`
- **자동 수정**: `npm run lint:fix && npm run format`
- **Pre-commit Hook**: Husky + lint-staged로 커밋 전 자동 검사

---

## 워크플로우 표준

### 개발 워크플로우

1. **브랜치 생성**

   ```bash
   git checkout -b feature/기능명
   # 또는
   git checkout -b bugfix/버그명
   ```

2. **개발 진행**

   ```bash
   npm run dev  # Turbopack 개발 서버 실행
   ```

3. **코드 작성**
   - 파일 수정 또는 생성
   - 한국어 주석 추가
   - 타입 정의 완료

4. **검사 및 포맷**

   ```bash
   npm run check-all  # 모든 검사 통합 실행
   # 또는 개별 실행
   npm run lint       # ESLint 검사
   npm run typecheck  # TypeScript 타입 검사
   npm run format     # Prettier 포맷
   ```

5. **빌드 확인**

   ```bash
   npm run build  # 프로덕션 빌드 성공 확인
   ```

6. **커밋**

   ```bash
   git add .
   git commit -m "✨ feat: 기능명 구현"
   # 커밋 메시지: 한글로 작성, 이모지 포함 권장
   ```

7. **푸시 및 PR**
   ```bash
   git push origin feature/기능명
   # GitHub에서 Pull Request 생성
   ```

### 커밋 메시지 규칙

**형식**: `[이모지] [타입]: [한글 설명]`

| 이모지 | 타입     | 설명                    | 예시                               |
| ------ | -------- | ----------------------- | ---------------------------------- |
| ✨     | feat     | 새 기능 추가            | `✨ feat: 견적서 목록 페이지 구현` |
| 🐛     | fix      | 버그 수정               | `🐛 fix: 폼 제출 오류 해결`        |
| 🔧     | chore    | 빌드, 의존성, 설정 변경 | `🔧 chore: ESLint 설정 추가`       |
| 📝     | docs     | 문서 추가/수정          | `📝 docs: README 업데이트`         |
| ♻️     | refactor | 코드 리팩토링           | `♻️ refactor: 컴포넌트 구조 개선`  |
| ✅     | test     | 테스트 추가             | `✅ test: 버튼 컴포넌트 테스트`    |
| 🎨     | style    | 스타일 변경             | `🎨 style: 헤더 레이아웃 조정`     |

---

## 핵심 파일 상호작용 표준

### 파일 수정시 함께 수정해야 할 파일

| 수정 파일                 | 함께 수정할 파일                    | 이유                               |
| ------------------------- | ----------------------------------- | ---------------------------------- |
| `src/app/layout.tsx`      | `CLAUDE.md`                         | 레이아웃 구조 변경시 문서 업데이트 |
| `src/components/ui/*.tsx` | `docs/guides/component-patterns.md` | shadcn/ui 컴포넌트 추가/변경시     |
| `next.config.ts`          | `CLAUDE.md` (필요시)                | Next.js 설정 변경시                |
| `package.json`            | `CLAUDE.md` (기술 스택 변경)        | 의존성 추가/삭제시                 |
| 새 페이지 추가            | `docs/guides/project-structure.md`  | 프로젝트 구조 변경시               |

### 환경 변수

- **위치**: `.env.local` (Git 무시)
- **공개 변수**: `NEXT_PUBLIC_` 프리픽스 사용
- **예시**:
  ```
  # .env.local
  NEXT_PUBLIC_API_URL=https://api.example.com
  NOTION_API_KEY=your-secret-key
  ```

---

## AI 의사결정 기준

### 1. 컴포넌트 생성/수정 결정

**클라이언트 컴포넌트 필요한 경우**:

- 상태(useState) 사용
- 이벤트 핸들러(onClick, onChange 등)
- Context 사용
- 클라이언트 훅(useEffect, useRef 등)

**서버 컴포넌트 사용 권장**:

- 데이터베이스 직접 접근
- 보안 정보 처리
- 대용량 데이터 처리
- 초기 렌더링

### 2. 폴더/파일 위치 결정

```
특정 페이지에만 사용되는 컴포넌트
→ 해당 페이지 디렉토리 내부 (src/app/invoices/invoice-card.tsx)

여러 페이지에서 재사용되는 컴포넌트
→ src/components/ 또는 src/components/layout/

shadcn/ui 제공 컴포넌트
→ src/components/ui/

유틸리티 함수
→ src/lib/

타입 정의
→ src/types/ (향후 추가)

커스텀 훅
→ src/hooks/ (향후 추가)

상태관리
→ src/stores/ (향후 추가)
```

### 3. 의존성 추가 결정

**추가 가능한 라이브러리**:

- UI: shadcn/ui 컴포넌트들
- Forms: React Hook Form, Zod (계획)
- State: Zustand (계획)
- API: axios, fetch (필요시)
- 유틸: lodash, date-fns (필요시)

**추가 불가능한 라이브러리**:

- 대체 가능한 라이브러리 (예: emotion vs Tailwind)
- 미지원 라이브러리 (예: IE11 전용)

---

## 금지된 행동

### ❌ 코드 작성

- **any 타입 사용**: `const value: any = ...` → 구체적인 타입 사용
- **인라인 스타일**: `style={{ color: 'red' }}` → Tailwind 클래스 사용
- **Pages Router**: `pages/` 디렉토리 사용 → App Router 사용
- **클래스형 컴포넌트**: `class MyComponent extends React.Component` → 함수형 사용
- **커스텀 CSS**: `<style>` 태그 → Tailwind/shadcn 사용
- **console.log 남김**: 프로덕션 코드에 디버깅 문구 남기기
- **주석 없는 복잡 로직**: 역할 설명 주석 없음

### ❌ 파일 관리

- **영어 주석**: 코드 주석은 항상 한국어
- **camelCase 파일명**: 컴포넌트는 PascalCase 파일명 사용
- **깊은 중첩**: 3단계 이상 폴더 중첩 (특수한 경우 제외)
- **순환 참조**: import A에서 B import, B에서 A import

### ❌ 커밋/PR

- **린트 미실행 커밋**: `npm run check-all` 통과 후 커밋
- **영어 커밋 메시지**: 항상 한글로 작성
- **커밋 메시지 없음**: 명확한 메시지 필수

### ❌ 패키지 의존성

- **불필요한 패키지 추가**: 신중한 검토 후 추가
- **버전 충돌**: 호환 가능한 버전 확인
- **불안정한 버전 (베타/알파)**: 안정된 버전 사용

### ❌ 보안

- **API 키 노출**: `.env.local`에 저장, Git 무시
- **민감 정보 클라이언트 코드**: 서버 컴포넌트/API 라우트에서 처리
- **CORS 우회**: 프록시 서버 또는 Next.js 미들웨어 사용

---

## 체크리스트

### 코드 작성 완료시

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공
- [ ] 한국어 주석 추가
- [ ] TypeScript 타입 완성 (any 타입 없음)
- [ ] 컴포넌트명 PascalCase 확인
- [ ] 변수명 camelCase 확인
- [ ] Tailwind 클래스 사용 (인라인 스타일 제거)

### 커밋 전

- [ ] 파일 스테이징: `git add .`
- [ ] 린트 검사: `npm run lint` 통과
- [ ] 커밋 메시지: 한글 + 이모지
- [ ] `git push origin [브랜치명]`

### PR 생성시

- [ ] PR 제목: 한글, 명확한 설명
- [ ] 설명: 변경 사항, 테스트 방법 기술
- [ ] 관련 이슈: 연결 (있으면)

---

**최종 수정일**: 2026-03-03
