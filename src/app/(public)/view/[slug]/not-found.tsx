/**
 * 404 Not Found 페이지
 * 견적서를 찾을 수 없을 때 표시됩니다.
 * 친화적인 메시지와 홈으로 이동 버튼을 제공합니다.
 */

import Link from 'next/link'
import { FileSearch, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InvoiceNotFound() {
  return (
    // 전체 화면 중앙 정렬 레이아웃
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center px-4">
      {/* 404 카드 컨테이너 */}
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        {/* 아이콘 영역 */}
        <div
          className="bg-muted flex size-20 items-center justify-center rounded-2xl"
          aria-hidden="true"
        >
          <FileSearch className="text-muted-foreground size-10" />
        </div>

        {/* 오류 코드 */}
        <p className="text-muted-foreground/30 text-6xl font-black tracking-tight">
          404
        </p>

        {/* 제목 및 설명 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl font-bold">
            견적서를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            요청하신 견적서가 존재하지 않거나, 링크가 만료되었을 수 있습니다.
            <br />
            견적서 링크를 다시 확인하거나 담당자에게 문의해 주세요.
          </p>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
          {/* 뒤로 가기 버튼 */}
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="size-4" aria-hidden="true" />
              이전 페이지
            </Link>
          </Button>

          {/* 홈으로 이동 버튼 */}
          <Button asChild>
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              홈으로 이동
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
