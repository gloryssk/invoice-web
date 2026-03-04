/**
 * 견적서 링크 관리 훅 및 컴포넌트
 *
 * 구조:
 * - useLinkManager: 링크 복사 로직을 담당하는 커스텀 훅
 * - CopyLinkButton: 링크 복사 버튼 컴포넌트
 * - PreviewLinkButton: 견적서 뷰어 미리보기 버튼 컴포넌트
 *
 * 기능:
 * - slug를 기반으로 공개 뷰어 URL 생성
 * - 클립보드에 URL 복사
 * - 복사 성공/실패 토스트 알림
 */

'use client'

import { useState, useCallback } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ============================================================
// URL 생성 유틸리티
// ============================================================

/**
 * 견적서 slug를 공개 뷰어 URL로 변환
 * 예: "INV-2026-001" → "https://yourdomain.com/view/INV-2026-001"
 */
export function getInvoiceViewerUrl(slug: string): string {
  // 브라우저 환경에서는 현재 origin 사용, 서버에서는 환경변수 사용
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? '')

  return `${baseUrl}/view/${slug}`
}

// ============================================================
// useLinkManager 커스텀 훅
// ============================================================

interface UseLinkManagerOptions {
  /** 복사 완료 후 원래 상태로 돌아오는 지연 시간 (ms) */
  resetDelay?: number
}

interface UseLinkManagerReturn {
  /** 링크 복사 함수 */
  copyLink: (slug: string, invoiceNumber: string) => Promise<void>
  /** 현재 복사 중인 슬러그 */
  copyingSlug: string | null
  /** 복사 완료된 슬러그 */
  copiedSlug: string | null
}

/**
 * 견적서 링크 복사 로직을 담당하는 커스텀 훅
 */
export function useLinkManager(
  options: UseLinkManagerOptions = {}
): UseLinkManagerReturn {
  const { resetDelay = 2000 } = options

  /** 현재 복사 처리 중인 슬러그 */
  const [copyingSlug, setCopyingSlug] = useState<string | null>(null)
  /** 복사 완료된 슬러그 (체크 아이콘 표시용) */
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  /**
   * 클립보드에 견적서 뷰어 URL 복사
   * @param slug - 견적서 슬러그
   * @param invoiceNumber - 표시용 견적서 번호
   */
  const copyLink = useCallback(
    async (slug: string, invoiceNumber: string) => {
      // 중복 복사 방지
      if (copyingSlug) return

      setCopyingSlug(slug)

      try {
        const url = getInvoiceViewerUrl(slug)

        // 클립보드 API로 URL 복사
        await navigator.clipboard.writeText(url)

        // 복사 완료 상태로 변경
        setCopiedSlug(slug)
        setCopyingSlug(null)

        // 성공 토스트 알림
        toast.success('링크가 복사되었습니다', {
          description: `${invoiceNumber} 뷰어 링크가 클립보드에 복사되었습니다.`,
          duration: 3000,
        })

        // 일정 시간 후 복사 완료 상태 초기화
        setTimeout(() => {
          setCopiedSlug(prev => (prev === slug ? null : prev))
        }, resetDelay)
      } catch (error) {
        console.error('클립보드 복사 실패:', error)
        setCopyingSlug(null)

        // 실패 토스트 알림
        toast.error('링크 복사에 실패했습니다', {
          description: '브라우저 설정에서 클립보드 접근을 허용해주세요.',
          duration: 4000,
        })
      }
    },
    [copyingSlug, resetDelay]
  )

  return { copyLink, copyingSlug, copiedSlug }
}

// ============================================================
// CopyLinkButton 컴포넌트
// ============================================================

interface CopyLinkButtonProps {
  /** 견적서 슬러그 */
  slug: string
  /** 표시용 견적서 번호 */
  invoiceNumber: string
  /** 현재 복사 중 여부 */
  isCopying?: boolean
  /** 복사 완료 여부 (체크 아이콘 표시) */
  isCopied?: boolean
  /** 클릭 핸들러 */
  onClick: () => void
  /** 버튼 크기 변형 */
  variant?: 'icon' | 'outline'
  /** 추가 클래스명 */
  className?: string
}

/**
 * 링크 복사 버튼 컴포넌트
 * - 기본: 복사 아이콘
 * - 복사 완료: 체크 아이콘 (2초 후 원상복구)
 */
export function CopyLinkButton({
  invoiceNumber,
  isCopying = false,
  isCopied = false,
  onClick,
  variant = 'icon',
  className,
}: CopyLinkButtonProps) {
  // 아이콘 및 레이블 결정
  const icon = isCopied ? (
    <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
  ) : (
    <Copy className="h-4 w-4" aria-hidden="true" />
  )

  const ariaLabel = isCopied
    ? `${invoiceNumber} 링크 복사 완료`
    : `${invoiceNumber} 링크 복사`

  // 아이콘 전용 버튼 (테이블용)
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8',
          isCopied
            ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
            : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600',
          className
        )}
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={isCopying}
      >
        {icon}
      </Button>
    )
  }

  // 아웃라인 버튼 (카드용)
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'h-9 gap-1.5 border-slate-200 px-3 text-xs',
        isCopied
          ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
          : 'text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600',
        className
      )}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={isCopying}
    >
      {icon}
      <span className="xs:inline hidden">{isCopied ? '복사됨' : '복사'}</span>
    </Button>
  )
}

// ============================================================
// PreviewLinkButton 컴포넌트
// ============================================================

interface PreviewLinkButtonProps {
  /** 견적서 슬러그 */
  slug: string
  /** 표시용 견적서 번호 */
  invoiceNumber: string
  /** 버튼 크기 변형 */
  variant?: 'icon' | 'outline'
  /** 추가 클래스명 */
  className?: string
}

/**
 * 견적서 미리보기(뷰어 이동) 버튼 컴포넌트
 * 새 탭으로 뷰어 페이지를 엽니다
 */
export function PreviewLinkButton({
  slug,
  invoiceNumber,
  variant = 'icon',
  className,
}: PreviewLinkButtonProps) {
  /**
   * 견적서 뷰어 페이지로 이동 (새 탭)
   */
  const handlePreview = useCallback(() => {
    const url = `/view/${slug}`
    // 새 탭으로 열기
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [slug])

  // 아이콘 전용 버튼 (테이블용)
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600',
          className
        )}
        aria-label={`${invoiceNumber} 미리보기 (새 탭)`}
        onClick={handlePreview}
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </Button>
    )
  }

  // 아웃라인 버튼 (카드용)
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'h-9 gap-1.5 border-slate-200 px-3 text-xs text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600',
        className
      )}
      aria-label={`${invoiceNumber} 미리보기 (새 탭)`}
      onClick={handlePreview}
    >
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="xs:inline hidden">미리보기</span>
    </Button>
  )
}
