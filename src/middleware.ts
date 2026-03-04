/**
 * Next.js 미들웨어
 * 현재 인증 없이 대시보드 접근 허용
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/dashboard/:path*'],
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_request: NextRequest) {
  // 인증 없이 모든 요청 통과
  return NextResponse.next()
}
