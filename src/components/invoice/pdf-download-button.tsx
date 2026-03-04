'use client'

/**
 * PDF 저장 버튼 컴포넌트
 *
 * html2canvas + html2pdf.js는 TailwindCSS v4의 oklch 색상을 파싱하지 못함.
 * 해결: window.print() 사용 → 브라우저가 직접 렌더링하므로 oklch 문제 없음.
 * globals.css의 @media print 스타일이 인쇄 레이아웃을 담당.
 */

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface PdfDownloadButtonProps {
  invoiceNumber?: string
  clientName?: string
  issueDate?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PdfDownloadButton(_props: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      // 브라우저 인쇄 다이얼로그 호출
      // globals.css의 @media print 스타일로 PDF처럼 출력
      // 브라우저에서 "PDF로 저장" 선택 가능
      window.print()

      toast.success('인쇄 창이 열렸습니다', {
        description: '대상 프린터에서 "PDF로 저장"을 선택하세요.',
      })
    } catch (error) {
      console.error('PDF 저장 실패:', error)
      toast.error('PDF 저장 실패', {
        description: '잠시 후 다시 시도해주세요.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 데스크톱 버튼 */}
      <Button
        size="sm"
        onClick={handleDownload}
        disabled={isLoading}
        aria-label="PDF로 저장"
        className="hidden sm:flex"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        <span>PDF 저장</span>
      </Button>

      {/* 모바일 버튼 */}
      <Button
        size="icon"
        onClick={handleDownload}
        disabled={isLoading}
        aria-label="PDF로 저장"
        className="sm:hidden"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
      </Button>
    </>
  )
}
