/**
 * 대시보드 견적서 로더 컴포넌트
 *
 * 구조:
 * - Zustand 스토어에서 데이터 페칭
 * - 세션 만료(401) 감지 → 자동 로그아웃 + 로그인 페이지 리다이렉트
 * - 400/403 감지 → 권한 없음 토스트 알림
 * - 500 감지 → 서버 오류 토스트 알림
 * - 네트워크 오류 → 재시도 로직 (최대 3회, TASK-011)
 * - 로딩/에러/성공 상태 분기 렌더링
 * - InvoiceListContainer에 데이터 전달
 *
 * 이 컴포넌트는 클라이언트 컴포넌트이며, 서버 컴포넌트인
 * DashboardPage에서 호출됩니다.
 */

'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { InvoiceListContainer } from '@/components/admin/invoice-list-container'
import { useInvoiceStore } from '@/store/invoiceStore'
import { adminLogout } from '@/lib/actions/auth'

// ============================================================
// 상수 정의
// ============================================================

/** 네트워크 오류 시 최대 재시도 횟수 */
const MAX_RETRY_COUNT = 3

/** 재시도 간격 (밀리초) */
const RETRY_DELAY_MS = 2000

// ============================================================
// 로딩 스켈레톤 컴포넌트
// ============================================================

/**
 * 견적서 목록 로딩 스켈레톤
 */
