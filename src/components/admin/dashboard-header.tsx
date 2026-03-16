/**
 * 관리자 대시보드 헤더 컴포넌트
 *
 * 구조:
 * - 좌측: 로고/제목 영역
 * - 우측: 로그아웃 버튼
 */

import { LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminLogout } from '@/lib/actions/auth'

// ============================================================
// 로그아웃 폼 컴포넌트 (Server Action 호출용)
// ============================================================

/**
 * 로그아웃 버튼 - Server Action을 form action으로 호출
 */
function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await adminLogout()
      }}
    >
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-white/40 text-white hover:bg-white/10 hover:text-white"
        aria-label="로그아웃"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span>로그아웃</span>
      </Button>
    </form>
  )
}

// ============================================================
// 대시보드 헤더 컴포넌트
// ============================================================

interface DashboardHeaderProps {
  /** 추가 클래스명 */
  className?: string
}

/**
 * 관리자 대시보드 헤더
 * 좌측 로고와 제목, 우측 로그아웃 버튼으로 구성
 */
export function DashboardHeader({ className }: DashboardHeaderProps) {
  return (
    <header
      className={`border-primary/20 bg-primary border-b ${className ?? ''}`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 좌측: 로고 및 제목 - 터키색 배경에 흰색 텍스트 */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20"
              aria-hidden="true"
            >
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">
                관리자 대시보드
              </h1>
              <p className="hidden text-xs text-white/70 sm:block">
                Invoice Web Viewer
              </p>
            </div>
          </div>

          {/* 우측: 로그아웃 버튼 */}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
