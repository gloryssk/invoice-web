import Link from 'next/link'
import { Container } from './container'

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Invoice Viewer</span>
          </Link>

          {/* 오른쪽 네비게이션 */}
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              관리자
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
