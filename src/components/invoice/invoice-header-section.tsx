/**
 * 견적서 기본 정보 헤더 섹션 컴포넌트
 * 견적번호, 제목, 발행일, 유효기간, 상태 배지를 표시합니다.
 */

import { CalendarDays, Hash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/format'
import type { InvoiceStatus } from '@/types/invoice'

// 상태별 배지 스타일 및 레이블 매핑
const STATUS_CONFIG: Record<
  InvoiceStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  draft: { label: '작성 중', variant: 'secondary' },
  pending: { label: '검토 대기', variant: 'outline' },
  approved: { label: '승인됨', variant: 'default' },
  expired: { label: '만료됨', variant: 'destructive' },
}

// 견적서 기본 정보 Props 인터페이스
interface InvoiceHeaderSectionProps {
  invoiceNumber: string
  title: string
  status: InvoiceStatus
  issueDate: string
  expiryDate: string
}

export function InvoiceHeaderSection({
  invoiceNumber,
  title,
  status,
  issueDate,
  expiryDate,
}: InvoiceHeaderSectionProps) {
  // 상태 설정 조회
  const statusConfig = STATUS_CONFIG[status]

  return (
    // 견적서 기본 정보 컨테이너
    // 배경: bg-gray-50 (다크: bg-slate-800), 패딩: p-4, 라운드 처리
    <section
      aria-label="견적서 기본 정보"
      className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 dark:bg-slate-800"
    >
      {/* 견적서 제목 영역 */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {/* 견적서 번호 */}
          <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Hash className="size-3.5" aria-hidden="true" />
            <span>{invoiceNumber}</span>
          </div>

          {/* 견적서 제목 */}
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            {title}
          </h1>
        </div>

        {/* 상태 배지 */}
        <Badge
          variant={statusConfig.variant}
          aria-label={`견적서 상태: ${statusConfig.label}`}
          className="shrink-0 text-sm"
        >
          {statusConfig.label}
        </Badge>
      </div>

      <Separator />

      {/* 날짜 정보 영역 - 라벨-값 2열 그리드 */}
      <dl className="grid grid-cols-2 gap-4">
        {/* 발행일 */}
        <div className="flex flex-col gap-1">
          {/* 라벨: font-semibold, text-gray-600 */}
          <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <span>발행일</span>
          </dt>
          {/* 값: font-medium, text-gray-900 */}
          <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatDate(issueDate)}
          </dd>
        </div>

        {/* 유효기간 */}
        <div className="flex flex-col gap-1">
          {/* 라벨: font-semibold, text-gray-600 */}
          <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <span>유효기간</span>
          </dt>
          {/* 값: font-medium, text-gray-900 */}
          <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatDate(expiryDate)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
