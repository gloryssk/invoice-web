import { test, expect } from '@playwright/test'

/**
 * 페이지 스크린샷 및 UI 확인 테스트
 * - /dashboard: 로그인 없이 대시보드 접근 여부 확인
 * - /view/INV-2026-001: 견적서 뷰어 렌더링 확인
 */

test.describe('페이지 확인', () => {
  // 관리자 대시보드 접근 테스트
  test('대시보드 페이지 확인', async ({ page }) => {
    const consoleErrors: string[] = []

    // 콘솔 오류 수집
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // 대시보드 접근
    const response = await page.goto('http://localhost:3000/dashboard')
    console.log('대시보드 HTTP 상태:', response?.status())

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle')

    // 스크린샷 촬영
    await page.screenshot({
      path: 'test-results/dashboard-screenshot.png',
      fullPage: true,
    })

    // 주요 UI 요소 확인
    const title = await page.title()
    console.log('페이지 타이틀:', title)

    const url = page.url()
    console.log('현재 URL (리다이렉트 확인):', url)

    // 콘솔 오류 출력
    if (consoleErrors.length > 0) {
      console.log('콘솔 오류들:', consoleErrors)
    } else {
      console.log('콘솔 오류: 없음')
    }

    // 페이지 텍스트에서 주요 요소 확인
    const bodyText = await page.locator('body').textContent()
    const hasDashboard =
      bodyText?.includes('대시보드') || bodyText?.includes('dashboard')
    const hasLogin = bodyText?.includes('로그인') || bodyText?.includes('login')
    console.log('대시보드 텍스트 포함:', hasDashboard)
    console.log('로그인 텍스트 포함:', hasLogin)

    // 상태 코드가 200인지 확인
    expect(response?.status()).toBe(200)
  })

  // 견적서 뷰어 테스트
  test('견적서 뷰어 페이지 확인', async ({ page }) => {
    const consoleErrors: string[] = []

    // 콘솔 오류 수집
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // 견적서 뷰어 접근
    const response = await page.goto('http://localhost:3000/view/INV-2026-001')
    console.log('견적서 뷰어 HTTP 상태:', response?.status())

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle')

    // 스크린샷 촬영
    await page.screenshot({
      path: 'test-results/invoice-viewer-screenshot.png',
      fullPage: true,
    })

    // 주요 UI 요소 확인
    const title = await page.title()
    console.log('페이지 타이틀:', title)

    const url = page.url()
    console.log('현재 URL:', url)

    // 콘솔 오류 출력
    if (consoleErrors.length > 0) {
      console.log('콘솔 오류들:', consoleErrors)
    } else {
      console.log('콘솔 오류: 없음')
    }

    // INV-2026-001 텍스트가 있는지 확인
    const bodyText = await page.locator('body').textContent()
    const hasInvoiceId = bodyText?.includes('INV-2026-001')
    const has404 = bodyText?.includes('404') || bodyText?.includes('찾을 수 없')
    console.log('견적서 번호(INV-2026-001) 포함:', hasInvoiceId)
    console.log('404 오류 포함:', has404)

    // 주요 견적서 섹션 확인
    const hasIssueDate = bodyText?.includes('발행일')
    const hasClient = bodyText?.includes('클라이언트')
    const hasTotal = bodyText?.includes('합계') || bodyText?.includes('총액')
    console.log('발행일 섹션:', hasIssueDate)
    console.log('클라이언트 섹션:', hasClient)
    console.log('합계 섹션:', hasTotal)

    expect(response?.status()).toBe(200)
  })
})
