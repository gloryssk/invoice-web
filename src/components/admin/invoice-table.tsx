/**
 * 견적서 목록 테이블 컴포넌트 (데스크톱용)
 *
 * 구조:
 * - shadcn/ui Table 컴포넌트 활용
 * - 컬럼: 견적번호 | 클라이언트명 | 금액 | 발행일 | 유효기간 | 상태 | 신고내용 | 액션
 * - 상태 배지: 승인(녹색) / 대기(파랑) / 작성중(회색) / 만료(적갈색)
 * - 신고 배지: 신고 없음(회색) / 처리중(노란색) / 처리완료(초록색)
 * - 액션: 미리보기 버튼, 링크 복사 버튼
 * - TASK-008: Invoice 타입으로 교체, 링크 관리 컴포넌트 통합
 * - TASK-023: 신고 처리 기능 추가, ReportDialog 통합
 */

'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import {
  CopyLinkButton,
  PreviewLinkButton,
  useLinkManager,
} from '@/components/admin/link-manager'
import { ReportStatusBadge } from '@/components/admin/report-status-badge'
import { ReportDialog } from '@/components/admin/report-dialog'
import { useReportStore } from '@/store/reportStore'

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
 * ISO 날짜 문자열을 한국어 날짜 형식으로 포맷
 */
function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// ============================================================
// 상태 배지 컴포넌트
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

interface StatusBadgeProps {
  status: InvoiceStatus
}

/**
 * 견적서 상태 배지
 */
function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', config.className)}
    >
      {config.label}
    </Badge>
  )
}

// ============================================================
// Props 타입 정의
// ============================================================

interface InvoiceTableProps {
  /** 표시할 견적서 목록 */
  invoices: Invoice[]
  /** 추가 클래스명 */
  className?: string
}

// ============================================================
// 테이블 컴포넌트
// ============================================================

/**
 * 견적서 목록 테이블 (데스크톱 전용, md 이상에서 표시)
 */
export function InvoiceTable({ invoices, className }: InvoiceTableProps) {
  // 링크 관리 훅 (복사 상태 관리)
  const { copyLink, copyingSlug, copiedSlug } = useLinkManager()

  // 신고 스토어에서 데이터 구독 (화면 업데이트 감지)
  const reports = useReportStore(state => state.reports)

  // Dialog 상태 관리
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // ============================================================
  // Dialog 오픈 핸들러
  // ============================================================
  const handleOpenDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDialogOpen(true)
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-slate-200 bg-white',
        className
      )}
    >
      <Table>
        {/* 테이블 헤더 */}
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-[140px] font-semibold text-slate-700">
              견적번호
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              클라이언트명
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              금액
            </TableHead>
            <TableHead className="w-[110px] font-semibold text-slate-700">
              발행일
            </TableHead>
            <TableHead className="w-[110px] font-semibold text-slate-700">
              유효기간
            </TableHead>
            <TableHead className="w-[100px] text-center font-semibold text-slate-700">
              상태
            </TableHead>
            <TableHead className="w-[110px] text-center font-semibold text-slate-700">
              신고내용
            </TableHead>
            <TableHead className="w-[120px] text-center font-semibold text-slate-700">
              액션
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* 테이블 본문 */}
        <TableBody>
          {invoices.length === 0 ? (
            /* 데이터 없음 상태 */
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-slate-400"
              >
                표시할 견적서가 없습니다
              </TableCell>
            </TableRow>
          ) : (
            invoices.map(invoice => (
              <TableRow
                key={invoice.id}
                className="transition-colors hover:bg-blue-50/30"
              >
                {/* 견적번호 */}
                <TableCell className="font-mono text-sm font-medium text-blue-600">
                  {invoice.invoiceNumber}
                </TableCell>

                {/* 클라이언트명 */}
                <TableCell className="font-medium text-slate-800">
                  {invoice.clientName}
                </TableCell>

                {/* 금액 (Invoice 타입은 totalAmount 필드 사용) */}
                <TableCell className="text-right font-medium text-slate-800">
                  {formatAmount(invoice.totalAmount)}
                </TableCell>

                {/* 발행일 (Invoice 타입은 issueDate 필드 사용) */}
                <TableCell className="text-sm text-slate-600">
                  {formatDate(invoice.issueDate)}
                </TableCell>

                {/* 유효기간 (Invoice 타입은 expiryDate 필드 사용) */}
                <TableCell className="text-sm text-slate-600">
                  {formatDate(invoice.expiryDate)}
                </TableCell>

                {/* 상태 배지 */}
                <TableCell className="text-center">
                  <StatusBadge status={invoice.status} />
                </TableCell>

                {/* 신고내용 배지 */}
                <TableCell className="text-center">
                  <ReportStatusBadge
                    status={reports[invoice.slug]?.status}
                    onClick={() => handleOpenDialog(invoice)}
                  />
                </TableCell>

                {/* 액션 버튼 */}
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    {/* 미리보기 버튼 - 새 탭으로 뷰어 열기 */}
                    <PreviewLinkButton
                      slug={invoice.slug}
                      invoiceNumber={invoice.invoiceNumber}
                      variant="icon"
                    />

                    {/* 링크 복사 버튼 - 클립보드에 URL 복사 */}
                    <CopyLinkButton
                      slug={invoice.slug}
                      invoiceNumber={invoice.invoiceNumber}
                      isCopying={copyingSlug === invoice.slug}
                      isCopied={copiedSlug === invoice.slug}
                      onClick={() =>
                        void copyLink(invoice.slug, invoice.invoiceNumber)
                      }
                      variant="icon"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 신고 처리 Dialog */}
      {selectedInvoice && (
        <ReportDialog
          invoice={selectedInvoice}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  )
}
