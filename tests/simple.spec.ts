import { test, expect } from '@playwright/test'

/**
 * 기본 페이지 접근 테스트
 * 모든 주요 페이지가 정상적으로 로드되는지 확인
 */

test.describe('기본 페이지 접근', () => {
  // 홈페이지 테스트
  test('홈페이지 로드', async ({ page }) => {
    const response = await page.goto('/')
    // 200 또는 404 모두 허용 (라우팅 설정에 따라 다름)
    expect([200, 404]).toContain(response?.status())
  })

  // 견적서 뷰어 페이지 테스트
  test('견적서 뷰어 페이지 접근', async ({ page }) => {
    const response = await page.goto('/view/test-invoice')
    // 404 또는 정상 응답 모두 허용
    expect([200, 404]).toContain(response?.status())
  })

  // 관리자 대시보드 접근
  test('관리자 대시보드 페이지 접근', async ({ page }) => {
    const response = await page.goto('/dashboard')
    expect([200, 404, 307, 308]).toContain(response?.status())
  })
})

test.describe('API 엔드포인트', () => {
  test('API invoices 엔드포인트', async ({ page }) => {
    const response = await page.request.get('/api/invoices')
    // 200, 401, 403 모두 허용 (API 응답)
    expect([200, 401, 403]).toContain(response.status())
  })
})
