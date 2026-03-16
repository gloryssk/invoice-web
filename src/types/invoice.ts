import { z } from 'zod'

/**
 * 견적서 상태 타입
 * - draft: 작성 중
 * - pending: 대기 중
 * - approved: 승인됨
 * - expired: 만료됨
 */
export type InvoiceStatus = 'draft' | 'pending' | 'approved' | 'expired'

/**
 * 통화 타입
 */
export type Currency = 'KRW' | 'USD'

/**
 * 견적서 항목 인터페이스
 */
export interface InvoiceItem {
  id: string
  itemName: string
  quantity: number
  unitPrice: number
  amount: number
  order: number
}

/**
 * 견적서 핵심 인터페이스
 */
export interface Invoice {
  id: string
  slug: string
  invoiceNumber: string
  title: string
  clientName: string
  status: InvoiceStatus
  issueDate: string
  expiryDate: string
  totalAmount: number
  currency: Currency
  items: InvoiceItem[]
  notes?: string
  paymentTerms?: string
}

/**
 * 견적서 생성 시 필요한 필드 (id 제외)
 */
export type InvoiceCreateInput = Omit<Invoice, 'id'>

/**
 * 견적서 수정 시 필요한 필드 (일부 필드만 수정 가능)
 */
export type InvoiceUpdateInput = Partial<
  Omit<Invoice, 'id' | 'slug' | 'invoiceNumber' | 'issueDate'>
>

/**
 * Zod 검증 스키마 - 견적서 항목
 */
export const invoiceItemSchema = z.object({
  id: z.string().min(1, '항목 ID는 필수입니다'),
  itemName: z.string().min(1, '항목명은 필수입니다').max(255),
  quantity: z.number().min(1, '수량은 1 이상이어야 합니다'),
  unitPrice: z.number().min(0, '단가는 0 이상이어야 합니다'),
  amount: z.number().min(0, '금액은 0 이상이어야 합니다'),
  order: z.number().min(0, '순서는 0 이상이어야 합니다'),
})

/**
 * Zod 검증 스키마 - 견적서
 */
export const invoiceSchema = z.object({
  id: z.string().min(1, '견적서 ID는 필수입니다'),
  slug: z
    .string()
    .min(1, '견적서 번호는 필수입니다')
    .regex(
      /^[A-Z0-9-]+$/,
      '견적서 번호는 영문 대문자, 숫자, 하이픈만 포함 가능합니다'
    ),
  invoiceNumber: z.string().min(1, '견적서 번호는 필수입니다').max(50),
  title: z.string().min(1, '제목은 필수입니다').max(255),
  clientName: z.string().min(1, '클라이언트명은 필수입니다').max(255),
  status: z.enum(['draft', 'pending', 'approved', 'expired']),
  issueDate: z
    .string()
    .datetime({ message: '발행일은 ISO 날짜 형식이어야 합니다' }),
  expiryDate: z
    .string()
    .datetime({ message: '유효기간은 ISO 날짜 형식이어야 합니다' }),
  totalAmount: z.number().min(0, '총금액은 0 이상이어야 합니다'),
  currency: z.enum(['KRW', 'USD']),
  items: z.array(invoiceItemSchema).min(1, '항목은 최소 1개 이상 필요합니다'),
  notes: z.string().max(1000).optional(),
  paymentTerms: z.string().max(500).optional(),
})

/**
 * Zod 검증 스키마 - 견적서 생성
 */
export const invoiceCreateSchema = invoiceSchema.omit({ id: true })

/**
 * Zod 검증 스키마 - 견적서 수정
 */
export const invoiceUpdateSchema = invoiceSchema
  .omit({ id: true, slug: true, invoiceNumber: true, issueDate: true })
  .partial()

/**
 * 신고 처리 상태
 * - pending: 처리 중
 * - completed: 처리 완료
 */
export type ReportStatus = 'pending' | 'completed'

/**
 * 견적서별 신고 데이터
 */
export interface ReportEntry {
  slug: string
  status: ReportStatus
  reportContent: string // 신고 내용 텍스트
  updatedAt: string // ISO 날짜
}
