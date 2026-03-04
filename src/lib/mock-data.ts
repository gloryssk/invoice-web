/**
 * 개발용 더미 데이터
 * 실제 노션 API 연동 전 레이아웃 검증을 위해 사용합니다.
 */

import type { Invoice } from '@/types/invoice'

// 견적서 더미 데이터
export const mockInvoiceData: Invoice = {
  id: 'mock-001',
  slug: 'INV-2026-001',
  invoiceNumber: 'INV-2026-001',
  title: '웹사이트 디자인 및 개발',
  clientName: '(주)테크스타트업',
  status: 'pending',
  issueDate: new Date('2026-03-04').toISOString(),
  expiryDate: new Date('2026-06-04').toISOString(),
  totalAmount: 3300000,
  currency: 'KRW',
  items: [
    {
      id: '1',
      itemName: '웹사이트 디자인 (UI/UX)',
      quantity: 1,
      unitPrice: 1000000,
      amount: 1000000,
      order: 1,
    },
    {
      id: '2',
      itemName: '프론트엔드 개발 (Next.js)',
      quantity: 1,
      unitPrice: 1500000,
      amount: 1500000,
      order: 2,
    },
    {
      id: '3',
      itemName: '백엔드 API 개발',
      quantity: 1,
      unitPrice: 500000,
      amount: 500000,
      order: 3,
    },
    {
      id: '4',
      itemName: '배포 및 인프라 설정',
      quantity: 1,
      unitPrice: 200000,
      amount: 200000,
      order: 4,
    },
    {
      id: '5',
      itemName: '유지보수 (3개월)',
      quantity: 3,
      unitPrice: 100000,
      amount: 300000,
      order: 5,
    },
  ],
  notes: '결제 후 유지보수 3개월 제공\n추가 기능 요청 시 별도 견적 협의',
  paymentTerms:
    '선금 50%, 완료 시 잔금 50%\n계좌: 국민은행 123-456-789012 (주)글로리디자인',
}
