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
 * - 관리자 진입 시 '목록으로' 버튼 표시
 * - 클라이언트 진입 시 '닫기' 버튼 표시
 *
 * 컴포넌트 구조:
 * ┌──────────────────────────────────────────────────────┐
 * │ HeaderBar (sticky top-0)                             │
 * │  ├─ 좌측: 목록버튼 + FileText 아이콘 + 견적서 정보   │
 * │  └─ 우측: 인쇄 버튼 + PDF 다운로드 + 닫기 버튼       │
 * └──────────────────────────────────────────────────────┘
 */

import Link from 'next/link'
import { Printer, FileText, ArrowLeft, X } from 'lucide-react'
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
  /** 관리자 진입 시 '목록으로' 버튼 표시 여부 */
  showBackButton?: boolean
  /** 클라이언트 진입 시 '닫기' 버튼 표시 여부 */
  showCloseButton?: boolean
}

export function HeaderBar({
  invoiceNumber,
  clientName,
  issueDate,
  showBackButton = false,
  showCloseButton = false,
}: HeaderBarProps) {
  return (
    // 헤더 바 컨테이너 - 인쇄 시 숨김 처리 (오션 블루 배경)
    <header
      className="bg-primary/95 supports-[backdrop-filter]:bg-primary/80 sticky top-0 z-50 border-b border-blue-300 backdrop-blur dark:border-blue-700 print:hidden"
      role="banner"
    >
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* 좌측: 네비게이션 버튼 + 로고 및 견적서 식별 정보 */}
        <div className="flex items-center gap-2">
          {/* 관리자 진입 시 '목록으로' 버튼 표시 */}
          {showBackButton && (
            <Link href="/dashboard" className="print:hidden">
              <Button
                variant="outline"
                size="icon"
                aria-label="목록으로 돌아가기"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-8 w-8"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Button>
            </Link>
          )}

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

        {/* 우측: 액션 버튼 그룹 - gap-2로 버튼 간격 통일 */}
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

          {/* 클라이언트 진입 시 '닫기' 버튼 표시 */}
          {showCloseButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.history.back()}
              aria-label="닫기"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-8 w-8 print:hidden"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
