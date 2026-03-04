/**
 * 견적서 조회 로딩 상태 UI
 * 노션 API 응답 대기 중에 표시되는 스켈레톤 로딩 화면
 */

import { Skeleton } from '@/components/ui/skeleton'

export default function InvoiceViewLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* 헤더 스켈레톤 */}
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>

        {/* 발행사 정보 스켈레톤 */}
        <div className="rounded-lg border border-blue-100 bg-white p-6">
          <Skeleton className="mb-4 h-4 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* 기본 정보 스켈레톤 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-blue-100 bg-white p-4"
            >
              <Skeleton className="mb-3 h-3 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>

        {/* 클라이언트 정보 스켈레톤 */}
        <div className="rounded-lg border border-blue-100 bg-white p-6">
          <Skeleton className="mb-4 h-4 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* 항목 테이블 스켈레톤 */}
        <div className="overflow-hidden rounded-lg border border-blue-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-blue-100 bg-blue-50">
                <tr>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <th key={i} className="px-6 py-3 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-blue-50">
                    {Array.from({ length: 5 }).map((_, colIdx) => (
                      <td key={colIdx} className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 합계 영역 스켈레톤 */}
        <div className="flex justify-end">
          <div className="w-full space-y-3 rounded-lg border border-blue-100 bg-white p-6 md:w-80">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
