/**
 * API 성공 응답 타입
 */
export interface ApiResponse<T> {
  success: true
  data: T
}

/**
 * API 에러 응답 타입
 */
export interface ApiError {
  success: false
  error: string
  code?: string
}

/**
 * API 응답 결과 (성공 또는 실패)
 */
export type ApiResult<T> = ApiResponse<T> | ApiError

/**
 * 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 페이지네이션된 응답
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * API 응답 래퍼 - 페이지네이션
 */
export type PaginatedApiResponse<T> =
  | ApiResponse<PaginatedResponse<T>>
  | ApiError

/**
 * API 요청 에러 코드
 * TASK-011: 세분화된 에러 코드 추가
 */
export const API_ERROR_CODES = {
  // 인증/권한 오류
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_SESSION: 'INVALID_SESSION',
  FORBIDDEN: 'FORBIDDEN',
  // 요청 오류
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  INVALID_REQUEST: 'INVALID_REQUEST',
  // 서버/인프라 오류
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DB_NOT_CONFIGURED: 'DB_NOT_CONFIGURED',
  FETCH_FAILED: 'FETCH_FAILED',
  TRANSFORM_FAILED: 'TRANSFORM_FAILED',
  // 외부 API 오류
  NOTION_API_ERROR: 'NOTION_API_ERROR',
  // 유효성 검사 오류
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const

/**
 * API 에러 코드 타입
 */
export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

/**
 * API 에러 생성 헬퍼
 */
export function createApiError(error: string, code?: ApiErrorCode): ApiError {
  return {
    success: false,
    error,
    code,
  }
}

/**
 * API 성공 응답 생성 헬퍼
 */
export function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  }
}
