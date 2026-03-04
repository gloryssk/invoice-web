/**
 * 동적 Sitemap 생성
 * Next.js 자동 라우트: /sitemap.xml
 *
 * 모든 활성 견적서 URL을 포함하여 SEO 최적화
 */

import type { MetadataRoute } from 'next'
import { getAllInvoices } from '@/lib/notion/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 기본 URL (환경변수 또는 기본값 사용)
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://invoice-web.vercel.app'

  try {
    // 모든 공개 견적서 조회
    const invoices = await getAllInvoices()

    // 견적서별 URL 생성
    const invoiceUrls = invoices.map(invoice => ({
      url: `${baseUrl}/view/${invoice.invoiceNumber}`,
      lastModified: new Date(invoice.issueDate),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // 기본 페이지
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ]

    return [...staticPages, ...invoiceUrls]
  } catch (error) {
    console.error('Sitemap 생성 실패:', error)
    // 에러 발생 시 기본 페이지만 반환
    return [
      {
        url:
          process.env.NEXT_PUBLIC_APP_URL || 'https://invoice-web.vercel.app',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ]
  }
}
