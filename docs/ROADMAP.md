# Invoice Web Viewer 고도화 로드맵 (v2.0)

MVP 완성 이후 UX 개선과 브랜드 일관성 강화를 위한 고도화 작업 계획입니다.

---

## 개요

Invoice Web Viewer MVP(v1.0)는 16개 작업을 통해 핵심 기능을 완성했습니다.
이번 고도화(v2.0)에서는 다음 세 가지 영역을 집중 개선합니다.

- **네비게이션 개선**: 관리자 대시보드의 목록 복귀 버튼 추가로 워크플로우 효율화
- **클라이언트 UX 개선**: 견적서 뷰어의 닫기 버튼 추가로 사용자 이탈 경로 명확화
- **브랜드 컬러 통일**: 터키색(#00A8A8) 기반으로 전체 화면 색상 체계 통합

### 현재 상태 (v1.0 완료 기준)

| 구분      | 상태   | 비고                          |
| --------- | ------ | ----------------------------- |
| MVP 전체  | 완료   | TASK-001 ~ TASK-016 모두 완료 |
| 배포 준비 | 완료   | Vercel 배포 가이드 작성 완료  |
| 고도화    | 미시작 | 이 로드맵에서 정의            |

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `017-close-button.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함
   - 기존 완료 작업(예: `016-deployment.md`)을 예시로 참조하되, 새 작업 파일은 빈 박스로 시작

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 각 단계 후 작업 파일 내 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 체크박스(완료)로 표시

---

## 개발 단계

---

### Phase 5: 네비게이션 및 UX 개선

MVP에서 누락된 사용자 이동 경로를 보완하고, 클라이언트 뷰어에 종료 수단을 제공합니다.
두 Task는 서로 독립적이므로 병렬 진행이 가능합니다.

---

- **Task 017: 관리자 대시보드 상세페이지 목록 복귀 버튼 추가** - 우선순위
  - 작업 파일: `/tasks/017-dashboard-back-button.md`
  - 예상 소요 시간: 2~4시간

  **배경**

  현재 관리자는 대시보드에서 견적서 미리보기([링크 복사] 또는 미리보기 아이콘)를 클릭하면
  `/view/[slug]` 페이지로 이동하지만 목록으로 돌아오는 명시적 UI가 없습니다.
  브라우저 뒤로가기에만 의존하는 상황이므로, 상단 헤더 바에 "목록으로" 버튼을 추가합니다.

  **수정 대상 파일**
  - `src/components/invoice/header-bar.tsx` — 버튼 추가 (조건부 렌더링)
  - `src/app/view/[slug]/page.tsx` — 관리자 접근 판별을 위한 `searchParams` 또는 `referrer` 처리
  - `src/components/admin/link-manager.tsx` — 미리보기 링크에 `?from=dashboard` 쿼리 파라미터 추가

  **구현 사항**
  - URL 쿼리 파라미터(`?from=dashboard`)로 관리자 진입 여부 판별
  - `HeaderBar` 컴포넌트에 `showBackButton?: boolean` 및 `backHref?: string` Props 추가
  - "목록으로" 버튼: 좌측 영역에 `ChevronLeft` 아이콘 + 텍스트로 구성
  - 버튼 스타일: 기존 헤더 버튼과 동일한 `variant="outline"` + 헤더 색상 기준 적용
  - 모바일에서는 아이콘만 표시, 데스크톱에서는 텍스트 함께 표시
  - 인쇄 모드에서는 숨김 처리(`print:hidden`)

  **수락 기준**
  - [ ] 미리보기 링크 클릭 시 `/view/[slug]?from=dashboard` 형태로 이동
  - [ ] 뷰어 페이지 헤더에 "목록으로" 버튼이 좌측에 표시됨
  - [ ] 버튼 클릭 시 `/dashboard`로 이동
  - [ ] `?from=dashboard` 없이 접근(클라이언트 일반 접근)한 경우 버튼 미표시
  - [ ] 인쇄 및 PDF 생성 시 버튼이 포함되지 않음
  - [ ] 모바일 반응형 정상 동작

---

- **Task 018: 견적서 뷰어 초기화면 닫기 버튼 추가**
  - 작업 파일: `/tasks/018-viewer-close-button.md`
  - 예상 소요 시간: 2~4시간

  **배경**

  클라이언트가 견적서(`/view/[slug]`)를 확인한 후 페이지를 닫으려면 브라우저 탭을 직접 닫거나
  뒤로가기를 사용해야 합니다. 명시적인 "닫기" 버튼을 제공하여 사용자가 페이지를 쉽게 벗어날 수
  있도록 합니다.

  **수정 대상 파일**
  - `src/components/invoice/header-bar.tsx` — 닫기 버튼 추가
  - (선택) `src/components/invoice/invoice-viewer.tsx` — 닫기 버튼 Props 전달

  **구현 사항**
  - `HeaderBar` 우측 버튼 그룹에 "닫기" 버튼 추가 (`X` 아이콘, `lucide-react`의 `X`)
  - 닫기 동작: `window.history.length > 1` 이면 `window.history.back()`, 아니면 `window.close()`
  - 버튼 스타일: `variant="outline"` + 기존 헤더 버튼과 동일한 색상 처리
  - 모바일: 아이콘만 + 툴팁("닫기"), 데스크톱: 아이콘 + "닫기" 텍스트
  - 인쇄 모드에서 숨김 처리(`print:hidden`)
  - `?from=dashboard`로 진입한 경우 닫기 버튼 대신 "목록으로" 버튼 표시 (Task 017과 중복 방지)

  **수락 기준**
  - [ ] 뷰어 헤더 우측에 "닫기" 버튼이 표시됨
  - [ ] 버튼 클릭 시 이전 페이지로 이동하거나 탭을 닫음
  - [ ] `?from=dashboard`로 진입한 경우 닫기 버튼이 표시되지 않음 (목록으로 버튼이 대체)
  - [ ] 인쇄 및 PDF 생성 시 버튼이 포함되지 않음
  - [ ] 모바일 반응형 정상 동작

---

### Phase 6: 브랜드 컬러 통일

견적서 뷰어의 헤더 색상(터키색/틸, `#00A8A8`)을 홈 화면과 관리자 대시보드에도 적용하여
전체 서비스의 색상 체계를 통일합니다.

> 헤더 글꼴 색상은 항상 흰색(`#FFFFFF`)으로 고정합니다.

---

- **Task 019: Tailwind CSS 브랜드 컬러 토큰 정의** - 우선순위
  - 작업 파일: `/tasks/019-brand-color-tokens.md`
  - 예상 소요 시간: 1~2시간
  - Task 020, Task 021의 선행 작업

  **배경**

  현재 색상이 파일마다 하드코딩(`bg-blue-600`, `bg-primary/95`, `bg-slate-50` 등)되어 있어
  일괄 변경이 어렵습니다. Tailwind CSS v4 CSS 변수 기반 토큰을 정의하여 단일 지점에서 관리합니다.

  **수정 대상 파일**
  - `src/app/globals.css` — CSS 변수 및 Tailwind 커스텀 토큰 정의

  **구현 사항**
  - `--color-brand-primary: #00A8A8` (터키색/틸) 정의
  - `--color-brand-primary-foreground: #FFFFFF` (헤더 텍스트 흰색) 정의
  - `--color-brand-primary-hover: #008080` (호버 시 약간 어두운 틸) 정의
  - `--color-brand-primary-border: #007A7A` (테두리 색상) 정의
  - `--color-brand-surface: #F0FAFA` (틸 계열 배경 서피스) 정의
  - Tailwind 유틸리티 클래스 매핑: `bg-brand`, `text-brand`, `border-brand` 등
  - 기존 `primary` 색상 토큰을 터키색으로 업데이트 (`src/app/globals.css` `:root` 블록)

  **수락 기준**
  - [ ] `globals.css`에 브랜드 컬러 CSS 변수가 정의됨
  - [ ] `bg-primary`, `text-primary-foreground` 등의 기존 유틸리티 클래스가 터키색으로 매핑됨
  - [ ] `npm run build` 및 `npm run type-check` 통과
  - [ ] 기존 견적서 뷰어 헤더 색상이 터키색으로 자동 반영됨 (기존 코드 변경 없이)

---

- **Task 020: 홈 화면 색상 통일 (터키색 적용)**
  - 작업 파일: `/tasks/020-home-color-update.md`
  - 선행 작업: Task 019
  - 예상 소요 시간: 2~3시간

  **배경**

  홈 화면(`/`, `src/app/page.tsx`)은 현재 `bg-white`, `text-slate-*` 계열로만 구성되어
  견적서 뷰어의 터키색 헤더와 시각적 연속성이 없습니다.

  **수정 대상 파일**
  - `src/app/page.tsx` — 헤더 및 카드 강조 색상 업데이트

  **구현 사항**
  - 우측 상단 "관리자 대시보드" 링크 버튼: 배경을 `bg-[#00A8A8]`, 텍스트를 `text-white`로 변경
  - 섹션 타이틀(`견적서 조회 시스템`) 강조: `text-[#00A8A8]` 또는 언더라인 액센트 적용
  - 카드 아이콘 색상: `text-slate-700` → `text-[#00A8A8]`
  - 카드 호버 테두리: `hover:border-[#00A8A8]` 추가하여 브랜드 컬러 강조
  - 페이지 배경은 `bg-white` 유지 (컨텐츠 가독성 보장)

  **수락 기준**
  - [ ] 홈 화면의 주요 액션 버튼이 터키색 배경으로 표시됨
  - [ ] 헤더/아이콘 강조 요소가 터키색 계열로 통일됨
  - [ ] 흰색 배경 유지, 가독성 저해 없음
  - [ ] 모바일 반응형 정상 동작
  - [ ] `npm run build` 및 `npm run lint` 통과

---

- **Task 021: 관리자 대시보드 색상 통일 (터키색 적용)**
  - 작업 파일: `/tasks/021-dashboard-color-update.md`
  - 선행 작업: Task 019
  - 예상 소요 시간: 3~4시간

  **배경**

  관리자 대시보드(`/dashboard`)의 헤더는 현재 `bg-white border-b border-slate-200` 계열로
  견적서 뷰어의 터키색 헤더와 전혀 다른 외관을 가집니다. 동일한 서비스임을 시각적으로 전달하기 위해
  대시보드 헤더를 터키색으로 통일합니다.

  **수정 대상 파일**
  - `src/components/admin/dashboard-header.tsx` — 헤더 배경 및 텍스트 색상 변경
  - `src/app/dashboard/page.tsx` — 페이지 배경 색상 조정
  - `src/components/admin/login-form.tsx` — 로그인 페이지 강조 색상 적용 (선택)

  **구현 사항**

  대시보드 헤더(`DashboardHeader`):
  - 헤더 배경: `bg-white border-b border-slate-200` → `bg-[#00A8A8]`
  - 헤더 텍스트: `text-slate-900` → `text-white`
  - 서브텍스트: `text-slate-500` → `text-white/70`
  - 아이콘 래퍼(`bg-blue-600`) → `bg-white/20` (반투명 흰색으로 대비 확보)
  - 아이콘 색상: `text-white` 유지
  - 로그아웃 버튼: `border-slate-300 text-slate-600` → `border-white/40 text-white hover:bg-white/10 hover:text-white`

  페이지 배경(`DashboardPage`):
  - `bg-slate-50` → `bg-[#F0FAFA]` (틸 계열 연한 배경으로 통일감 강화, Task 019 토큰 활용)
  - 섹션 타이틀(`견적서 목록`): `text-slate-900` 유지 (본문 가독성)

  로그인 페이지(`login-form.tsx`) - 선택 적용:
  - 로그인 버튼 배경: `bg-[#00A8A8] hover:bg-[#008080]`
  - 카드 상단 강조 요소(로고, 아이콘 등)에 터키색 적용

  **수락 기준**
  - [ ] 관리자 대시보드 헤더 배경이 터키색(`#00A8A8`)으로 표시됨
  - [ ] 헤더 내 모든 텍스트가 흰색(`#FFFFFF`)으로 표시됨
  - [ ] 로그아웃 버튼이 헤더 색상에 맞게 스타일 적용됨
  - [ ] 페이지 본문 배경이 틸 계열 연한 색상으로 변경됨
  - [ ] 모바일 반응형 정상 동작
  - [ ] `npm run build`, `npm run lint`, `npm run type-check` 모두 통과

---

### Phase 7: 통합 검증 및 마무리

Phase 5~6의 모든 변경사항을 종합 검증하고 배포 준비를 완료합니다.

---

- **Task 022: 전체 UI 통합 테스트 및 회귀 검증**
  - 작업 파일: `/tasks/022-integration-test.md`
  - 선행 작업: Task 017, 018, 019, 020, 021
  - 예상 소요 시간: 2~3시간

  **구현 사항**
  - 전체 사용자 플로우 시나리오 수동 검증
  - 클라이언트 여정: 홈 → 견적서 뷰어 → 닫기
  - 관리자 여정: 대시보드 → 미리보기 → 목록으로
  - 인쇄/PDF 생성 시 추가된 버튼들이 포함되지 않는지 확인
  - 색상 통일성 크로스브라우저 확인 (Chrome, Safari, Firefox)
  - 모바일 반응형 검증 (360px, 768px, 1280px 기준)
  - `npm run check-all` 통과 확인
  - `npm run build` 프로덕션 빌드 성공 확인

  **테스트 체크리스트**

  클라이언트 플로우:
  - [ ] 홈(`/`) 접근 → 터키색 버튼 및 아이콘 정상 표시
  - [ ] 견적서 뷰어(`/view/[slug]`) 직접 접근 → "닫기" 버튼 표시, "목록으로" 버튼 미표시
  - [ ] "닫기" 버튼 클릭 → 이전 페이지로 이동 또는 탭 닫기
  - [ ] 인쇄 미리보기 → "닫기", "목록으로" 버튼 미포함 확인
  - [ ] PDF 다운로드 → 버튼 영역 미포함 확인

  관리자 플로우:
  - [ ] 대시보드(`/dashboard`) 접근 → 터키색 헤더 정상 표시, 흰색 텍스트 확인
  - [ ] 미리보기 클릭 → `/view/[slug]?from=dashboard`로 이동 확인
  - [ ] 뷰어 헤더에 "목록으로" 버튼 표시, "닫기" 버튼 미표시 확인
  - [ ] "목록으로" 클릭 → `/dashboard`로 이동 확인

  반응형:
  - [ ] 모바일(360px): 모든 헤더 버튼 아이콘만 표시, 툴팁 정상 동작
  - [ ] 태블릿(768px): 텍스트+아이콘 조합 정상 표시
  - [ ] 데스크톱(1280px): 전체 레이아웃 이상 없음

  빌드 및 품질:
  - [ ] `npm run lint` 통과 (경고 없음)
  - [ ] `npm run type-check` 통과
  - [ ] `npm run build` 성공
  - [ ] Lighthouse 접근성 점수 이전 수준 유지

---

## 작업 요약

| Task     | 제목                                | Phase   | 예상 소요 시간 | 선행 작업    |
| -------- | ----------------------------------- | ------- | -------------- | ------------ |
| Task 017 | 관리자 대시보드 목록 복귀 버튼 추가 | Phase 5 | 2~4시간        | 없음         |
| Task 018 | 견적서 뷰어 닫기 버튼 추가          | Phase 5 | 2~4시간        | 없음         |
| Task 019 | 브랜드 컬러 토큰 정의               | Phase 6 | 1~2시간        | 없음         |
| Task 020 | 홈 화면 색상 통일                   | Phase 6 | 2~3시간        | Task 019     |
| Task 021 | 관리자 대시보드 색상 통일           | Phase 6 | 3~4시간        | Task 019     |
| Task 022 | 전체 UI 통합 테스트 및 회귀 검증    | Phase 7 | 2~3시간        | 017~021 전체 |

**총 예상 소요 시간**: 12~20시간 (약 2~3일)

---

## 주요 수정 파일 참조

```
src/
├── app/
│   ├── page.tsx                                  # Task 020
│   ├── dashboard/page.tsx                        # Task 021
│   └── view/[slug]/page.tsx                      # Task 017
├── components/
│   ├── invoice/
│   │   └── header-bar.tsx                        # Task 017, 018
│   └── admin/
│       ├── dashboard-header.tsx                  # Task 021
│       ├── link-manager.tsx                      # Task 017
│       └── login-form.tsx                        # Task 021 (선택)
└── app/
    └── globals.css                               # Task 019
```

---

## 이전 로드맵 참조

v1.0 로드맵 (Phase 1~4, 16개 Task 완료): `docs/roadmaps/ROADMAP_v1.md`

---

**작성일**: 2026-03-16
**버전**: v2.0
**대상 브랜치**: `feature/v2-enhancement`
