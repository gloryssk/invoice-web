/**
 * 공개 견적서 뷰어 페이지
 * 라우트: /view/[slug]
 *
 * 기능:
 * - 노션 API에서 실제 견적서 데이터 조회
 * - 동적 메타데이터 생성 (OG 태그 포함)
 * - 정적 경로 사전 생성 (generateStaticParams)
 * - ISR 캐싱 설정 (1시간 주기)
 * - 로딩/에러/404 상태 처리
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InvoiceViewer } from '@/components/invoice/invoice-viewer'
import { getInvoiceBySlug, getAllInvoices } from '@/lib/notion/queries'

// ISR 캐싱 설정: 1시간마다 재검증
export const revalidate = 3600

// 페이지 Props 인터페이스
interface InvoiceViewPageProps {
  params: Promise<{ slug: string }>
}

/**
 * 정적 경로 사전 생성
 * 빌드 시간에 모든 활성 견적서의 경로를 미리 생성하여 성능 최적화
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const invoices = await getAllInvoices()
    return invoices.map(invoice => ({
      slug: invoice.invoiceNumber,
    }))
  } catch (error) {
    console.warn('generateStaticParams 실패:', error)
    // 에러 발생 시 빈 배열 반환 (온디맨드 생성 활성화)
    return []
  }
}

/**
 * 동적 메타데이터 생성
 * 각 견적서의 정보를 기반으로 OG 태그 등 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: InvoiceViewPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const invoice = await getInvoiceBySlug(slug)

    if (!invoice) {
      return {
        title: '견적서 없음 | Invoice Web',
        description: '요청한 견적서를 찾을 수 없습니다.',
      }
    }

    // OG 이미지 URL (public/og-image.png)
    const ogImageUrl = new URL(
      '/og-image.png',
      process.env.NEXT_PUBLIC_APP_URL || 'https://invoice-web.vercel.app'
    ).toString()

    return {
      title: `견적서 ${invoice.invoiceNumber} | Invoice Web`,
      description: `${invoice.clientName} - 견적서 ${invoice.invoiceNumber}`,
      openGraph: {
        title: `견적서 ${invoice.invoiceNumber}`,
        description: `${invoice.clientName} - 견적서 ${invoice.invoiceNumber}`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://invoice-web.vercel.app'}/view/${slug}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `견적서 ${invoice.invoiceNumber}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `견적서 ${invoice.invoiceNumber}`,
        description: `${invoice.clientName} - 견적서 ${invoice.invoiceNumber}`,
        images: [ogImageUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    console.error('메타데이터 생성 실패:', error)
    return {
      title: '견적서 | Invoice Web',
      description: '견적서를 확인하세요.',
    }
  }
}

/**
 * 공개 견적서 뷰어 페이지 컴포넌트
 * 노션 API에서 실제 견적서 데이터를 조회하여 표시
 */
export default async function InvoiceViewPage({
  params,
}: InvoiceViewPageProps) {
  const { slug } = await params

  try {
    // 노션 API에서 견적서 조회
    const invoice = await getInvoiceBySlug(slug)

    // 견적서가 없으면 404 응답
    if (!invoice) {
      notFound()
    }

    return <InvoiceViewer invoice={invoice} />
  } catch (error) {
    console.error(`견적서 조회 실패 (slug: ${slug}):`, error)
    // API 오류는 error.tsx에서 처리
    throw error
  }
}
