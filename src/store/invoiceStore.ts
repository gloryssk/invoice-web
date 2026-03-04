/**
 * 견적서 Zustand 스토어
 *
 * 구조:
 * - 상태: invoices(목록), isLoading(로딩), error(에러메시지)
 * - 액션: fetchInvoices(목록 조회), refreshInvoices(강제 새로고침), clearInvoices(초기화)
 */

import { create } from 'zustand'
import type { Invoice } from '@/types/invoice'
import { API_ERROR_CODES } from '@/types/api'

// ============================================================
// 타입 정의
// ============================================================

interface InvoiceState {
  invoices: Invoice[]
  isLoading: boolean
  error: string | null
  lastFetchedAt: Date | null
}

interface InvoiceActions {
  fetchInvoices: () => Promise<void>
  refreshInvoices: () => Promise<void>
  clearInvoices: () => void
}

type InvoiceStore = InvoiceState & InvoiceActions

// API 응답 타입
interface FetchInvoicesSuccess {
  success: true
  data: Invoice[]
}

interface FetchInvoicesError {
  success: false
  error: string
  code?: string
}

type FetchInvoicesResponse = FetchInvoicesSuccess | FetchInvoicesError

// ============================================================
// 초기 상태
// ============================================================

const initialState: InvoiceState = {
  invoices: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,
}

// ============================================================
// 스토어 구현
// ============================================================

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  ...initialState,

  // 견적서 목록 조회
  fetchInvoices: async () => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/admin/invoices', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })

      const result: FetchInvoicesResponse = await response.json()

      if (!result.success) {
        const errorMessage = getErrorMessage(result.code, result.error)
        set({ isLoading: false, error: errorMessage })
        return
      }

      set({
        invoices: result.data,
        isLoading: false,
        error: null,
        lastFetchedAt: new Date(),
      })
    } catch (error) {
      console.error('견적서 목록 조회 중 오류:', error)
      set({
        isLoading: false,
        error: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      })
    }
  },

  // 강제 새로고침 (캐시 무시)
  refreshInvoices: async () => {
    set({ isLoading: false })
    await get().fetchInvoices()
  },

  // 스토어 초기화
  clearInvoices: () => {
    set(initialState)
  },
}))

// ============================================================
// 에러 코드 → 메시지 변환
// ============================================================

function getErrorMessage(code: string | undefined, fallback: string): string {
  switch (code) {
    case API_ERROR_CODES.DB_NOT_CONFIGURED:
      return '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.'
    case API_ERROR_CODES.FETCH_FAILED:
      return '데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    case API_ERROR_CODES.TRANSFORM_FAILED:
      return '데이터 처리 중 오류가 발생했습니다. 관리자에게 문의해주세요.'
    case API_ERROR_CODES.NOTION_API_ERROR:
      return '노션 API 연동 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    case API_ERROR_CODES.INTERNAL_SERVER_ERROR:
      return '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    default:
      return fallback || '알 수 없는 오류가 발생했습니다.'
  }
}
