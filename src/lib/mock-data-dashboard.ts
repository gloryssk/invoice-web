/**
 * 관리자 대시보드용 더미 데이터
 * TASK-008에서 실제 노션 API로 교체 예정
 *
 * 구조:
 * - MockInvoice 타입 정의
 * - mockDashboardInvoices 더미 데이터 배열
 */

// ============================================================
// 타입 정의
// ============================================================

/** 대시보드 목록용 견적서 타입 */
export interface MockInvoice {
  /** 고유 식별자 */
  id: string
  /** 견적서 번호 (예: INV-2026-001) */
  invoiceNumber: string
  /** 클라이언트명 */
  clientName: string
  /** 견적 금액 (원화 기준) */
  amount: number
  /** 발행일 (ISO 형식) */
  issuedDate: string
  /** 유효기간 (ISO 형식) */
  expirationDate: string
  /** 상태: 유효 | 만료 | 곧 만료 */
  status: 'valid' | 'expired' | 'expiring_soon'
  /** 공개 조회 슬러그 */
  slug: string
}

// ============================================================
// 더미 데이터
// ============================================================

/** 대시보드 더미 견적서 목록 */
export const mockDashboardInvoices: MockInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-001',
    clientName: '(주)테크스타트업',
    amount: 3300000,
    issuedDate: '2026-01-15T00:00:00.000Z',
    expirationDate: '2026-04-15T00:00:00.000Z',
    status: 'valid',
    slug: 'INV-2026-001',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-002',
    clientName: '미래디자인스튜디오',
    amount: 1500000,
    issuedDate: '2026-02-01T00:00:00.000Z',
    expirationDate: '2026-03-10T00:00:00.000Z',
    status: 'expiring_soon',
    slug: 'INV-2026-002',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-003',
    clientName: '(주)글로벌커머스',
    amount: 8750000,
    issuedDate: '2025-11-20T00:00:00.000Z',
    expirationDate: '2026-02-20T00:00:00.000Z',
    status: 'expired',
    slug: 'INV-2026-003',
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-004',
    clientName: '스마트팩토리 솔루션',
    amount: 5200000,
    issuedDate: '2026-02-10T00:00:00.000Z',
    expirationDate: '2026-05-10T00:00:00.000Z',
    status: 'valid',
    slug: 'INV-2026-004',
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV-2026-005',
    clientName: '(주)헬스케어플러스',
    amount: 2100000,
    issuedDate: '2026-01-30T00:00:00.000Z',
    expirationDate: '2026-03-07T00:00:00.000Z',
    status: 'expiring_soon',
    slug: 'INV-2026-005',
  },
  {
    id: 'inv-006',
    invoiceNumber: 'INV-2025-098',
    clientName: '(주)에듀테크코리아',
    amount: 4600000,
    issuedDate: '2025-09-01T00:00:00.000Z',
    expirationDate: '2025-12-01T00:00:00.000Z',
    status: 'expired',
    slug: 'INV-2025-098',
  },
  {
    id: 'inv-007',
    invoiceNumber: 'INV-2026-006',
    clientName: '모바일앱연구소',
    amount: 6800000,
    issuedDate: '2026-02-20T00:00:00.000Z',
    expirationDate: '2026-05-20T00:00:00.000Z',
    status: 'valid',
    slug: 'INV-2026-006',
  },
  {
    id: 'inv-008',
    invoiceNumber: 'INV-2026-007',
    clientName: '(주)핀테크솔루션',
    amount: 12000000,
    issuedDate: '2026-01-05T00:00:00.000Z',
    expirationDate: '2026-04-05T00:00:00.000Z',
    status: 'valid',
    slug: 'INV-2026-007',
  },
  {
    id: 'inv-009',
    invoiceNumber: 'INV-2025-097',
    clientName: '클라우드인프라(주)',
    amount: 3900000,
    issuedDate: '2025-08-15T00:00:00.000Z',
    expirationDate: '2025-11-15T00:00:00.000Z',
    status: 'expired',
    slug: 'INV-2025-097',
  },
  {
    id: 'inv-010',
    invoiceNumber: 'INV-2026-008',
    clientName: '(주)소셜미디어랩',
    amount: 900000,
    issuedDate: '2026-02-25T00:00:00.000Z',
    expirationDate: '2026-05-25T00:00:00.000Z',
    status: 'valid',
    slug: 'INV-2026-008',
  },
  {
    id: 'inv-011',
    invoiceNumber: 'INV-2026-009',
    clientName: '(주)리테일테크',
    amount: 7350000,
    issuedDate: '2026-03-01T00:00:00.000Z',
    expirationDate: '2026-06-01T00:00:00.000Z',
    status: 'valid',
    slug: 'INV-2026-009',
  },
  {
    id: 'inv-012',
    invoiceNumber: 'INV-2026-010',
    clientName: '데이터분석연구소',
    amount: 2800000,
    issuedDate: '2026-02-15T00:00:00.000Z',
    expirationDate: '2026-03-12T00:00:00.000Z',
    status: 'expiring_soon',
    slug: 'INV-2026-010',
  },
]

// ============================================================
// 유틸리티 상수
// ============================================================

/** 상태별 표시 정보 */
export const STATUS_CONFIG = {
  valid: {
    label: '유효',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  expired: {
    label: '만료',
    className: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  },
  expiring_soon: {
    label: '곧 만료',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
} as const
