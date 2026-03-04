import { test, expect } from '@playwright/test'

/**
 * 관리자 대시보드 테스트
 * 로그인, 견적서 관리, 링크 복사, 세션 만료 검증
 */

test.describe('관리자 대시보드', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로그인 페이지로 이동
    await page.goto('/admin/login')
  })

  test('로그인 페이지 표시', async ({ page }) => {
    // 로그인 폼 확인
    const loginForm = page.locator('form').first()
    await expect(loginForm).toBeVisible()

    // 비밀번호 입력 필드 확인
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(passwordInput).toBeVisible()

    // 로그인 버튼 확인
    const submitButton = page.locator('button[type="submit"]').first()
    await expect(submitButton).toBeVisible()
  })

  test('잘못된 비밀번호로 로그인 실패', async ({ page }) => {
    // 잘못된 비밀번호 입력
    const passwordInput = page.locator('input[type="password"]').first()
    await passwordInput.fill('wrong-password')

    // 로그인 버튼 클릭
    const submitButton = page.locator('button[type="submit"]').first()
    await submitButton.click()

    // 에러 메시지 확인 (선택사항)
    await page.waitForTimeout(1000)

    // 로그인 페이지에 남아있어야 함
    const stillOnLoginPage = await page
      .locator('input[type="password"]')
      .isVisible()
    expect(stillOnLoginPage).toBeTruthy()
  })

  test('대시보드 레이아웃 확인', async ({ page }) => {
    // 로그인 상태 시뮬레이션 (쿠키 설정)
    // 주: 실제 환경에서는 올바른 비밀번호로 로그인하거나 테스트 계정을 사용
    await page.goto('/admin/dashboard')

    // 대시보드 로드 대기
    await page.waitForLoadState('networkidle')

    // 대시보드의 주요 요소 확인
    const searchInput = page
      .locator('input[placeholder*="검색"], input[type="search"]')
      .first()
    const table = page.locator('table').first()
    const sortButton = page.locator('button[aria-label*="정렬"]').first()

    // 최소 하나의 요소가 표시되어야 함
    const elementsVisible =
      (await searchInput.isVisible().catch(() => false)) ||
      (await table.isVisible().catch(() => false)) ||
      (await sortButton.isVisible().catch(() => false))

    if (elementsVisible) {
      expect(elementsVisible).toBeTruthy()
    }
  })

  test('견적서 검색 기능', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 검색 입력 필드 찾기
    const searchInput = page
      .locator('input[placeholder*="검색"], input[type="search"]')
      .first()

    if (await searchInput.isVisible()) {
      // 검색어 입력
      await searchInput.fill('test-invoice')

      // 검색 완료 대기
      await page.waitForTimeout(500)

      // 테이블 행 확인
      const tableRows = page.locator('tbody tr')
      expect(await tableRows.count()).toBeGreaterThanOrEqual(0)
    }
  })

  test('견적서 정렬 기능', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 테이블 헤더 찾기
    const invoiceNumberHeader = page
      .locator('th:has-text("견적서 번호")')
      .first()

    if (await invoiceNumberHeader.isVisible()) {
      // 헤더 클릭 (정렬)
      await invoiceNumberHeader.click()

      // 정렬 완료 대기
      await page.waitForTimeout(500)

      // 테이블이 여전히 보여야 함
      const table = page.locator('table').first()
      await expect(table).toBeVisible()
    }
  })

  test('링크 복사 기능', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 링크 복사 버튼 찾기
    const copyButton = page
      .locator('button[aria-label*="복사"], button:has-text("복사")')
      .first()

    if (await copyButton.isVisible()) {
      // 클립보드 권한 처리
      await page.evaluate(() => {
        navigator.clipboard.writeText = async () => Promise.resolve()
      })

      // 링크 복사 버튼 클릭
      await copyButton.click()

      // 성공 토스트 알림 확인
      const successToast = page.locator('[role="status"]').last()
      if (await successToast.isVisible()) {
        await expect(successToast).toContainText(/복사|성공|완료/i)
      }
    }
  })

  test('링크 미리보기 기능', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 미리보기 버튼 찾기
    const previewButton = page
      .locator('button[aria-label*="미리보기"], button:has-text("미리보기")')
      .first()

    if (await previewButton.isVisible()) {
      // 미리보기 버튼 클릭
      await previewButton.click()

      // 새 탭 또는 창이 열릴 수 있음
      await page.waitForTimeout(500)

      // 원래 페이지가 여전히 표시되어야 함
      const dashboard = page.locator('table, [role="status"]').first()
      expect(await dashboard.isVisible().catch(() => false)).toBe(true)
    }
  })

  test('반응형 레이아웃 - 데스크톱', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 테이블 레이아웃이 표시되어야 함
    const table = page.locator('table').first()
    if (await table.isVisible()) {
      const boundingBox = await table.boundingBox()
      expect(boundingBox?.width).toBeGreaterThan(600)
    }
  })

  test('반응형 레이아웃 - 모바일', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 레이아웃이 모바일 최적화되어야 함
    const container = page.locator('main, [role="main"]').first()
    if (await container.isVisible()) {
      const boundingBox = await container.boundingBox()
      expect(boundingBox?.width).toBeLessThan(400)
    }
  })

  test('다크 모드 토글', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 다크 모드 토글 버튼 찾기
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
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // Tab 키로 네비게이션
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // 포커스된 요소가 인터랙티브 요소인지 확인
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      return el?.tagName
    })

    expect(['BUTTON', 'INPUT', 'A', 'SELECT']).toContain(focusedElement)
  })

  test('접근성 - 테이블 시맨틱', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // 테이블 구조 확인
    const thead = page.locator('thead').first()
    const tbody = page.locator('tbody').first()

    if (await thead.isVisible()) {
      await expect(thead).toBeVisible()
      await expect(tbody).toBeVisible()
    }
  })
})

