'use client'

/**
 * 견적서 뷰어 헤더 바 컴포넌트
 *
 * 기능:
 * - 견적서 번호와 클라이언트명 표시
 * - PDF 다운로드 버튼 (PdfDownloadButton 컴포넌트 사용)
 * - 인쇄 버튼 (window.print() 호출)
 * - 화면 상단에 고정되어 항상 접근 가능
 * - 인쇄 모드에서는 숨김 처리
 *
 * 컴포넌트 구조:
 * ┌──────────────────────────────────────────────────────┐
 * │ HeaderBar (sticky top-0)                             │
 * │  ├─ 좌측: FileText 아이콘 + 견적서 정보              │
 * │  └─ 우측: 인쇄 버튼 + PDF 다운로드 버튼             │
 * └──────────────────────────────────────────────────────┘
 */

import { Printer, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PdfDownloadButton } from '@/components/invoice/pdf-download-button'

// 헤더 바 Props 인터페이스
interface HeaderBarProps {
  /** 견적서 번호 */
  invoiceNumber: string
  /** 클라이언트명 */
  clientName: string
  /** 발행일 (PDF 파일명에 사용) */
  issueDate: string
}

export function HeaderBar({
  invoiceNumber,
  clientName,
  issueDate,
}: HeaderBarProps) {
  return (
    // 헤더 바 컨테이너 - 인쇄 시 숨김 처리 (오션 블루 배경)
    <header
      className="bg-primary/95 supports-[backdrop-filter]:bg-primary/80 sticky top-0 z-50 border-b border-blue-300 backdrop-blur dark:border-blue-700 print:hidden"
      role="banner"
    >
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* 로고 및 견적서 식별 정보 */}
        <div className="flex items-center gap-2">
          <FileText
            className="text-primary-foreground size-5"
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="text-primary-foreground text-sm leading-tight font-semibold">
              견적서
            </span>
            {/* 데스크톱에서만 견적서 번호 + 클라이언트명 표시 */}
            <span className="text-primary-foreground/70 hidden text-xs sm:block">
              {invoiceNumber} · {clientName}
            </span>
          </div>
        </div>

        {/* 액션 버튼 그룹 - gap-2로 버튼 간격 통일 */}
        <div className="flex items-center gap-2">
          {/* 인쇄 버튼 - 데스크톱 (아이콘 + 텍스트): variant="outline" */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            aria-label="견적서 인쇄"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hidden sm:flex"
          >
            <Printer className="size-4" aria-hidden="true" />
            <span>인쇄</span>
          </Button>

          {/* 인쇄 버튼 - 모바일 (아이콘만) + 툴팁 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.print()}
                aria-label="견적서 인쇄"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:hidden"
              >
                <Printer className="size-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>인쇄</p>
            </TooltipContent>
          </Tooltip>

          {/* PDF 다운로드 버튼 컴포넌트: variant="default" */}
          <PdfDownloadButton
            invoiceNumber={invoiceNumber}
            clientName={clientName}
            issueDate={issueDate}
          />
        </div>
      </div>
    </header>
  )
}
