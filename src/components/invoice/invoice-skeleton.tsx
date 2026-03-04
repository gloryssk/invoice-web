/**
 * 견적서 뷰어 스켈레톤 로더 컴포넌트
 *
 * 견적서 데이터 로딩 중 표시되는 플레이스홀더 UI입니다.
 * 실제 견적서 레이아웃과 동일한 구조로 구성하여
 * 레이아웃 시프트(CLS)를 최소화합니다.
 *
 * 구조:
 * ┌─────────────────────────────────┐
 * │ 헤더 바 스켈레톤                │
 * ├─────────────────────────────────┤
 * │ 견적서 기본 정보 스켈레톤        │
 * │ 발행사 + 클라이언트 섹션 스켈레톤│
 * │ 항목 테이블 스켈레톤             │
 * │ 합계 섹션 스켈레톤              │
 * │ 추가 정보 스켈레톤              │
 * └─────────────────────────────────┘
 */

import { Skeleton } from '@/components/ui/skeleton'

// ============================================================
// 헤더 바 스켈레톤
// ============================================================

/**
 * 상단 헤더 바 영역 스켈레톤
 */
function HeaderBarSkeleton() {
  return (
    // 헤더 바와 동일한 높이/배경으로 스켈레톤 표시
    <div className="bg-primary/20 border-b border-blue-200 print:hidden">
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* 좌측: 로고 + 텍스트 */}
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="hidden h-3 w-32 sm:block" />
          </div>
        </div>
        {/* 우측: 버튼 영역 */}
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-8 w-16 sm:block" />
          <Skeleton className="h-8 w-8 sm:hidden" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 견적서 기본 정보 스켈레톤
// ============================================================

/**
 * 견적서 번호, 제목, 상태, 날짜 영역 스켈레톤
 */
function InvoiceHeaderSkeleton() {
  return (
    <section aria-label="견적서 정보 로딩 중" className="flex flex-col gap-4">
      {/* 제목 및 상태 배지 영역 */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          {/* 견적서 번호 */}
          <Skeleton className="h-4 w-28" />
          {/* 견적서 제목 */}
          <Skeleton className="h-8 w-64 sm:w-80" />
        </div>
        {/* 상태 배지 */}
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* 구분선 */}
      <Skeleton className="h-px w-full" />

      {/* 날짜 정보 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 발행사 + 클라이언트 섹션 스켈레톤
// ============================================================

/**
 * 발행사 정보 스켈레톤
 */
function IssuerSkeleton() {
  return (
    <section aria-label="발행사 정보 로딩 중" className="flex flex-col gap-4">
      {/* 회사명 및 로고 */}
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-xl" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>
      {/* 연락처 목록 */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-36" />
      </div>
    </section>
  )
}

/**
 * 클라이언트 정보 스켈레톤
 */
function ClientSkeleton() {
  return (
    <section
      aria-label="클라이언트 정보 로딩 중"
      className="flex flex-col gap-3"
    >
      {/* 섹션 레이블 */}
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-3.5 w-12" />
      </div>
      {/* 클라이언트 상세 */}
      <div className="flex flex-col gap-2 pl-10">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-28" />
      </div>
    </section>
  )
}

// ============================================================
// 항목 테이블 스켈레톤
// ============================================================

/**
 * 견적 항목 테이블 스켈레톤
 * 데스크톱: 테이블 형식, 모바일: 카드 형식
 */
function ItemsTableSkeleton() {
  return (
    <section aria-label="견적 항목 로딩 중">
      {/* 섹션 제목 */}
      <Skeleton className="mb-4 h-4 w-20" />

      {/* 데스크톱 테이블 스켈레톤 */}
      <div className="hidden overflow-hidden rounded-lg border sm:block">
        {/* 헤더 행 */}
        <div className="bg-muted/50 flex gap-4 border-b px-4 py-3">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="ml-auto h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        {/* 데이터 행 5개 */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
          >
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="ml-auto h-4 w-8" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* 모바일 카드 스켈레톤 */}
      <div className="flex flex-col gap-3 sm:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            {/* 카드 헤더 */}
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="mb-3 h-px w-full" />
            {/* 수량/단가 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Skeleton className="mb-1 h-3 w-8" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div>
                <Skeleton className="mb-1 h-3 w-8" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================
// 합계 섹션 스켈레톤
// ============================================================

/**
 * 소계, VAT, 총액 합계 섹션 스켈레톤
 */
function SummarySkeleton() {
  return (
    <section aria-label="금액 합계 로딩 중" className="flex justify-end">
      <div className="w-full sm:w-80">
        {/* 소계 */}
        <div className="flex items-center justify-between py-2.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* VAT */}
        <div className="flex items-center justify-between py-2.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* 구분선 */}
        <Skeleton className="my-1 h-px w-full" />
        {/* 총액 강조 */}
        <div className="mt-2 flex items-center justify-between rounded-lg px-3 py-3">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-7 w-32" />
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 추가 정보 섹션 스켈레톤
// ============================================================

/**
 * 비고, 결제 조건 섹션 스켈레톤
 */
function AdditionalInfoSkeleton() {
  return (
    <section aria-label="추가 정보 로딩 중" className="flex flex-col gap-4">
      <Skeleton className="h-4 w-20" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 비고 카드 */}
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="mb-1.5 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        {/* 결제 조건 카드 */}
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="mb-1.5 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 통합 InvoiceSkeleton 컴포넌트 (외부 공개)
// ============================================================

/**
 * 견적서 전체 페이지 스켈레톤 로더
 * loading.tsx 및 조건부 렌더링에서 사용
 */
export function InvoiceSkeleton() {
  return (
    // 전체 페이지 래퍼
    <div
      className="min-h-screen"
      role="status"
      aria-label="견적서를 불러오는 중입니다"
      aria-busy="true"
    >
      {/* 스크린 리더용 안내 텍스트 */}
      <span className="sr-only">견적서를 불러오는 중입니다...</span>

      {/* 헤더 바 스켈레톤 */}
      <HeaderBarSkeleton />

      {/* 메인 컨텐츠 영역 */}
      <main className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8">
          {/* 견적서 기본 정보 카드 */}
          <div className="rounded-xl border p-6">
            <InvoiceHeaderSkeleton />
          </div>

          {/* 발행사 + 클라이언트 2열 레이아웃 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border p-6">
              <IssuerSkeleton />
            </div>
            <div className="rounded-xl border p-6">
              <ClientSkeleton />
            </div>
          </div>

          {/* 항목 테이블 카드 */}
          <div className="rounded-xl border p-6">
            <ItemsTableSkeleton />
          </div>

          {/* 합계 섹션 */}
          <div className="rounded-xl border p-6">
            <SummarySkeleton />
          </div>

          {/* 추가 정보 섹션 */}
          <div className="rounded-xl border p-6">
            <AdditionalInfoSkeleton />
          </div>
        </div>
      </main>
    </div>
  )
}
