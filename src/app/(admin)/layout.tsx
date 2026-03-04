// 관리자 영역 레이아웃
// 설명: 관리자 대시보드 페이지에 적용되는 레이아웃입니다.

import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 관리자 헤더 영역 */}
      <header className="border-b border-gray-200 bg-white py-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">관리자 대시보드</h1>
            {/* TODO: 로그아웃 버튼 추가 */}
          </div>
        </div>
      </header>

      {/* 페이지 콘텐츠 */}
      <main className="container mx-auto py-8">{children}</main>

      {/* 관리자 푸터 영역 */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>&copy; 2026 Invoice Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
