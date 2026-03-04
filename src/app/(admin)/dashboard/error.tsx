/**
 * 관리자 대시보드 에러 페이지
 *
 * 구조:
 * - 예기치 못한 런타임 에러 발생 시 표시
 * - 에러 유형 분류 (인증 오류, 서버 오류, 네트워크 오류)
 * - 재시도 버튼 및 로그인 페이지 이동 버튼
 *
 * Next.js error.tsx는 반드시 'use client' 지시어가 필요합니다.
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, LogIn, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// ============================================================
// 타입 정의
// ============================================================

/** 에러 페이지 Props 인터페이스 */
interface DashboardErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/** 에러 유형별 메시지 반환 타입 */
interface ErrorInfo {
  title: string
  description: string
  /** 로그인 페이지로 이동해야 하는지 여부 */
  shouldRedirectToLogin: boolean
}

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * 에러 메시지를 분류하여 사용자 친화적 정보를 반환
 * 에러 유형: 인증 오류, 노션 API 오류, 네트워크 오류, 기본 오류
 */
function classifyError(error: Error): ErrorInfo {
  const message = error.message.toLowerCase()

  // 인증/세션 만료 오류
  if (
    message.includes('unauthorized') ||
    message.includes('인증') ||
    message.includes('세션')
  ) {
    return {
      title: '인증이 필요합니다',
      description:
        '세션이 만료되었거나 인증 정보가 올바르지 않습니다. 다시 로그인해 주세요.',
      shouldRedirectToLogin: true,
    }
  }

  // 노션 API 오류
  if (message.includes('notion') || message.includes('노션')) {
    return {
      title: 'API 연동 오류',
      description:
        '노션 서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      shouldRedirectToLogin: false,
    }
  }

  // 네트워크 오류
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('네트워크')
  ) {
    return {
      title: '네트워크 오류',
      description: '인터넷 연결을 확인하거나 잠시 후 다시 시도해 주세요.',
      shouldRedirectToLogin: false,
    }
  }

  // 기본 서버 오류
  return {
    title: '서버 오류가 발생했습니다',
    description:
      '예기치 못한 오류가 발생했습니다. 문제가 지속되면 관리자에게 문의해 주세요.',
    shouldRedirectToLogin: false,
  }
}

// ============================================================
// DashboardError 컴포넌트
// ============================================================

/**
 * 대시보드 전역 에러 처리 컴포넌트
 * 런타임 에러 발생 시 Next.js에 의해 자동으로 렌더링됩니다.
 */
export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const router = useRouter()

  // 에러 로깅 (개발/모니터링용)
  useEffect(() => {
    console.error('대시보드 오류 발생:', error)
  }, [error])

  const { title, description, shouldRedirectToLogin } = classifyError(error)

  // --------------------------------------------------------
  // 로그인 페이지 이동 핸들러
  // --------------------------------------------------------
  const handleLoginRedirect = () => {
    router.push('/dashboard')
  }

  return (
    // 전체 화면 중앙 정렬 레이아웃
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* 에러 카드 컨테이너 */}
      <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl border border-amber-100 bg-amber-50 p-10 text-center dark:border-amber-900/30 dark:bg-amber-950/20">
        {/* 경고 아이콘 영역 */}
        <div
          className="flex size-20 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40"
          aria-hidden="true"
        >
          <AlertTriangle className="size-10 text-amber-600 dark:text-amber-400" />
        </div>

        {/* 에러 제목 및 설명 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
            {description}
          </p>

          {/* 에러 다이제스트 (디버깅용, 프로덕션에서 참조 코드로 활용) */}
          {error.digest && (
            <p className="mt-1 text-xs text-amber-500/70 dark:text-amber-400/50">
              참조 코드: {error.digest}
            </p>
          )}
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
          {/* 조건부: 로그인 이동 또는 다시 시도 버튼 */}
          {shouldRedirectToLogin ? (
            // 인증 오류 - 로그인 페이지로 이동
            <Button
              onClick={handleLoginRedirect}
              className="gap-2 bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
            >
              <LogIn className="size-4" aria-hidden="true" />
              로그인 페이지로 이동
            </Button>
          ) : (
            // 일반 오류 - 다시 시도
            <Button
              variant="outline"
              onClick={reset}
              className="gap-2 border-amber-300 text-amber-700 hover:border-amber-400 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/40"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              다시 시도
            </Button>
          )}

          {/* 홈으로 이동 버튼 */}
          <Button
            variant="ghost"
            asChild
            className="gap-2 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/40"
          >
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              홈으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
