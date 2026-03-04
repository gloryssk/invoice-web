'use client'

/**
 * PDF 다운로드 버튼 컴포넌트
 *
 * 기능:
 * - html2pdf.js를 사용하여 현재 견적서 DOM을 PDF로 변환
 * - 파일명: {clientName}-{invoiceNumber}-{date}.pdf 형식으로 자동 생성
 * - 로딩 상태 표시 (다운로드 진행 중 버튼 비활성화)
 * - 에러 발생 시 콘솔 에러 출력 및 sonner 토스트 알림
 * - Next.js 동적 import로 클라이언트 사이드에서만 html2pdf.js 로드
 *
 * 컴포넌트 구조:
 * ┌──────────────────────────────────────────┐
 * │ PdfDownloadButton                        │
 * │  ├─ 데스크톱 버튼 (아이콘 + 텍스트)     │
 * │  └─ 모바일 버튼 (아이콘만)              │
 * └──────────────────────────────────────────┘
 */

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// PDF 다운로드 버튼 Props 인터페이스
interface PdfDownloadButtonProps {
  /** 견적서 번호 (파일명에 사용) */
  invoiceNumber: string
  /** 클라이언트명 (파일명에 사용) */
  clientName: string
  /** 발행일 (파일명에 사용) */
  issueDate: string
  /** 출력 대상 요소의 DOM ID */
  targetElementId?: string
}

/**
 * 파일명에 사용할 수 없는 특수문자를 제거하는 유틸리티 함수
 * @param str 원본 문자열
 * @returns 안전한 파일명 문자열
 */
function sanitizeFilename(str: string): string {
  // 파일명에 사용할 수 없는 문자 제거 (/, \, :, *, ?, ", <, >, |)
  return str.replace(/[/\\:*?"<>|]/g, '').trim()
}

/**
 * ISO 날짜 문자열을 YYYY-MM-DD 형식으로 변환
 * @param isoDate ISO 형식 날짜 문자열
 * @returns YYYY-MM-DD 형식 문자열
 */
function formatDateForFilename(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    // 날짜 파싱 실패 시 현재 날짜 사용
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }
}

export function PdfDownloadButton({
  invoiceNumber,
  clientName,
  issueDate,
  targetElementId = 'invoice-content',
}: PdfDownloadButtonProps) {
  // PDF 생성 중 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  /**
   * PDF 다운로드 핸들러
   * html2pdf.js를 동적으로 로드하여 현재 견적서 DOM을 PDF로 변환합니다.
   */
  const handleDownload = async () => {
    // 이미 로딩 중이면 중복 실행 방지
    if (isLoading) return

    setIsLoading(true)

    try {
      // 대상 DOM 요소 조회
      const element = document.getElementById(targetElementId)
      if (!element) {
        throw new Error(`대상 요소를 찾을 수 없습니다: #${targetElementId}`)
      }

      // html2pdf.js 동적 import (클라이언트 전용 라이브러리)
      const html2pdf = (await import('html2pdf.js')).default

      // 파일명 생성: {클라이언트명}-{견적서번호}-{발행일}.pdf
      const safeClientName = sanitizeFilename(clientName)
      const safeInvoiceNumber = sanitizeFilename(invoiceNumber)
      const formattedDate = formatDateForFilename(issueDate)
      const filename = `${safeClientName}-${safeInvoiceNumber}-${formattedDate}.pdf`

      // html2pdf.js 옵션 설정
      const options = {
        // 여백 설정 (mm 단위): [상, 우, 하, 좌]
        margin: [10, 10, 10, 10] as [number, number, number, number],
        // 출력 파일명
        filename,
        // 이미지 품질 설정
        image: {
          type: 'jpeg' as const,
          quality: 0.98,
        },
        // html2canvas 렌더링 설정
        html2canvas: {
          scale: 2, // 고해상도 출력 (Retina 대응)
          useCORS: true, // 외부 이미지 CORS 허용
          allowTaint: false,
          backgroundColor: '#ffffff', // 흰색 배경
          logging: false, // 콘솔 로그 비활성화
          scrollX: 0,
          scrollY: 0,
        },
        // jsPDF 출력 설정
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4', // A4 용지
          orientation: 'portrait' as const, // 세로 방향
          compress: true, // PDF 압축
        },
        // 페이지 나누기 설정
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
        },
      }

      // PDF 생성 및 다운로드
      await html2pdf().set(options).from(element).save()

      // 성공 토스트 알림
      toast.success('PDF 다운로드 완료', {
        description: `${filename} 파일이 저장되었습니다.`,
      })
    } catch (error) {
      // 에러 로그 출력
      console.error('PDF 다운로드 실패:', error)

      // 실패 토스트 알림
      toast.error('PDF 다운로드 실패', {
        description: '잠시 후 다시 시도해주세요.',
      })
    } finally {
      // 로딩 상태 초기화
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 데스크톱 PDF 다운로드 버튼 (아이콘 + 텍스트) */}
      <Button
        size="sm"
        onClick={handleDownload}
        disabled={isLoading}
        aria-label={isLoading ? 'PDF 생성 중' : 'PDF로 다운로드'}
        className="hidden sm:flex"
      >
        {/* 로딩 중에는 스피너, 아니면 다운로드 아이콘 표시 */}
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        <span>{isLoading ? '생성 중...' : 'PDF 저장'}</span>
      </Button>

      {/* 모바일 PDF 다운로드 버튼 (아이콘만) */}
      <Button
        size="icon"
        onClick={handleDownload}
        disabled={isLoading}
        aria-label={isLoading ? 'PDF 생성 중' : 'PDF로 다운로드'}
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
