/**
 * 견적서 목록 페이지네이션 컴포넌트
 *
 * 구조:
 * - 이전 버튼
 * - 현재 페이지 / 전체 페이지 표시
 * - 다음 버튼
 */

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ============================================================
// Props 타입 정의
// ============================================================

interface InvoicePaginationProps {
  /** 현재 페이지 번호 (1부터 시작) */
  currentPage: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 이전 페이지 이동 핸들러 */
  onPrevPage: () => void
  /** 다음 페이지 이동 핸들러 */
  onNextPage: () => void
  /** 추가 클래스명 */
  className?: string
}

// ============================================================
// 페이지네이션 컴포넌트
// ============================================================

/**
 * 견적서 목록 페이지네이션
 * 이전/다음 버튼과 현재 페이지 표시
 */
export function InvoicePagination({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  className,
}: InvoicePaginationProps) {
  // 페이지가 1개 이하이면 렌더링하지 않음
  if (totalPages <= 1) return null

  return (
    <nav
      className={cn('flex items-center justify-center gap-3', className)}
      aria-label="페이지 탐색"
    >
      {/* 이전 페이지 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        className={cn(
          'h-9 gap-1 border-slate-200 px-3 text-slate-600',
          'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600',
          'disabled:cursor-not-allowed disabled:opacity-40'
        )}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">이전</span>
      </Button>

      {/* 현재 페이지 / 전체 페이지 표시 */}
      <div
        className="flex items-center gap-1 text-sm text-slate-600"
        aria-current="page"
        aria-label={`페이지 ${currentPage} / ${totalPages}`}
      >
        <span className="font-semibold text-slate-900">{currentPage}</span>
        <span className="text-slate-400">/</span>
        <span>{totalPages}</span>
        <span className="hidden text-slate-400 sm:inline">페이지</span>
      </div>

      {/* 다음 페이지 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        className={cn(
          'h-9 gap-1 border-slate-200 px-3 text-slate-600',
          'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600',
          'disabled:cursor-not-allowed disabled:opacity-40'
        )}
        aria-label="다음 페이지"
      >
        <span className="hidden sm:inline">다음</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  )
}
