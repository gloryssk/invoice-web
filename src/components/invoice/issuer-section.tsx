/**
 * 발행사(공급자) 정보 섹션 컴포넌트
 *
 * 컴포넌트 구조:
 * ┌─────────────────────────────────────┐
 * │ IssuerSection                       │
 * │  ├─ 로고 아이콘 + 회사명 영역       │
 * │  │   ├─ Building2 아이콘 (로고 대체)│
 * │  │   ├─ 회사명 (bold)              │
 * │  │   └─ 사업자번호 (muted)         │
 * │  └─ 연락처 목록 (address)          │
 * │      ├─ 주소 (MapPin 아이콘)        │
 * │      ├─ 전화번호 (Phone 아이콘)     │
 * │      └─ 이메일 (Mail 아이콘)        │
 * └─────────────────────────────────────┘
 */

import { Building2, Phone, Mail, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

// 발행사 정보 Props 인터페이스
interface IssuerSectionProps {
  companyName?: string
  address?: string
  phone?: string
  email?: string
  businessNumber?: string
}

export function IssuerSection({
  companyName = '(주)글로리디자인',
  address = '서울특별시 강남구 테헤란로 123, 4층',
  phone = '02-1234-5678',
  email = 'contact@glorydesign.kr',
  businessNumber = '123-45-67890',
}: IssuerSectionProps) {
  return (
    // 발행사 정보 컨테이너 - 좌측 섹션
    <section aria-label="발행사 정보" className="flex flex-col gap-5">
      {/* 회사 로고 및 기본 정보 영역 */}
      <div className="flex items-start gap-4">
        {/* 로고 대체 아이콘 - 화면: w-20 h-20, 인쇄: w-24 h-24 */}
        <div
          className="bg-primary text-primary-foreground flex size-20 shrink-0 items-center justify-center rounded-2xl shadow-md print:size-24"
          aria-hidden="true"
        >
          <Building2 className="size-10 print:size-12" />
        </div>

        {/* 회사명 및 사업자번호 */}
        <div className="flex flex-col gap-1 pt-1">
          {/* 회사명: text-2xl font-bold, 인쇄 시 text-xl */}
          <h2 className="text-foreground text-2xl leading-tight font-bold tracking-tight print:text-xl">
            {companyName}
          </h2>
          <p className="text-muted-foreground bg-muted/60 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium">
            사업자번호 {businessNumber}
          </p>
        </div>
      </div>

      {/* 구분선 */}
      <Separator className="opacity-60" />

      {/* 연락처 정보 목록 - text-sm 그리드 레이아웃 */}
      <address className="not-italic">
        <ul className="grid grid-cols-1 gap-2" role="list">
          {/* 주소 */}
          <li className="text-muted-foreground flex items-start gap-2.5 text-sm">
            <MapPin
              className="text-primary/70 mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <span className="leading-snug">{address}</span>
          </li>

          {/* 전화번호 */}
          <li className="text-muted-foreground flex items-center gap-2.5 text-sm">
            <Phone
              className="text-primary/70 size-4 shrink-0"
              aria-hidden="true"
            />
            <a
              href={`tel:${phone}`}
              className="hover:text-foreground transition-colors hover:underline"
            >
              {phone}
            </a>
          </li>

          {/* 이메일 */}
          <li className="text-muted-foreground flex items-center gap-2.5 text-sm">
            <Mail
              className="text-primary/70 size-4 shrink-0"
              aria-hidden="true"
            />
            <a
              href={`mailto:${email}`}
              className="hover:text-foreground transition-colors hover:underline"
            >
              {email}
            </a>
          </li>
        </ul>
      </address>
    </section>
  )
}
