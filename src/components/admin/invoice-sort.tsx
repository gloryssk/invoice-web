/**
 * 견적서 정렬 드롭다운 컴포넌트
 *
 * 구조:
 * - shadcn/ui Select 컴포넌트 활용
 * - 최신순 / 오래된순 / 금액 높음 / 금액 낮음 옵션
 */

'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ============================================================
// 정렬 타입 및 옵션 정의
// ============================================================

/** 정렬 기준 타입 */
export type SortOption = 'newest' | 'oldest' | 'amount_high' | 'amount_low'

/** 정렬 옵션 목록 */
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'amount_high', label: '금액 높음' },
  { value: 'amount_low', label: '금액 낮음' },
]

// ============================================================
// Props 타입 정의
// ============================================================

interface InvoiceSortProps {
  /** 현재 정렬 기준 */
  value: SortOption
  /** 정렬 변경 핸들러 */
  onChange: (value: SortOption) => void
  /** 추가 클래스명 */
  className?: string
}

// ============================================================
// 정렬 드롭다운 컴포넌트
// ============================================================

/**
 * 견적서 목록 정렬 드롭다운
 * 발행일 및 금액 기준 정렬 지원
 */
export function InvoiceSort({ value, onChange, className }: InvoiceSortProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* 정렬 레이블 */}
      <span
        className="hidden text-sm text-slate-500 sm:inline"
        aria-hidden="true"
      >
        정렬:
      </span>

      {/* 정렬 선택 드롭다운 */}
      <Select value={value} onValueChange={v => onChange(v as SortOption)}>
        <SelectTrigger
          className="h-10 w-[140px] border-slate-200 bg-white focus:ring-blue-500"
          aria-label="정렬 기준 선택"
        >
          <SelectValue placeholder="정렬 선택" />
        </SelectTrigger>
        <SelectContent>
          {/* 정렬 옵션 목록 */}
          {SORT_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
