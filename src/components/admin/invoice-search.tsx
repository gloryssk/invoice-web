/**
 * 견적서 검색 바 컴포넌트
 *
 * 구조:
 * - 검색 아이콘 + 입력 필드
 * - 입력값이 있을 때 지우기(X) 버튼 표시
 */

'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ============================================================
// Props 타입 정의
// ============================================================

interface InvoiceSearchProps {
  /** 현재 검색어 */
  value: string
  /** 검색어 변경 핸들러 */
  onChange: (value: string) => void
  /** 추가 클래스명 */
  className?: string
}

// ============================================================
// 검색 바 컴포넌트
// ============================================================

/**
 * 견적서 목록 검색 바
 * 견적번호 또는 클라이언트명으로 필터링
 */
export function InvoiceSearch({
  value,
  onChange,
  className,
}: InvoiceSearchProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      {/* 검색 아이콘 */}
      <Search
        className="absolute left-3 h-4 w-4 text-slate-400"
        aria-hidden="true"
      />

      {/* 검색 입력 필드 */}
      <Input
        type="search"
        placeholder="견적서 번호 또는 클라이언트명으로 검색"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'h-10 pr-10 pl-9',
          'border-slate-200 bg-white',
          'placeholder:text-slate-400',
          'focus-visible:ring-blue-500',
          'w-full'
        )}
        aria-label="견적서 검색"
      />

      {/* 지우기 버튼 - 검색어가 있을 때만 표시 */}
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange('')}
          className="absolute right-1 h-8 w-8 text-slate-400 hover:text-slate-600"
          aria-label="검색어 지우기"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
