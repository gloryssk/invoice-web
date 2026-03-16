/**
 * 신고 상태 배지 컴포넌트
 *
 * 구조:
 * - ReportStatus 타입에 따라 색상 변경
 * - undefined일 때: 신고 없음 (회색)
 * - 'pending': 처리중 (노란색)
 * - 'completed': 처리완료 (초록색)
 * - 클릭 가능 (Dialog 트리거용)
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ReportStatus } from '@/types/invoice'

// ============================================================
// 상태별 스타일 설정
// ============================================================

const STATUS_CONFIG: Record<
  ReportStatus | 'none',
  { label: string; className: string }
> = {
  pending: {
    label: '처리중',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 cursor-pointer hover:bg-amber-100',
  },
  completed: {
    label: '처리완료',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-pointer hover:bg-emerald-100',
  },
  none: {
    label: '신고 없음',
    className: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  },
}

// ============================================================
// Props 타입 정의
// ============================================================

interface ReportStatusBadgeProps {
  status?: ReportStatus
  onClick?: () => void
  className?: string
}

// ============================================================
// 배지 컴포넌트
// ============================================================

/**
 * 신고 상태 배지
 */
export function ReportStatusBadge({
  status,
  onClick,
  className,
}: ReportStatusBadgeProps) {
  const configKey = status || 'none'
  const config = STATUS_CONFIG[configKey]

  return (
    <Badge
      variant="outline"
      onClick={onClick}
      className={cn(
        'text-xs font-medium transition-colors',
        config.className,
        onClick && 'cursor-pointer',
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
