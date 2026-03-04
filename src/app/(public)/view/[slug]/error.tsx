/**
 * 에러 페이지
 * 견적서 로딩 중 예기치 못한 오류가 발생했을 때 표시됩니다.
 * 노션 API 오류, 네트워크 오류 등을 처리합니다.
 * Next.js error.tsx는 반드시 'use client' 지시어가 필요합니다.
 */

'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// 에러 페이지 Props 인터페이스
interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * 에러 메시지 분류
 * 에러 유형에 따라 사용자 친화적 메시지 제공
 */
function getErrorMessage(error: Error): {
  title: string
  description: string
} {
  const errorMessage = error.message.toLowerCase()

  // 노션 API 오류
  if (errorMessage.includes('notion'))
    return {
      title: 'API 서버 오류',
      description:
        '견적서 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }

  // 데이터베이스 설정 오류
  if (errorMessage.includes('데이터베이스'))
    return {
      title: '설정 오류',
      description: '서버 설정에 문제가 있습니다. 관리자에게 문의해주세요.',
    }

  // 기본 오류
  return {
    title: '오류가 발생했습니다',
    description:
      '견적서를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도하거나 담당자에게 문의해 주세요.',
  }
}

export default function InvoiceError({ error, reset }: ErrorPageProps) {
  // 에러 로깅
  useEffect(() => {
    console.error('견적서 로딩 오류:', error)
  }, [error])

  const { title, description } = getErrorMessage(error)

  return (
    // 전체 화면 중앙 정렬 레이아웃
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center px-4">
      {/* 에러 카드 컨테이너 */}
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        {/* 아이콘 영역 */}
        <div
          className="bg-destructive/10 flex size-20 items-center justify-center rounded-2xl"
          aria-hidden="true"
        >
          <AlertCircle className="text-destructive size-10" />
        </div>

        {/* 제목 및 설명 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>

          {/* 에러 다이제스트 (디버깅용) */}
          {error.digest && (
            <p className="text-muted-foreground/60 mt-1 text-xs">
              오류 코드: {error.digest}
            </p>
          )}
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
          {/* 다시 시도 버튼 */}
          <Button variant="outline" onClick={() => reset()}>
            <RefreshCw className="size-4" aria-hidden="true" />
            다시 시도
          </Button>

          {/* 홈으로 이동 버튼 */}
          <Button asChild>
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              홈으로 이동
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
