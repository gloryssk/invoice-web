/**
 * 관리자 대시보드 로딩 페이지
 *
 * 구조:
 * - 대시보드 진입 시 서버 컴포넌트 데이터 로딩 중 표시
 * - 헤더, 통계 카드, 테이블 영역 스켈레톤 UI
 * - Next.js loading.tsx - 자동으로 Suspense 경계 역할 수행
 */

import { Skeleton } from '@/components/ui/skeleton'

// ============================================================
// 통계 카드 스켈레톤 컴포넌트
// ============================================================

/**
 * 상단 통계 카드 스켈레톤
 */
function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-7 w-14" />
        </div>
        <Skeleton className="size-10 rounded-lg" />
      </div>
    </div>
  )
}

// ============================================================
// 테이블 스켈레톤 컴포넌트
// ============================================================

/**
 * 견적서 테이블 스켈레톤
 * 검색/정렬 영역 + 테이블 헤더 + 행 목록
 */
function InvoiceTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* 검색/정렬 + 새로고침 버튼 영역 스켈레톤 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        {/* 테이블 헤더 */}
        <div className="flex gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
          {[20, 15, 12, 10, 10, 15, 12].map((width, i) => (
            <Skeleton
              key={i}
              className={`h-4 w-${width}`}
              style={{ width: `${width}%` }}
            />
          ))}
        </div>

        {/* 테이블 행 */}
        {Array.from({ length: 8 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex gap-4 border-b border-slate-100 px-4 py-4 last:border-0 dark:border-slate-800"
          >
            {[20, 15, 12, 10, 10, 15, 12].map((width, colIdx) => (
              <Skeleton
                key={colIdx}
                className="h-4"
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="size-9 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// DashboardLoading 메인 컴포넌트
// ============================================================

/**
 * 대시보드 전체 로딩 스켈레톤 UI
 * 서버 컴포넌트 데이터 페칭 중 표시됩니다.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* 페이지 제목 스켈레톤 */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      {/* 통계 카드 4개 스켈레톤 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* 견적서 테이블 스켈레톤 */}
      <InvoiceTableSkeleton />
    </div>
  )
}
