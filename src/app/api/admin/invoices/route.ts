/**
 * 관리자용 견적서 목록 API 라우트
 * GET /api/admin/invoices
 *
 * 구조:
 * - 인증 없이 노션 API로 전체 견적서 목록 조회
 * - JSON 응답: { success: true, data: Invoice[] } 또는 에러
 */

import { NextResponse } from 'next/server'
import { getAllInvoices } from '@/lib/notion/queries'
import { createApiError, createApiResponse, API_ERROR_CODES } from '@/types/api'

/**
 * 견적서 목록 조회 핸들러
 */
export async function GET() {
  // 노션 DB ID 환경변수 확인
  if (!process.env.NOTION_INVOICES_DB_ID) {
    console.error('NOTION_INVOICES_DB_ID 환경변수가 설정되지 않았습니다')
    return NextResponse.json(
      createApiError(
        '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.',
        API_ERROR_CODES.DB_NOT_CONFIGURED
      ),
      { status: 500 }
    )
  }

  try {
    const invoices = await getAllInvoices()
    return NextResponse.json(createApiResponse(invoices), {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=300, must-revalidate',
      },
    })
  } catch (error) {
    console.error('견적서 목록 조회 실패:', error)
    const errorMsg = error instanceof Error ? error.message : ''

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
        '서버 내부 오류가 발생했습니다.',
        API_ERROR_CODES.INTERNAL_SERVER_ERROR
      ),
      { status: 500 }
    )
  }
}
