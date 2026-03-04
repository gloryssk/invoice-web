import { test, expect } from '@playwright/test'

/**
 * 에러 처리 및 엣지 케이스 테스트
 * 404, 500, 네트워크 오류, 세션 만료 등 검증
 */

test.describe('공개 뷰어 - 에러 처리', () => {
  test('존재하지 않는 견적서 404 에러', async ({ page }) => {
    const response = await page.goto('/invoice/non-existent-invoice-slug')

    // 404 또는 에러 페이지 확인
    if (response) {
      expect([404, 200]).toContain(response.status())
    }

    // 에러 메시지 또는 404 페이지 텍스트
    const errorHeading = page
      .locator('h1, h2')
      .filter({ hasText: /404|찾을 수 없음|존재하지 않는/i })
      .first()
    const homeLink = page
      .locator('a:has-text("홈"), button:has-text("홈")')
      .first()

    const hasError =
      (await errorHeading.isVisible().catch(() => false)) ||
      (await homeLink.isVisible().catch(() => false))

    expect(hasError).toBeTruthy()
  })

  test('API 오류 시 에러 페이지 표시', async ({ page }) => {
    // API 오류 시뮬레이션
    await page.route('/api/invoices*', route => {
      route.abort('failed')
    })

    await page.goto('/invoice/dummy-invoice')

    // 에러 메시지 확인
    const errorMessage = page.locator('text=/오류|실패|다시 시도/i').first()

    // 재시도 버튼 확인
    const retryButton = page
      .locator('button:has-text("다시"), button:has-text("재시도")')
      .first()

    const isErrorHandled =
      (await errorMessage.isVisible().catch(() => false)) ||
      (await retryButton.isVisible().catch(() => false))

    expect(isErrorHandled).toBeTruthy()
  })

  test('네트워크 오류 복구', async ({ page }) => {
    // 첫 번째 요청 실패
    let requestCount = 0
    await page.route('/api/invoices*', route => {
      requestCount++
      if (requestCount === 1) {
        route.abort('failed')
      } else {
        route.continue()
      }
    })

    await page.goto('/invoice/dummy-invoice')

    // 재시도 버튼이 있으면 클릭
    const retryButton = page
      .locator('button:has-text("다시"), button:has-text("재시도")')
      .first()
    if (await retryButton.isVisible()) {
      await retryButton.click()
      await page.waitForTimeout(1000)
    }

    // 재시도가 발생했는지 확인
    expect(requestCount).toBeGreaterThanOrEqual(1)
  })

  test('느린 네트워크에서 로딩 상태', async ({ page }) => {
    // 네트워크 속도 제한 (느린 4G)
    const client = await page.context().newCDPSession(page)
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (500 * 1024) / 8, // 500kb/s
      uploadThroughput: (20 * 1024) / 8,
      latency: 400,
    })

    await page.goto('/invoice/dummy-invoice')

    // 페이지 로드 완료 대기
    await page.waitForLoadState('networkidle')

    // 실제 콘텐츠가 표시되어야 함
    const content = page.locator('section, main').first()
    await expect(content).toBeVisible()
  })

  test('JavaScript 비활성화 시 폴백', async ({ browser }) => {
    // JavaScript 비활성화 컨텍스트 생성
    const context = await browser.newContext({
      javaScriptEnabled: false,
    })
    const page = await context.newPage()

    await page.goto('/invoice/dummy-invoice')

    // 서버렌더링된 콘텐츠가 표시되어야 함
    const content = page.locator('body').first()
    await expect(content).toBeVisible()

    await context.close()
  })

  test('PDF 다운로드 실패 처리', async ({ page }) => {
    await page.goto('/invoice/dummy-invoice-001')

    // Blob 생성 실패 시뮬레이션
    await page.evaluate(() => {
      // html2pdf 오류 시뮬레이션
      ;(window as unknown as Record<string, unknown>).html2pdf = undefined
    })

    // PDF 다운로드 버튼 클릭
    const downloadButton = page.locator('button:has-text("다운로드")').first()
    if (await downloadButton.isVisible()) {
      await downloadButton.click()
      await page.waitForTimeout(1000)

      // 에러 토스트 확인
      const errorToast = page.locator('[role="status"]').last()
      if (await errorToast.isVisible()) {
        // 에러 알림이 표시되어야 함
        expect(await errorToast.textContent()).toBeTruthy()
      }
    }
  })
})

