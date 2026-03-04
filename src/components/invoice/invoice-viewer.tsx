/**
 * 견적서 뷰어 메인 컴포넌트
 * 모든 견적서 섹션을 조합하여 전체 레이아웃을 구성합니다.
 *
 * 레이아웃 구조:
 * ┌────────────────────────────────────┐
 * │ HeaderBar (고정 헤더)              │
 * ├────────────────────────────────────┤
 * │ ┌──────────────────────────────┐   │
 * │ │ Card                         │   │
 * │ │  ┌────────┬─────────────┐   │   │
 * │ │  │IssuerS │InvoiceHeader│   │   │
 * │ │  └────────┴─────────────┘   │   │
 * │ │  ClientSection               │   │
 * │ │  ItemsTable                  │   │
 * │ │  SummarySection              │   │
 * │ │  AdditionalInfoSection       │   │
 * │ └──────────────────────────────┘   │
 * └────────────────────────────────────┘
 */

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { HeaderBar } from '@/components/invoice/header-bar'
import { IssuerSection } from '@/components/invoice/issuer-section'
import { InvoiceHeaderSection } from '@/components/invoice/invoice-header-section'
import { ClientSection } from '@/components/invoice/client-section'
import { ItemsTable } from '@/components/invoice/items-table'
import { SummarySection } from '@/components/invoice/summary-section'
import { AdditionalInfoSection } from '@/components/invoice/additional-info-section'
import type { Invoice } from '@/types/invoice'

// 견적서 뷰어 Props 인터페이스
interface InvoiceViewerProps {
  invoice: Invoice
}

export function InvoiceViewer({ invoice }: InvoiceViewerProps) {
  return (
    // 전체 페이지 래퍼
    <div className="bg-muted/30 min-h-screen print:bg-white">
      {/* 상단 고정 헤더 바 (PDF 다운로드 + 인쇄 버튼 포함) */}
      <HeaderBar
        invoiceNumber={invoice.invoiceNumber}
        clientName={invoice.clientName}
        issueDate={invoice.issueDate}
      />

      {/* 메인 콘텐츠 영역 - PDF 출력 대상 영역 (id로 식별) */}
      <main
        id="invoice-content"
        className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 print:px-0 print:py-0"
      >
        {/* 견적서 카드 컨테이너 */}
        <Card className="gap-0 overflow-hidden border border-blue-200 py-0 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-blue-800 print:border-none print:shadow-none">
          <CardContent className="p-0">
            {/* 견적서 상단 영역: 발행사 + 기본 정보 */}
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:gap-8 sm:p-8">
              {/* 발행사 정보 */}
              <IssuerSection />

              {/* 견적서 기본 정보 */}
              <InvoiceHeaderSection
                invoiceNumber={invoice.invoiceNumber}
                title={invoice.title}
                status={invoice.status}
                issueDate={invoice.issueDate}
                expiryDate={invoice.expiryDate}
              />
            </div>

            <Separator />

            {/* 클라이언트 정보 */}
            <div className="p-6 sm:p-8">
              <ClientSection clientName={invoice.clientName} />
            </div>

            <Separator />

            {/* 견적 항목 테이블 */}
            <div className="p-6 sm:p-8">
              <ItemsTable items={invoice.items} currency={invoice.currency} />
            </div>

            <Separator />

            {/* 합계 영역 */}
            <div className="p-6 sm:p-8">
              <SummarySection
                items={invoice.items}
                currency={invoice.currency}
              />
            </div>

            {/* 추가 정보 영역 (있을 경우에만 표시) */}
            {(invoice.notes || invoice.paymentTerms) && (
              <>
                <Separator />
                <div className="p-6 sm:p-8">
                  <AdditionalInfoSection
                    notes={invoice.notes}
                    paymentTerms={invoice.paymentTerms}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 하단 여백 (모바일 스크롤 편의) */}
        <div className="h-8 print:hidden" aria-hidden="true" />
      </main>
    </div>
  )
}
