/**
 * 견적서 카드 컴포넌트 (모바일용)
 *
 * 구조:
 * - 견적번호 + 상태배지 (상단)
 * - 클라이언트명 + 금액 (중단)
 * - 발행일 + 유효기간 (하단)
 * - 미리보기/링크복사 버튼 (하단 우측)
 * - TASK-008: Invoice 타입으로 교체, 링크 관리 컴포넌트 통합
 */

'use client'

import { CalendarDays } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import {
  CopyLinkButton,
  PreviewLinkButton,
  useLinkManager,
} from '@/components/admin/link-manager'

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * 금액을 한국 원화 형식으로 포맷
 */
function formatAmount(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

/**
 * ISO 날짜 문자열을 짧은 한국어 날짜 형식으로 포맷
 */
function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// ============================================================
// 상태 설정 상수 (카드용)
// ============================================================

/** InvoiceStatus별 표시 설정 */
const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  approved: {
    label: '승인됨',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  pending: {
    label: '대기중',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  draft: {
    label: '작성중',
    className: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  },
  expired: {
    label: '만료됨',
    className: 'bg-red-50 text-red-600 border-red-200',
  },
}

// ============================================================
// Props 타입 정의
// ============================================================

interface InvoiceCardProps {
  /** 표시할 견적서 데이터 */
  invoice: Invoice
  /** 추가 클래스명 */
  className?: string
}

// ============================================================
// 견적서 카드 컴포넌트
// ============================================================

/**
 * 견적서 단일 카드 (모바일 전용)
 * 터치 친화적인 레이아웃으로 구성
 */
export function InvoiceCard({ invoice, className }: InvoiceCardProps) {
  const statusConfig = STATUS_CONFIG[invoice.status]

  // 링크 관리 훅 (복사 상태 관리)
  const { copyLink, copyingSlug, copiedSlug } = useLinkManager()

  return (
    <Card
      className={cn(
        'border-slate-200 bg-white shadow-none',
        'transition-shadow hover:shadow-sm',
        className
      )}
    >
      <CardContent className="p-4">
        {/* 상단: 견적번호 + 상태 배지 */}
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold text-blue-600">
            {invoice.invoiceNumber}
          </span>
          <Badge
            variant="outline"
            className={cn('text-xs font-medium', statusConfig.className)}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* 중단: 클라이언트명 + 금액 (Invoice 타입 필드 사용) */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <p className="text-sm leading-snug font-semibold text-slate-800">
            {invoice.clientName}
          </p>
          <p className="shrink-0 text-sm font-bold text-slate-900">
            {formatAmount(invoice.totalAmount)}
          </p>
        </div>

        <Separator className="mb-3 bg-slate-100" />

        {/* 하단: 날짜 정보 + 액션 버튼 */}
        <div className="flex items-end justify-between">
          {/* 날짜 정보 (Invoice 타입: issueDate, expiryDate 필드) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              <span>발행: {formatDate(invoice.issueDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              <span>만료: {formatDate(invoice.expiryDate)}</span>
            </div>
          </div>

          {/* 액션 버튼 그룹 */}
          <div className="flex items-center gap-1">
            {/* 미리보기 버튼 - 새 탭으로 뷰어 열기 */}
            <PreviewLinkButton
              slug={invoice.slug}
              invoiceNumber={invoice.invoiceNumber}
              variant="outline"
            />

            {/* 링크 복사 버튼 - 클립보드에 URL 복사 */}
            <CopyLinkButton
              slug={invoice.slug}
              invoiceNumber={invoice.invoiceNumber}
              isCopying={copyingSlug === invoice.slug}
              isCopied={copiedSlug === invoice.slug}
              onClick={() => void copyLink(invoice.slug, invoice.invoiceNumber)}
              variant="outline"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// 카드 목록 컴포넌트
// ============================================================

interface InvoiceCardListProps {
  /** 표시할 견적서 목록 */
  invoices: Invoice[]
  /** 추가 클래스명 */
  className?: string
}

/**
 * 견적서 카드 목록 (모바일 전용)
 * InvoiceCard를 반복 렌더링
 */
export function InvoiceCardList({ invoices, className }: InvoiceCardListProps) {
  if (invoices.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-16 text-center',
          className
        )}
        role="status"
        aria-label="견적서 없음"
      >
        <p className="text-sm text-slate-400">표시할 견적서가 없습니다</p>
      </div>
    )
  }

  return (
    <div
      className={cn('space-y-3', className)}
      role="list"
      aria-label="견적서 목록"
    >
      {invoices.map(invoice => (
        <div key={invoice.id} role="listitem">
          <InvoiceCard invoice={invoice} />
        </div>
      ))}
    </div>
  )
}
