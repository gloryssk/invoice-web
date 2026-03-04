/**
 * 관리자 대시보드 페이지
 * 라우트: /dashboard
 *
 * 구조:
 * - 인증 상태 확인 (서버 컴포넌트에서 세션 검증)
 * - 미인증: 로그인 폼 표시
 * - 인증됨: 견적서 목록 대시보드 표시
 * - TASK-008: DashboardInvoiceLoader로 노션 API 실제 연동
 */

import { Suspense } from 'react'
import { AdminLoginForm } from '@/components/admin/login-form'
import { DashboardHeader } from '@/components/admin/dashboard-header'
import { DashboardInvoiceLoader } from '@/components/admin/dashboard-invoice-loader'
import { getAdminSession } from '@/lib/actions/auth'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================================
// 로딩 스켈레톤 컴포넌트
// ============================================================

/**
 * 대시보드 로딩 스켈레톤
 * Suspense fallback으로 사용
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* 검색/정렬 영역 스켈레톤 */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[140px]" />
      </div>

      {/* 테이블 스켈레톤 */}
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
// 대시보드 메인 컨텐츠 컴포넌트
// ============================================================

/**
 * 인증된 사용자용 대시보드 컨텐츠
 * DashboardInvoiceLoader가 Zustand 스토어 + 노션 API 연동 담당
 */
function DashboardContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <DashboardHeader />

      {/* 메인 컨텐츠 */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 페이지 제목 및 설명 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">견적서 목록</h2>
          <p className="mt-1 text-sm text-slate-500">
            노션에 저장된 견적서를 조회하고 클라이언트와 공유할 수 있습니다
          </p>
        </div>

        {/* 견적서 목록 로더 (Zustand + 노션 API 연동) */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardInvoiceLoader />
        </Suspense>
      </main>
    </div>
  )
}

// ============================================================
// 대시보드 페이지 컴포넌트
// ============================================================

/**
 * 대시보드 페이지
 * 인증 상태에 따라 로그인 폼 또는 대시보드 표시
 */
export default async function DashboardPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = await props.searchParams
  const session = await getAdminSession()

  // 인증된 경우 대시보드 표시
  if (session?.isAuthenticated) {
    return <DashboardContent />
  }

  // 미인증 상태 - 로그인 폼 표시
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <Suspense
        fallback={<div className="text-sm text-slate-400">로딩 중...</div>}
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
