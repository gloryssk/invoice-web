import type {
  NotionInvoiceRaw,
  NotionItemRaw,
  Invoice,
  InvoiceItem,
} from '@/types'

/**
 * 문자열에서 숫자 추출 헬퍼 함수
 * "₩300,000" 또는 "300,000" 형식을 숫자로 변환
 */
function extractNumber(value: string): number {
  if (!value) return 0
  const cleaned = value.replace(/[^\d]/g, '')
  return parseInt(cleaned, 10) || 0
}

/**
 * 한글 날짜 문자열을 ISO 형식으로 변환
 * "2026년 3월 4일" → "2026-03-04T00:00:00Z"
 */
function parseKoreanDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString()

  // 정규식: "2026년 3월 4일" 형식 파싱
  const match = dateStr.match(/(\d{4})년\s+(\d{1,2})월\s+(\d{1,2})일/)
  if (!match) return new Date().toISOString()

  const [, year, month, day] = match
  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  )
  return date.toISOString()
}

/**
 * 견적서 상태 문자열을 표준 상태로 정규화
 * "대기" → "pending", "승인됨" → "approved" 등
 */
function normalizeStatus(
  statusStr: string
): 'draft' | 'pending' | 'approved' | 'expired' {
  const statusMap: Record<
    string,
    'draft' | 'pending' | 'approved' | 'expired'
  > = {
    대기: 'pending',
    대기중: 'pending',
    작성: 'draft',
    작성중: 'draft',
    승인: 'approved',
    승인됨: 'approved',
    만료: 'expired',
    만료됨: 'expired',
  }

  return statusMap[statusStr] || 'draft'
}

/**
 * 노션 항목 응답을 InvoiceItem으로 변환
 */
export function mapNotionItemToInvoiceItem(
  item: NotionItemRaw,
  order: number
): InvoiceItem {
  return {
    id: item.id || `item-${order}`,
    itemName: item.항목명 || '',
    quantity:
      typeof item.수량 === 'string' ? parseInt(item.수량, 10) : item.수량,
    unitPrice: extractNumber(item.단가),
    amount: extractNumber(item.금액),
    order,
  }
}

/**
 * 노션 견적서 응답을 Invoice로 변환
 * 연관된 항목 배열을 받아 함께 변환
 */
export function mapNotionInvoiceToInvoice(
  invoice: NotionInvoiceRaw,
  items: InvoiceItem[]
): Invoice {
  // 총금액 계산: 항목에서 amount 합계 또는 노션에서 제공된 값
  let totalAmount = extractNumber(invoice.총금액)
  if (totalAmount === 0) {
    totalAmount = items.reduce((sum, item) => sum + item.amount, 0)
  }

  return {
    id: invoice.id || invoice.견적서_번호,
    slug: invoice.견적서_번호,
    invoiceNumber: invoice.견적서_번호,
    title: invoice.제목 || invoice.견적서_번호,
    clientName: invoice.클라이언트명 || '',
    status: normalizeStatus(invoice.상태),
    issueDate: parseKoreanDate(invoice.발행일),
    expiryDate: parseKoreanDate(invoice.유효기간),
    totalAmount,
    currency: 'KRW',
    items,
    notes: invoice.메모,
    paymentTerms: invoice.결제조건,
  }
}

/**
 * 노션 항목 배열을 Invoice 항목으로 변환 (정렬 포함)
 */
export function mapNotionItemsToInvoiceItems(
  items: NotionItemRaw[]
): InvoiceItem[] {
  return items
    .map((item, index) => {
      const order =
        typeof item.순서 === 'string'
          ? parseInt(item.순서, 10)
          : item.순서 || index
      return mapNotionItemToInvoiceItem(item, order)
    })
    .sort((a, b) => a.order - b.order)
}
