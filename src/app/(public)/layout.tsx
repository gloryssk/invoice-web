// 공개 영역 레이아웃
// 설명: 공개 견적서 뷰어 페이지에 적용되는 레이아웃입니다.

import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* 공개 헤더 영역 */}
      <header className="border-b border-gray-200 py-6">
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold">견적서</h1>
        </div>
      </header>

      {/* 페이지 콘텐츠 */}
      <main>{children}</main>

      {/* 공개 푸터 영역 */}
      <footer className="border-t border-gray-200 py-6">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>&copy; 2026 Invoice Viewer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
