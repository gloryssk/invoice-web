/**
 * 추가 정보 섹션 컴포넌트
 * 비고(notes)와 결제 조건(paymentTerms)을 표시합니다.
 * 해당 필드가 없으면 섹션 전체를 숨깁니다.
 */

import { StickyNote, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// 추가 정보 Props 인터페이스
interface AdditionalInfoSectionProps {
  notes?: string
  paymentTerms?: string
}

export function AdditionalInfoSection({
  notes,
  paymentTerms,
}: AdditionalInfoSectionProps) {
  // 표시할 내용이 없으면 렌더링 생략
  if (!notes && !paymentTerms) {
    return null
  }

  return (
    // 추가 정보 컨테이너 - 배경: bg-blue-50 (다크: bg-blue-900/30)
    <section
      aria-label="추가 정보"
      className="flex flex-col gap-4 rounded-lg bg-blue-50 p-5 dark:bg-blue-900/20"
    >
      {/* 섹션 제목: text-lg font-semibold */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        추가 정보
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 비고 (있을 경우에만 표시) */}
        {notes && (
          <Card className="gap-3 border-blue-200 bg-white py-4 dark:border-blue-700 dark:bg-slate-800">
            <CardContent className="px-4">
              {/* 비고 헤더 */}
              <div className="mb-3 flex items-center gap-2">
                <StickyNote
                  className="size-4 text-blue-500 dark:text-blue-400"
                  aria-hidden="true"
                />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  비고
                </h4>
              </div>

              {/* 비고 내용 - whitespace-pre-wrap으로 줄바꿈 및 공백 유지 */}
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 결제 조건 (있을 경우에만 표시) */}
        {paymentTerms && (
          <Card className="gap-3 border-blue-200 bg-white py-4 dark:border-blue-700 dark:bg-slate-800">
            <CardContent className="px-4">
              {/* 결제 조건 헤더 */}
              <div className="mb-3 flex items-center gap-2">
                <CreditCard
                  className="size-4 text-blue-500 dark:text-blue-400"
                  aria-hidden="true"
                />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  결제 조건
                </h4>
              </div>

              {/* 결제 조건 내용 - whitespace-pre-wrap으로 줄바꿈 및 공백 유지 */}
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {paymentTerms}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
