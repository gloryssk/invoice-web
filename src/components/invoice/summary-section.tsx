/**
 * 견적서 합계 섹션 컴포넌트
 * 소계, VAT(10%), 총액을 자동 계산하여 표시합니다.
 */

import { Separator } from '@/components/ui/separator'
import { formatCurrency, calculateVat } from '@/lib/format'
import type { InvoiceItem, Currency } from '@/types/invoice'

// 합계 섹션 Props 인터페이스
interface SummarySectionProps {
  items: InvoiceItem[]
  currency: Currency
}

export function SummarySection({ items, currency }: SummarySectionProps) {
  // 소계 계산 (각 항목 금액의 합산)
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

  // VAT 10% 계산
  const vat = calculateVat(subtotal)

  // 총액 계산 (소계 + VAT)
  const total = subtotal + vat

  return (
    // 합계 섹션 컨테이너
    <section aria-label="금액 합계" className="flex justify-end">
      <div className="w-full sm:w-80">
        {/* 금액 계산 목록 */}
        <dl className="flex flex-col gap-0">
          {/* 소계 */}
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-muted-foreground text-sm">소계</dt>
            <dd className="text-foreground text-sm font-medium">
              {formatCurrency(subtotal, currency)}
            </dd>
          </div>

          {/* VAT */}
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-muted-foreground text-sm">
              부가세
              <span className="text-muted-foreground/70 ml-1 text-xs">
                (10%)
              </span>
            </dt>
            <dd className="text-foreground text-sm font-medium">
              {formatCurrency(vat, currency)}
            </dd>
          </div>

          <Separator />

          {/* 총액 강조 표시 */}
          <div className="bg-primary/5 mt-2 flex items-center justify-between rounded-lg px-3 py-3">
            <dt className="text-foreground text-base font-bold">총액</dt>
            <dd className="text-primary text-xl font-bold" aria-live="polite">
              {formatCurrency(total, currency)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
