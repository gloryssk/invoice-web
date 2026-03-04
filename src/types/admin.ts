import { z } from 'zod'

/**
 * 관리자 세션 인터페이스
 */
export interface AdminSession {
  sessionId: string
  isAuthenticated: boolean
  authenticatedAt: string
  expiresAt: string
}

/**
 * 관리자 로그인 요청 인터페이스
 */
export interface AdminLoginRequest {
  password: string
}

/**
 * 관리자 로그인 응답 인터페이스
 */
export interface AdminLoginResponse {
  success: boolean
  sessionId?: string
  expiresAt?: string
  error?: string
}

/**
 * Zod 검증 스키마 - 관리자 로그인
 */
export const adminLoginSchema = z.object({
  password: z
    .string()
    .min(1, '비밀번호는 필수입니다')
    .max(255, '비밀번호는 255자 이하여야 합니다'),
})

/**
 * 관리자 세션 검증 스키마
 */
export const adminSessionSchema = z.object({
  sessionId: z.string().min(1, '세션 ID는 필수입니다'),
  isAuthenticated: z.boolean(),
  authenticatedAt: z
    .string()
    .datetime({ message: '인증 시간은 ISO 날짜 형식이어야 합니다' }),
  expiresAt: z
    .string()
    .datetime({ message: '만료 시간은 ISO 날짜 형식이어야 합니다' }),
})