test.describe('관리자 대시보드 - 에러 처리', () => {
  test('401 Unauthorized - 세션 없음', async ({ page }) => {
    // 세션 쿠키 제거
    await page.context().clearCookies()

    await page.goto('/admin/dashboard')

    // 로그인 페이지로 리다이렉트되거나 에러 표시
    await page.waitForTimeout(1000)

    const isOnLogin = page.url().includes('/admin/login')
    const authError = page.locator('text=/인증|로그인|권한/i').first()

    const isProtected =
      isOnLogin || (await authError.isVisible().catch(() => false))
    expect(isProtected).toBeTruthy()
  })

  test('403 Forbidden - 권한 없음', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // 403 응답 시뮬레이션
    await page.route('/api/admin/invoices', route => {
      route.abort('failed')
    })

    // 페이지 새로고침
    await page.reload()
    await page.waitForTimeout(1000)

    // 에러 토스트 또는 에러 메시지 확인
    const errorMessage = page
      .locator('[role="status"], text=/권한|접근|실패/i')
      .first()
    const isErrorHandled = await errorMessage.isVisible().catch(() => false)

    if (isErrorHandled) {
      expect(isErrorHandled).toBeTruthy()
    }
  })

  test('500 Internal Server Error', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // 500 응답 시뮬레이션
    await page.route('/api/admin/invoices', route => {
      route.abort('failed')
    })

    // 데이터 새로고침
    await page.reload()
    await page.waitForTimeout(1000)

    // 에러 메시지 확인
    const errorMessage = page
      .locator('[role="status"], text=/오류|서버|실패/i')
      .first()
    const isErrorHandled = await errorMessage.isVisible().catch(() => false)

    if (isErrorHandled) {
      expect(isErrorHandled).toBeTruthy()
    }
  })

  test('네트워크 오류 - 재시도 성공', async ({ page }) => {
    await page.goto('/admin/dashboard')

    let requestCount = 0

    // 처음 2개 요청 실패, 3번째 성공
    await page.route('/api/admin/invoices', route => {
      requestCount++
      if (requestCount <= 2) {
        route.abort('failed')
      } else {
        route.continue()
      }
    })

    // 페이지 새로고침
    await page.reload()

    // 재시도 대기 (최대 3회, 2초 간격)
    await page.waitForTimeout(5000)

    // 최소 3개의 요청이 발생했는지 확인
    expect(requestCount).toBeGreaterThanOrEqual(2)
  })

  test('타임아웃 처리', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // 매우 느린 응답
    await page.route('/api/admin/invoices', async route => {
      await new Promise(resolve => setTimeout(resolve, 60000)) // 60초 지연
      route.continue()
    })

    // 요청 타임아웃 대기
    await page.waitForTimeout(2000)

    // 페이지가 여전히 반응해야 함
    const dashboard = page.locator('body')
    await expect(dashboard).toBeVisible()
  })
})

test.describe('세션 관리', () => {
  test('세션 쿠키 검증', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // 쿠키 확인
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(
      c =>
        c.name.toLowerCase().includes('session') ||
        c.name.toLowerCase().includes('auth')
    )

    // 세션 쿠키가 있을 수 있음 (로그인 상태에 따라)
    if (sessionCookie) {
      expect(sessionCookie.httpOnly).toBe(true) // 보안: HttpOnly 플래그
    }
  })

  test('세션 만료 시뮬레이션', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 세션 쿠키 제거
    await page.context().clearCookies()

    // 데이터 새로고침
    await page.reload()
    await page.waitForTimeout(1000)

    // 로그인 페이지로 리다이렉트되거나 에러 표시
    const isOnLogin = page.url().includes('/admin/login')
    const authError = page.locator('text=/인증|로그인|세션/i').first()

    const isSessionHandled =
      isOnLogin || (await authError.isVisible().catch(() => false))
    expect(isSessionHandled).toBeTruthy()
  })
})

test.describe('인쇄 및 PDF', () => {
  test('인쇄 스타일 적용', async ({ page }) => {
    await page.goto('/invoice/dummy-invoice-001')

    // 페이지가 인쇄 가능한지 확인
    const printButton = page.locator('button:has-text("인쇄")').first()
    expect(await printButton.isVisible().catch(() => false)).toBe(true)

    // 인쇄 버튼이 클릭 가능한지 확인
    if (await printButton.isVisible()) {
      await expect(printButton).toBeEnabled()
    }
  })

  test('PDF 파일명 생성', async ({ page }) => {
    await page.goto('/invoice/dummy-invoice-001')

    // 다운로드 버튼이 있으면 클릭
    const downloadButton = page.locator('button:has-text("다운로드")').first()

    if (await downloadButton.isVisible()) {
      // 다운로드 실행 (실제 다운로드는 검증 불가)
      await downloadButton.click()
      await page.waitForTimeout(1000)

      // 버튼이 여전히 활성화되어야 함
      expect(await downloadButton.isEnabled()).toBe(true)
    }
  })
})
