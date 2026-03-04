/**
 * 공개 견적서 API 라우트
 * GET /api/invoices
 * GET /api/invoices?slug=INV-2026-001
 *
 * 구조:
 * - slug 파라미터 없음: 모든 견적서 목록 반환
 * - slug 파라미터 있음: 특정 견적서 반환
 * - 에러 케이스별 세분화된 응답 코드 처리 (TASK-011)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllInvoices, getInvoiceBySlug } from '@/lib/notion'
import { createApiResponse, createApiError, API_ERROR_CODES } from '@/types'

/**
 * API 응답 캐싱 설정
 * ISR: 1시간마다 재검증 (뷰어는 느린 업데이트 가능)
 */
export const revalidate = 3600

/**
 * GET /api/invoices
 * GET /api/invoices?slug=INV-2026-001
 *
 * 견적서 조회 API
 * - slug 파라미터 없음: 모든 견적서 목록 반환
 * - slug 파라미터 있음: 특정 견적서만 반환
 */
export async function GET(request: NextRequest) {
  // --------------------------------------------------------
  // 쿼리 파라미터 추출
  // --------------------------------------------------------
  const slug = request.nextUrl.searchParams.get('slug')

  // slug가 있는 경우: 특정 견적서 조회
  if (slug !== null) {
    // slug 값 검증 (빈 문자열 허용 안 함)
    if (!slug.trim()) {
      return NextResponse.json(
        createApiError(
          '유효한 견적서 번호를 입력해주세요.',
          API_ERROR_CODES.INVALID_REQUEST
        ),
        { status: 400 }
      )
    }

    // --------------------------------------------------------
    // 노션 DB ID 환경변수 확인
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
    // 특정 견적서 조회
    // --------------------------------------------------------
    try {
      let invoice
      try {
        invoice = await getInvoiceBySlug(slug)
      } catch (fetchError) {
        console.error(`견적서 조회 실패 (slug: ${slug}):`, fetchError)
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
            '견적서 데이터를 불러오는 중 오류가 발생했습니다.',
            API_ERROR_CODES.FETCH_FAILED
          ),
          { status: 500 }
        )
      }

      // 견적서가 없으면 404
      if (!invoice) {
        return NextResponse.json(
          createApiError(
            '견적서를 찾을 수 없습니다',
            API_ERROR_CODES.NOT_FOUND
          ),
          { status: 404 }
        )
      }

      return NextResponse.json(createApiResponse(invoice), {
        status: 200,
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      })
    } catch (error) {
      console.error('API 라우트 오류 - GET /api/invoices (slug):', error)
      return NextResponse.json(
        createApiError(
          '견적서 조회 중 오류가 발생했습니다',
          API_ERROR_CODES.INTERNAL_SERVER_ERROR
        ),
        { status: 500 }
      )
    }
  }

  // --------------------------------------------------------
  // 모든 견적서 조회
  // --------------------------------------------------------

  // 노션 DB ID 환경변수 확인
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

  try {
    let invoices
    try {
      invoices = await getAllInvoices()
    } catch (fetchError) {
      console.error('모든 견적서 조회 실패:', fetchError)
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

    return NextResponse.json(createApiResponse(invoices), {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('API 라우트 오류 - GET /api/invoices:', error)
    return NextResponse.json(
      createApiError(
        '견적서 조회 중 오류가 발생했습니다',
        API_ERROR_CODES.INTERNAL_SERVER_ERROR
      ),
      { status: 500 }
    )
  }
}
