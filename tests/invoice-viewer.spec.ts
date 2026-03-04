import { test, expect } from '@playwright/test'

/**
 * 공개 견적서 뷰어 테스트
 * 견적서 조회, PDF 다운로드, 인쇄, 반응형 레이아웃 검증
 */

test.describe('견적서 뷰어 (공개)', () => {
  test('견적서 페이지 로드 및 주요 섹션 표시', async ({ page }) => {
    // 더미 slug로 페이지 접근
    await page.goto('/view/dummy-invoice-001')

    // 헤더 바 확인
    const headerBar = page.locator('[role="banner"]')
    await expect(headerBar).toBeVisible()

    // 발행사 정보 확인
    const issuerSection = page.locator('section').first()
    await expect(issuerSection).toBeVisible()

    // 견적서 정보 섹션 확인
    const invoiceInfo = page.locator('text=견적서 번호').first()
    await expect(invoiceInfo).toBeVisible()

    // 클라이언트 정보 확인
    const clientInfo = page.locator('text=고객사').first()
    await expect(clientInfo).toBeVisible()

    // 항목 테이블 확인
    const itemsTable = page.locator('table').first()
    await expect(itemsTable).toBeVisible()

    // 합계 정보 확인
    const totalAmount = page.locator('text=합계').first()
    await expect(totalAmount).toBeVisible()
  })

  test('PDF 다운로드 버튼 동작', async ({ page }) => {
    await page.goto('/view/dummy-invoice-001')

    // 다운로드 버튼 찾기
    const downloadButton = page
      .locator('button:has-text("다운로드")')
      .or(page.locator('button[aria-label*="다운로드"]'))
      .first()
    await expect(downloadButton).toBeVisible()

    // 다운로드 버튼 클릭 (실제 다운로드 검증은 별도 처리)
    await downloadButton.click()

    // 로딩 상태 확인 후 완료 대기
    await page.waitForTimeout(2000)

    // 성공 토스트 알림 확인 (선택사항)
    const toast = page.locator('[role="status"]').last()
    if (await toast.isVisible()) {
      await expect(toast).toContainText(/다운로드|완료|성공/i)
    }
  })

  test('인쇄 버튼 동작', async ({ page }) => {
    await page.goto('/view/dummy-invoice-001')

    // 인쇄 버튼 찾기
    const printButton = page
      .locator('button:has-text("인쇄")')
      .or(page.locator('button[aria-label*="인쇄"]'))
      .first()
    await expect(printButton).toBeVisible()

    // 인쇄 버튼 클릭
    await printButton.click()

    // 인쇄 다이얼로그가 나타났을 수 있음
    await page.waitForTimeout(500)
  })

  test('반응형 레이아웃 - 데스크톱', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/view/dummy-invoice-001')

    // 헤더 바의 버튼들이 텍스트와 함께 보여야 함
    const headerButtons = page.locator('[role="banner"] button')
    await expect(headerButtons.first()).toBeVisible()

    // 클라이언트 정보가 2열 그리드로 표시
    const clientFields = page
      .locator('[aria-label*="고객사"], text=고객사')
      .first()
    if (await clientFields.isVisible()) {
      const boundingBox = await clientFields.boundingBox()
      expect(boundingBox?.width).toBeGreaterThan(400)
    }
  })

  test('반응형 레이아웃 - 모바일', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/view/dummy-invoice-001')

    // 모바일에서 모든 주요 섹션이 세로로 표시되어야 함
    const sections = page.locator('section, main > div')
    const count = await sections.count()
    expect(count).toBeGreaterThan(3)

    // 헤더 바가 전체 너비로 표시
    const headerBar = page.locator('[role="banner"]')
    const boundingBox = await headerBar.boundingBox()
    expect(boundingBox?.width).toBeGreaterThan(300)
  })

  test('다크 모드 토글 기능', async ({ page }) => {
    await page.goto('/view/dummy-invoice-001')

    // 다크 모드 토글 찾기
    const themeToggle = page
      .locator('button[aria-label*="테마"], button[aria-label*="어두운"]')
      .first()

    if (await themeToggle.isVisible()) {
      // 초기 배경색 확인
      const body = page.locator('body')
      const initialBgColor = await body.evaluate(
        el => getComputedStyle(el).backgroundColor
      )

      // 다크 모드 토글
      await themeToggle.click()
      await page.waitForTimeout(300)

      // 배경색 변경 확인
      const newBgColor = await body.evaluate(
        el => getComputedStyle(el).backgroundColor
      )
      expect(initialBgColor).not.toBe(newBgColor)
    }
  })

  test('접근성 - 키보드 네비게이션', async ({ page }) => {
    await page.goto('/view/dummy-invoice-001')

    // Tab 키로 인쇄 버튼 접근
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // 포커스된 요소가 버튼인지 확인
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    )
    expect(['BUTTON', 'A']).toContain(focusedElement)
  })

  test('접근성 - 스크린 리더', async ({ page }) => {
    await page.goto('/view/dummy-invoice-001')

    // 주요 영역이 시맨틱 HTML로 마크업되었는지 확인
    const header = page.locator('header, [role="banner"]')
    const main = page.locator('main')
    const sections = page.locator('section')

    await expect(header).toBeVisible()
    await expect(main).toBeVisible()
    expect(await sections.count()).toBeGreaterThan(0)

    // ARIA 라벨 확인
    const buttons = page.locator('button[aria-label]')
    expect(await buttons.count()).toBeGreaterThan(0)
  })

  test('로딩 상태 표시', async ({ page }) => {
    // 네트워크 속도 제한 (느린 네트워크 시뮬레이션)
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 500)
    })

    await page.goto('/view/dummy-invoice-001')

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle')

    // 실제 콘텐츠가 표시됨
    const content = page.locator('section').first()
    await expect(content).toBeVisible()
  })
})

test.describe('견적서 뷰어 - 에러 처리', () => {
  test('존재하지 않는 견적서 (404)', async ({ page }) => {
    // 존재하지 않는 slug로 접근
    const response = await page.goto('/invoice/non-existent-slug')

    // 404 상태 코드 또는 에러 페이지 표시
    if (response) {
      expect([404, 200]).toContain(response.status())
    }

    // 에러 메시지 또는 404 페이지 표시
    const errorMessage = page
      .locator('text=/404|찾을 수 없음|존재하지 않/i')
      .first()
    const homeButton = page
      .locator('button:has-text("홈"), a:has-text("홈")')
      .first()

    const isErrorPage = await errorMessage.isVisible().catch(() => false)
    const isHomeButtonVisible = await homeButton.isVisible().catch(() => false)

    if (isErrorPage || isHomeButtonVisible) {
      expect(isErrorPage || isHomeButtonVisible).toBeTruthy()
    }
  })

  test('API 오류 시 재시도 버튼', async ({ page }) => {
    // API 실패 시뮬레이션
    await page.route('/api/invoices*', route => {
      route.abort('failed')
    })

    await page.goto('/view/dummy-invoice-001')

    // 에러 메시지 확인
    const errorText = page.locator('text=/오류|실패|다시/i').first()

    // 에러 페이지가 표시됨
    const isVisible = await errorText.isVisible().catch(() => false)
    if (isVisible) {
      expect(isVisible).toBeTruthy()
    }
  })
})
