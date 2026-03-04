/**
 * 관리자 대시보드 페이지
 * 라우트: /dashboard
 *
 * 구조:
 * - 인증 없이 바로 견적서 목록 대시보드 표시
 * - DashboardInvoiceLoader로 노션 API 연동
 */

import { Suspense } from 'react'
import { DashboardHeader } from '@/components/admin/dashboard-header'
import { DashboardInvoiceLoader } from '@/components/admin/dashboard-invoice-loader'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================================
// 로딩 스켈레톤 컴포넌트
// ============================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[140px]" />
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <Skeleton className="h-12 w-full rounded-none" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-14 w-full rounded-none border-t border-slate-100"
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// 대시보드 페이지 컴포넌트
// ============================================================

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <DashboardHeader />

      {/* 메인 컨텐츠 */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">견적서 목록</h2>
          <p className="mt-1 text-sm text-slate-500">
            노션에 저장된 견적서를 조회하고 클라이언트와 공유할 수 있습니다
          </p>
        </div>

        {/* 견적서 목록 로더 */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardInvoiceLoader />
        </Suspense>
      </main>
    </div>
  )
}