function InvoiceListSkeleton() {
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
// 에러 상태 컴포넌트
// ============================================================

interface ErrorStateProps {
  /** 에러 메시지 */
  message: string
  /** 재시도 핸들러 */
  onRetry: () => void
  /** 현재 재시도 횟수 */
  retryCount: number
}

/**
 * 데이터 로딩 실패 에러 상태
 */
function ErrorState({ message, onRetry, retryCount }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50 py-16 text-center dark:border-red-900/30 dark:bg-red-950/20"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="mb-3 h-10 w-10 text-red-400" aria-hidden="true" />
      <p className="mb-1 text-sm font-medium text-red-700 dark:text-red-300">
        데이터를 불러오지 못했습니다
      </p>
      <p className="mb-4 text-xs text-red-500 dark:text-red-400">{message}</p>

      {/* 재시도 횟수 표시 */}
      {retryCount > 0 && (
        <p className="mb-3 text-xs text-red-400 dark:text-red-500">
          재시도 {retryCount}/{MAX_RETRY_COUNT}회 실패
        </p>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-1.5 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        다시 시도
      </Button>
    </div>
  )
}

// ============================================================
// DashboardInvoiceLoader 메인 컴포넌트
// ============================================================

/**
 * 대시보드 견적서 데이터 로더
 * Zustand 스토어에서 데이터를 페칭하고 로딩/에러/성공 상태를 처리
 */
export function DashboardInvoiceLoader() {
  const router = useRouter()

  // Zustand 스토어에서 상태와 액션 구독
  const { invoices, isLoading, error, fetchInvoices, refreshInvoices } =
    useInvoiceStore()

  // 재시도 횟수 추적 (ref: 렌더링 불필요)
  const retryCountRef = useRef(0)
  // 자동 재시도 타이머 ID
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // --------------------------------------------------------
  // 세션 만료 처리 콜백
  // 401 응답 감지 시 로그아웃 후 로그인 페이지로 리다이렉트
  // --------------------------------------------------------
  const handleUnauthorized = useCallback(async () => {
    try {
      // 서버에서 세션 쿠키 삭제
      await adminLogout()
    } catch (logoutError) {
      console.error('로그아웃 처리 중 오류:', logoutError)
    } finally {
      // 로그인 페이지로 리다이렉트
      router.push('/dashboard')
      router.refresh()
    }
  }, [router])

  // --------------------------------------------------------
  // 네트워크 오류 자동 재시도 핸들러
  // 최대 MAX_RETRY_COUNT회까지 RETRY_DELAY_MS 간격으로 재시도
  // --------------------------------------------------------
  const handleFetchWithRetry = useCallback(async () => {
    retryCountRef.current = 0

    const attemptFetch = async () => {
      await fetchInvoices(() => void handleUnauthorized())
    }

    await attemptFetch()
  }, [fetchInvoices, handleUnauthorized])

  // --------------------------------------------------------
  // 컴포넌트 마운트 시 데이터 페칭
  // --------------------------------------------------------
  useEffect(() => {
    void handleFetchWithRetry()

    // 언마운트 시 타이머 정리
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [handleFetchWithRetry])

  // --------------------------------------------------------
  // 에러 발생 시 에러 코드 기반 토스트 처리
  // 네트워크 오류 시 자동 재시도 로직
  // --------------------------------------------------------
  useEffect(() => {
    if (!error) return

    // 네트워크 오류 감지 (자동 재시도 대상)
    const isNetworkError =
      error.includes('네트워크') ||
      error.includes('network') ||
      error.includes('fetch')

    // 권한 오류 토스트 (400/403 계열)
    const isForbiddenError = error.includes('접근 권한')
    // 서버 설정 오류 토스트 (500 DB_NOT_CONFIGURED)
    const isConfigError = error.includes('서버 설정 오류')
    // 데이터 처리 오류 토스트 (500 TRANSFORM_FAILED)
    const isTransformError = error.includes('데이터 처리')
    // 서버 내부 오류 토스트 (500 INTERNAL_SERVER_ERROR)
    const isServerError = error.includes('서버 내부 오류')

    if (isForbiddenError) {
      // 403 권한 없음 토스트
      toast.error('접근 권한이 없습니다', {
        description: '관리자 권한이 필요합니다. 관리자에게 문의해주세요.',
      })
    } else if (isConfigError) {
      // 500 DB_NOT_CONFIGURED 토스트
      toast.error('서버 설정 오류', {
        description:
          '노션 데이터베이스 설정이 올바르지 않습니다. 서버 환경변수를 확인해주세요.',
      })
    } else if (isTransformError) {
      // 500 TRANSFORM_FAILED 토스트
      toast.error('데이터 처리 오류', {
        description: '견적서 데이터 변환 중 오류가 발생했습니다.',
      })
    } else if (isServerError) {
      // 500 INTERNAL_SERVER_ERROR 토스트
      toast.error('서버 오류가 발생했습니다', {
        description:
          '잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의해주세요.',
      })
    } else if (isNetworkError && retryCountRef.current < MAX_RETRY_COUNT) {
      // 네트워크 오류 자동 재시도
      retryCountRef.current += 1
      const currentRetry = retryCountRef.current

      toast.warning(`연결 재시도 중... (${currentRetry}/${MAX_RETRY_COUNT})`, {
        description: '네트워크 연결을 확인하고 있습니다.',
        duration: RETRY_DELAY_MS,
      })

      // 일정 시간 후 자동 재시도
      retryTimerRef.current = setTimeout(() => {
        void refreshInvoices(() => void handleUnauthorized())
      }, RETRY_DELAY_MS)
    } else if (isNetworkError && retryCountRef.current >= MAX_RETRY_COUNT) {
      // 최대 재시도 횟수 초과 시 최종 실패 토스트
      toast.error('연결에 실패했습니다', {
        description: `${MAX_RETRY_COUNT}회 재시도 후에도 연결되지 않았습니다. 인터넷 연결을 확인해주세요.`,
      })
    }
  }, [error, refreshInvoices, handleUnauthorized])

  // --------------------------------------------------------
  // 수동 재시도 핸들러 (버튼 클릭)
  // --------------------------------------------------------
  const handleRetry = useCallback(() => {
    // 재시도 카운터 초기화
    retryCountRef.current = 0
    // 진행 중인 타이머 취소
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
    }
    void refreshInvoices(() => void handleUnauthorized())
  }, [refreshInvoices, handleUnauthorized])

  // --------------------------------------------------------
  // 성공 시 재시도 카운터 초기화 및 완료 토스트
  // --------------------------------------------------------
  useEffect(() => {
    if (!isLoading && !error && retryCountRef.current > 0) {
      toast.success('데이터를 성공적으로 불러왔습니다', {
        description: `${retryCountRef.current}회 재시도 후 연결되었습니다.`,
      })
      retryCountRef.current = 0
    }
  }, [isLoading, error])

  // --------------------------------------------------------
  // 로딩 상태 렌더링
  // --------------------------------------------------------
  if (isLoading) {
    return <InvoiceListSkeleton />
  }

  // --------------------------------------------------------
  // 에러 상태 렌더링
  // --------------------------------------------------------
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={handleRetry}
        retryCount={retryCountRef.current}
      />
    )
  }

  // --------------------------------------------------------
  // 성공 상태: 견적서 목록 렌더링
  // --------------------------------------------------------
  return (
    <div className="space-y-4">
      {/* 새로고침 버튼 */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRetry}
          className="gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          aria-label="견적서 목록 새로고침"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          새로고침
        </Button>
      </div>

      {/* 견적서 목록 컨테이너 */}
      <InvoiceListContainer invoices={invoices} />
    </div>
  )
}