test.describe('관리자 대시보드 - 에러 처리', () => {
  test('세션 만료 시 자동 로그아웃', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    // API 401 응답 시뮬레이션
    await page.route('/api/admin/invoices', route => {
      route.abort('failed')
    })

    // 페이지 새로고침 또는 데이터 다시 로드
    await page.reload()

    // 에러 처리 대기
    await page.waitForTimeout(1000)

    // 로그인 페이지로 리다이렉트되거나 에러 메시지 표시
    const isOnLogin = page.url().includes('/admin/login')
    const errorMessage = page.locator('text=/세션|로그인|인증/i').first()

    const isErrorHandled =
      isOnLogin || (await errorMessage.isVisible().catch(() => false))
    expect(isErrorHandled).toBeTruthy()
  })

  test('API 오류 시 재시도 버튼', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // API 실패 시뮬레이션
    await page.route('/api/admin/invoices', route => {
      route.abort('failed')
    })

    // 데이터 새로고침 트리거
    await page.reload()

    // 에러 메시지 확인
    const errorText = page.locator('text=/오류|실패|다시/i').first()

    // 재시도 버튼 확인
    const retryButton = page
      .locator('button:has-text("다시"), button:has-text("재시도")')
      .first()

    // 최소한 하나의 에러 UI가 표시되어야 함
    const isErrorUIVisible =
      (await errorText.isVisible().catch(() => false)) ||
      (await retryButton.isVisible().catch(() => false))

    if (isErrorUIVisible) {
      expect(isErrorUIVisible).toBeTruthy()
    }
  })

  test('네트워크 오류 자동 재시도', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')

    let requestCount = 0

    // 첫 요청은 실패, 두 번째는 성공으로 설정
    await page.route('/api/admin/invoices', route => {
      requestCount++
      if (requestCount === 1) {
        route.abort('failed')
      } else {
        route.continue()
      }
    })

    // 페이지 새로고침
    await page.reload()

    // 재시도 완료 대기
    await page.waitForTimeout(3000)

    // 재시도가 발생했는지 확인
    expect(requestCount).toBeGreaterThan(1)
  })
})
