import { chromium } from 'playwright'

async function takeScreenshots() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // 1. 홈 페이지 스크린샷
    console.log('📸 홈 페이지 방문 중...')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.screenshot({
      path: './screenshots/homepage.png',
      fullPage: true,
    })
    console.log('✅ 홈 페이지 스크린샷 저장: ./screenshots/homepage.png')

    // 2. 견적서 뷰어 페이지 스크린샷
    console.log('📸 견적서 뷰어 페이지 방문 중...')
    await page.goto('http://localhost:3000/view/INV-2026-001', {
      waitUntil: 'networkidle',
    })
    await page.screenshot({
      path: './screenshots/invoice-viewer.png',
      fullPage: true,
    })
    console.log(
      '✅ 견적서 뷰어 스크린샷 저장: ./screenshots/invoice-viewer.png'
    )
  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
  } finally {
    await browser.close()
  }
}

takeScreenshots()
