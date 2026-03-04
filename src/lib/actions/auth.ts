/**
 * 관리자 인증 Server Action
 * 로그인, 로그아웃, 세션 관리
 */

'use server'

import { cookies } from 'next/headers'
import { compare } from 'bcryptjs'
import { adminLoginSchema } from '@/types/admin'
import type { AdminLoginResponse } from '@/types/admin'

// 세션 만료 시간 (1시간)
const SESSION_EXPIRY_HOURS = 1

/**
 * 환경변수에서 관리자 패스워드 해시 가져오기
 */
function getAdminPasswordHash(): string {
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) {
    throw new Error('ADMIN_PASSWORD_HASH 환경변수가 설정되지 않았습니다')
  }
  return hash
}

/**
 * 세션 쿠키 생성 및 저장
 */
async function createSessionCookie(sessionId: string, expiresAt: string) {
  const cookieStore = await cookies()

  cookieStore.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  })

  cookieStore.set('session_expires_at', expiresAt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  })
}

/**
 * 관리자 로그인 처리
 * 패스워드를 검증하고 세션을 생성합니다
 */
export async function adminLogin(
  password: string
): Promise<AdminLoginResponse> {
  try {
    // 입력값 검증
    const validatedData = adminLoginSchema.parse({ password })

    // 환경변수에서 해시된 패스워드 가져오기
    const storedHash = getAdminPasswordHash()

    // bcryptjs로 패스워드 검증
    const isPasswordValid = await compare(validatedData.password, storedHash)

    if (!isPasswordValid) {
      return {
        success: false,
        error: '비밀번호가 올바르지 않습니다',
      }
    }

    // 세션 생성
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`
    const expiresAt = new Date(
      Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000
    ).toISOString()

    // 세션 쿠키 저장
    await createSessionCookie(sessionId, expiresAt)

    return {
      success: true,
      sessionId,
      expiresAt,
    }
  } catch (error) {
    console.error('로그인 처리 중 오류:', error)

    if (
      error instanceof SyntaxError ||
      (typeof error === 'object' && error !== null && 'issues' in error)
    ) {
      return {
        success: false,
        error: '입력값이 올바르지 않습니다',
      }
    }

    return {
      success: false,
      error: '로그인 처리 중 오류가 발생했습니다',
    }
  }
}

/**
 * 관리자 로그아웃 처리
 * 세션 쿠키 삭제
 */
export async function adminLogout(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session_id')
    cookieStore.delete('session_expires_at')
    return { success: true }
  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error)
    return { success: false }
  }
}

/**
 * 현재 세션 조회
 * 클라이언트에서 세션 상태를 확인할 때 사용
 */
export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value
    const expiresAt = cookieStore.get('session_expires_at')?.value

    if (!sessionId || !expiresAt) {
      return null
    }

    // 세션 만료 확인
    if (new Date(expiresAt) < new Date()) {
      // 만료된 세션 삭제
      cookieStore.delete('session_id')
      cookieStore.delete('session_expires_at')
      return null
    }

    return {
      sessionId,
      expiresAt,
      isAuthenticated: true,
    }
  } catch (error) {
    console.error('세션 조회 중 오류:', error)
    return null
  }
}
