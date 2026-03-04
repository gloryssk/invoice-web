/**
 * 견적서 Zustand 스토어
 *
 * 구조:
 * - 상태: invoices(목록), isLoading(로딩), error(에러메시지)
 * - 액션: fetchInvoices(목록 조회), refreshInvoices(강제 새로고침), clearInvoices(초기화)
 * - 세션 만료 감지: 401 응답 시 onUnauthorized 콜백 호출
 */

import { create } from 'zustand'
import type { Invoice } from '@/types/invoice'
import { API_ERROR_CODES } from '@/types/api'

// ============================================================
// 타입 정의
// ============================================================

/** 스토어 상태 타입 */
interface InvoiceState {
  /** 견적서 목록 */
  invoices: Invoice[]
  /** 데이터 로딩 중 여부 */
  isLoading: boolean
  /** 에러 메시지 (없으면 null) */
  error: string | null
  /** 마지막 조회 시간 (캐시 무효화용) */
  lastFetchedAt: Date | null
}

/** 스토어 액션 타입 */
interface InvoiceActions {
  /**
   * 견적서 목록 조회
   * @param onUnauthorized - 401 응답 시 호출되는 콜백 (세션 만료 처리)
   */
  fetchInvoices: (onUnauthorized?: () => void) => Promise<void>
  /**
   * 견적서 목록 강제 새로고침
   * @param onUnauthorized - 401 응답 시 호출되는 콜백
   */
  refreshInvoices: (onUnauthorized?: () => void) => Promise<void>
  /** 스토어 상태 초기화 */
  clearInvoices: () => void
}

/** 스토어 전체 타입 */
type InvoiceStore = InvoiceState & InvoiceActions

// ============================================================
// API 응답 타입 (내부용)
// ============================================================

/** /api/admin/invoices 응답 성공 타입 */
interface FetchInvoicesSuccess {
  success: true
  data: Invoice[]
}

/** /api/admin/invoices 응답 실패 타입 */
interface FetchInvoicesError {
  success: false
  error: string
  code?: string
}

/** /api/admin/invoices 응답 타입 */
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

/**
 * 견적서 Zustand 스토어
 * 관리자 대시보드에서 견적서 목록을 관리
 */
export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  // 초기 상태 확산
  ...initialState,

  // --------------------------------------------------------
  // fetchInvoices: 견적서 목록 조회
  // --------------------------------------------------------
  fetchInvoices: async (onUnauthorized?: () => void) => {
    // 이미 로딩 중이면 중복 요청 방지
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      // 관리자 API 엔드포인트 호출
      const response = await fetch('/api/admin/invoices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 캐시 비활성화 (항상 최신 데이터 조회)
        cache: 'no-store',
      })

      // 401 세션 만료 또는 미인증 처리
      // UNAUTHORIZED (쿠키 없음) 또는 INVALID_SESSION (만료) 모두 로그아웃 처리
      if (response.status === 401) {
        // 응답 본문에서 에러 코드 확인
        let errorCode: string | undefined
        try {
          const errorBody: { code?: string } = await response.json()
          errorCode = errorBody.code
        } catch {
          errorCode = undefined
        }

        const errorMessage =
          errorCode === API_ERROR_CODES.INVALID_SESSION
            ? '세션이 만료되었습니다. 다시 로그인해주세요.'
            : '인증이 필요합니다. 다시 로그인해주세요.'

        set({ isLoading: false, error: errorMessage })
        // 콜백이 있으면 호출 (로그인 페이지 리다이렉트 등)
        onUnauthorized?.()
        return
      }

      // 응답 파싱
      const result: FetchInvoicesResponse = await response.json()

      if (!result.success) {
        // API 에러 코드별 메시지 처리
        const errorMessage = getErrorMessage(result.code, result.error)
        set({ isLoading: false, error: errorMessage })
        return
      }

      // 성공: 데이터 저장
      set({
        invoices: result.data,
        isLoading: false,
        error: null,
        lastFetchedAt: new Date(),
      })
    } catch (error) {
      // 네트워크 오류 등 예외 처리
      console.error('견적서 목록 조회 중 오류:', error)
      set({
        isLoading: false,
        error: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      })
    }
  },

  // --------------------------------------------------------
  // refreshInvoices: 강제 새로고침 (캐시 무시)
  // --------------------------------------------------------
  refreshInvoices: async (onUnauthorized?: () => void) => {
    // 로딩 상태 강제 초기화 후 재조회
    set({ isLoading: false })
    await get().fetchInvoices(onUnauthorized)
  },

  // --------------------------------------------------------
  // clearInvoices: 스토어 초기화
  // --------------------------------------------------------
  clearInvoices: () => {
    set(initialState)
  },
}))

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * API 에러 코드를 사용자 친화적 메시지로 변환
 * TASK-011: 세분화된 에러 코드 처리 추가
 */
function getErrorMessage(code: string | undefined, fallback: string): string {
  switch (code) {
    case API_ERROR_CODES.UNAUTHORIZED:
      return '인증이 필요합니다. 다시 로그인해주세요.'
    case API_ERROR_CODES.INVALID_SESSION:
      return '세션이 만료되었습니다. 다시 로그인해주세요.'
    case API_ERROR_CODES.FORBIDDEN:
      return '접근 권한이 없습니다.'
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
