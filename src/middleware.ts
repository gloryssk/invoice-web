/**
 * Next.js 미들웨어
 * 관리자 대시보드 접근 제어
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 미들웨어 실행 경로 설정
 */
export const config = {
  matcher: ['/dashboard/:path*'],
}

/**
 * 미들웨어 실행 함수
 */
export function middleware(request: NextRequest) {
  // 요청 경로 확인
  const pathname = request.nextUrl.pathname

  // 대시보드 접근인 경우 인증 확인
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    // 쿠키에서 세션 확인
    const sessionId = request.cookies.get('session_id')?.value
    const expiresAt = request.cookies.get('session_expires_at')?.value

    // 세션이 없거나 만료된 경우
    if (!sessionId || !expiresAt) {
      // 로그인 페이지로 리다이렉트
      return NextResponse.redirect(
        new URL('/dashboard?auth=required', request.url)
      )
    }

    // 세션 만료 확인
    if (new Date(expiresAt) < new Date()) {
      // 세션 쿠키 삭제
      const response = NextResponse.redirect(
        new URL('/dashboard?auth=expired', request.url)
      )
      response.cookies.delete('session_id')
      response.cookies.delete('session_expires_at')
      return response
    }
  }

  // 다른 경로는 통과
  return NextResponse.next()
}
