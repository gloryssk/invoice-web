/**
 * 견적 항목 테이블 컴포넌트
 * 데스크톱: 테이블 형식으로 품목명, 수량, 단가, 금액 표시
 * 모바일: 카드 형식으로 각 항목을 세로로 표시
 */

import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatNumber } from '@/lib/format'
import type { InvoiceItem, Currency } from '@/types/invoice'

// 항목 테이블 Props 인터페이스
interface ItemsTableProps {
  items: InvoiceItem[]
  currency: Currency
}

export function ItemsTable({ items, currency }: ItemsTableProps) {
  return (
    // 항목 테이블 컨테이너
    <section aria-label="견적 항목">
      {/* 섹션 제목 */}
      <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
        견적 항목
      </h3>

      {/* 데스크톱 테이블 레이아웃 (sm 이상에서 표시) */}
      {/* border-collapse 적용으로 인쇄 최적화 */}
      <div className="hidden overflow-hidden rounded-lg border sm:block">
        <table className="w-full border-collapse" role="table">
          {/* 테이블 헤더: bg-slate-900, text-white */}
          <thead>
            <tr className="bg-slate-900 dark:bg-slate-700">
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-white uppercase"
              >
                품목명
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-white uppercase"
              >
                수량
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-white uppercase"
              >
                단가
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-white uppercase"
              >
                금액
              </th>
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b transition-colors last:border-b-0 md:hover:bg-gray-50 dark:md:hover:bg-slate-700/50 ${
                  index % 2 === 0
                    ? 'bg-background'
                    : 'bg-blue-50/20 dark:bg-blue-950/10'
                }`}
              >
                {/* 품목명 */}
                <td className="text-foreground px-4 py-3 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {/* 순서 번호 */}
                    <span
                      className="bg-muted text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                      aria-hidden="true"
                    >
                      {item.order}
                    </span>
                    {item.itemName}
                  </div>
                </td>

                {/* 수량 */}
                <td className="text-muted-foreground px-4 py-3 text-right text-sm">
                  {formatNumber(item.quantity)}
                </td>

                {/* 단가 */}
                <td className="text-muted-foreground px-4 py-3 text-right text-sm">
                  {formatCurrency(item.unitPrice, currency)}
                </td>

                {/* 금액 */}
                <td className="text-foreground px-4 py-3 text-right text-sm font-semibold">
                  {formatCurrency(item.amount, currency)}
                </td>
              </tr>
            ))}

            {/* 합계 행: bg-gray-100, font-bold */}
            <tr className="bg-gray-100 dark:bg-slate-700">
              <td
                colSpan={3}
                className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-gray-100"
              >
                소계
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(
                  items.reduce((sum, item) => sum + item.amount, 0),
                  currency
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 레이아웃 (sm 미만에서 표시) */}
      <div
        className="flex flex-col gap-3 sm:hidden"
        role="list"
        aria-label="견적 항목 목록"
      >
        {items.map(item => (
          <div
            key={item.id}
            className="bg-card rounded-lg border border-blue-200 p-4 transition-shadow hover:shadow-md dark:border-blue-800"
            role="listitem"
          >
            {/* 항목 헤더 */}
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* 순서 번호 */}
                <span
                  className="bg-muted text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  aria-hidden="true"
                >
                  {item.order}
                </span>
                <span className="text-foreground text-sm font-medium">
                  {item.itemName}
                </span>
              </div>
              {/* 금액 */}
              <span className="text-foreground shrink-0 text-sm font-bold">
                {formatCurrency(item.amount, currency)}
              </span>
            </div>

            <Separator className="mb-3" />

            {/* 항목 세부 정보 */}
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">수량</dt>
                <dd className="text-foreground mt-0.5 font-medium">
                  {formatNumber(item.quantity)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">단가</dt>
                <dd className="text-foreground mt-0.5 font-medium">
                  {formatCurrency(item.unitPrice, currency)}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
