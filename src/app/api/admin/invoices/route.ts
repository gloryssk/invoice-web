/**
 * 관리자용 견적서 목록 API 라우트
 * GET /api/admin/invoices
 *
 * 구조:
 * - 세션 인증 검증 (쿠키 기반)
 * - 노션 API로 전체 견적서 목록 조회
 * - JSON 응답: { success: true, data: Invoice[] } 또는 에러
 * - 세분화된 에러 코드 처리 (TASK-011)
 *
 * 인증 필요: session_id + session_expires_at 쿠키
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAllInvoices } from '@/lib/notion/queries'
import { createApiError, createApiResponse, API_ERROR_CODES } from '@/types/api'

// ============================================================
// 인증 검증 유틸리티
// ============================================================

/** 세션 검증 결과 타입 */
type SessionValidationResult =
  | { valid: true }
  | { valid: false; reason: 'no_cookie' | 'expired' | 'error' }

/**
 * 쿠키 기반 세션 인증 검증
 * 세션 쿠키 존재 여부와 만료 시간을 검사
 * @returns 세션 유효성 검증 결과
 */
async function validateSession(): Promise<SessionValidationResult> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value
    const expiresAt = cookieStore.get('session_expires_at')?.value

    // 세션 쿠키 없음 → UNAUTHORIZED
    if (!sessionId || !expiresAt) {
      return { valid: false, reason: 'no_cookie' }
    }

    // 세션 만료 확인 → INVALID_SESSION
    if (new Date(expiresAt) < new Date()) {
      return { valid: false, reason: 'expired' }
    }

    return { valid: true }
  } catch (error) {
    console.error('세션 검증 중 오류:', error)
    return { valid: false, reason: 'error' }
  }
}

// ============================================================
// GET /api/admin/invoices
// ============================================================

/**
 * 견적서 목록 조회 핸들러
 * 인증된 관리자만 접근 가능
 */
export async function GET() {
  // --------------------------------------------------------
  // 1단계: 세션 인증 검증
  // --------------------------------------------------------
  const sessionResult = await validateSession()

  if (!sessionResult.valid) {
    // 쿠키 없음: 401 UNAUTHORIZED
    if (sessionResult.reason === 'no_cookie') {
      return NextResponse.json(
        createApiError(
          '인증이 필요합니다. 로그인 후 이용해주세요.',
          API_ERROR_CODES.UNAUTHORIZED
        ),
        { status: 401 }
      )
    }

    // 세션 만료 또는 검증 오류: 401 INVALID_SESSION
    return NextResponse.json(
      createApiError(
        '세션이 만료되었습니다. 다시 로그인해주세요.',
        API_ERROR_CODES.INVALID_SESSION
      ),
      { status: 401 }
    )
  }

  // --------------------------------------------------------
  // 2단계: 노션 DB ID 환경변수 확인
  // --------------------------------------------------------
  if (!process.env.NOTION_INVOICES_DB_ID || !process.env.NOTION_ITEMS_DB_ID) {
    console.error('노션 데이터베이스 ID 환경변수가 설정되지 않았습니다')
    return NextResponse.json(
      createApiError(
        '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.',
        API_ERROR_CODES.DB_NOT_CONFIGURED
      ),
      { status: 500 }
    )
  }

  // --------------------------------------------------------
  // 3단계: 노션 API로 견적서 목록 조회
  // --------------------------------------------------------
  try {
    let invoices
    try {
      invoices = await getAllInvoices()
    } catch (fetchError) {
      console.error('견적서 목록 조회 실패:', fetchError)
      // 데이터 변환 오류와 조회 오류 구분
      const errorMsg = fetchError instanceof Error ? fetchError.message : ''
      if (errorMsg.includes('변환') || errorMsg.includes('transform')) {
        return NextResponse.json(
          createApiError(
            '견적서 데이터를 처리하는 중 오류가 발생했습니다.',
            API_ERROR_CODES.TRANSFORM_FAILED
          ),
          { status: 500 }
        )
      }
      return NextResponse.json(
        createApiError(
          '견적서 목록을 불러오는 중 오류가 발생했습니다.',
          API_ERROR_CODES.FETCH_FAILED
        ),
        { status: 500 }
      )
    }

    // 성공 응답 반환
    return NextResponse.json(createApiResponse(invoices), {
      status: 200,
      headers: {
        // 대시보드는 5분 캐시 (ISR 재검증 주기)
        'Cache-Control': 'private, max-age=300, must-revalidate',
      },
    })
  } catch (error) {
    // --------------------------------------------------------
    // 4단계: 예상치 못한 에러 처리
    // --------------------------------------------------------
    console.error('관리자 견적서 목록 조회 중 예상치 못한 오류:', error)

    return NextResponse.json(
      createApiError(
        '서버 내부 오류가 발생했습니다.',
        API_ERROR_CODES.INTERNAL_SERVER_ERROR
      ),
      { status: 500 }
    )
  }
}
