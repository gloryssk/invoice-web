/**
 * 클라이언트(수신자) 정보 섹션 컴포넌트
 * 클라이언트 상호명, 주소, 연락처를 표시합니다.
 */

import { User, MapPin, Phone, Mail } from 'lucide-react'

// 클라이언트 정보 Props 인터페이스
interface ClientSectionProps {
  clientName: string
  clientAddress?: string
  clientPhone?: string
  clientEmail?: string
}

export function ClientSection({
  clientName,
  clientAddress,
  clientPhone,
  clientEmail,
}: ClientSectionProps) {
  return (
    // 클라이언트 정보 컨테이너
    <section aria-label="클라이언트 정보" className="flex flex-col gap-4">
      {/* 섹션 헤더 - text-lg font-bold, border-b-2로 강조 */}
      <div className="flex items-center gap-2 border-b-2 border-gray-200 pb-3 dark:border-gray-700">
        <div
          className="bg-muted flex size-8 items-center justify-center rounded-lg"
          aria-hidden="true"
        >
          <User className="text-muted-foreground size-4" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          수신처
        </h3>
      </div>

      {/* 클라이언트 상세 정보 - 2열 그리드 (md 이상) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 상호명 - 라벨 위, 값 아래 레이아웃 */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
            상호명
          </span>
          <p className="text-foreground text-base font-semibold">
            {clientName}
          </p>
        </div>

        {/* 주소 - 라벨 위, 값 아래 레이아웃 */}
        {clientAddress && (
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
              <MapPin className="size-3" aria-hidden="true" />
              주소
            </span>
            <p className="text-muted-foreground text-sm leading-snug">
              {clientAddress}
            </p>
          </div>
        )}

        {/* 전화번호 - 라벨 위, 값 아래 레이아웃 */}
        {clientPhone && (
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
              <Phone className="size-3" aria-hidden="true" />
              전화번호
            </span>
            <a
              href={`tel:${clientPhone}`}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors hover:underline"
            >
              {clientPhone}
            </a>
          </div>
        )}

        {/* 이메일 - 라벨 위, 값 아래 레이아웃 */}
        {clientEmail && (
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
              <Mail className="size-3" aria-hidden="true" />
              이메일
            </span>
            <a
              href={`mailto:${clientEmail}`}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors hover:underline"
            >
              {clientEmail}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
