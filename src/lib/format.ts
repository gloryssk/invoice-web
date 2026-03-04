/**
 * 유틸리티: 포맷 함수 모음
 * 날짜, 금액 등 표시 형식 변환을 담당합니다.
 */

import type { Currency } from '@/types/invoice'

/**
 * 날짜 문자열을 한국어 형식으로 변환합니다.
 * 예: "2026-03-04T00:00:00.000Z" → "2026년 3월 4일"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * 숫자를 통화 형식으로 변환합니다.
 * 예: 1000000 → "1,000,000원"
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'KRW'
): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * 숫자를 천 단위 구분자로 변환합니다.
 * 예: 1000000 → "1,000,000"
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount)
}

/**
 * VAT(10%) 금액을 계산합니다.
 */
export function calculateVat(subtotal: number): number {
  return Math.round(subtotal * 0.1)
}

/**
 * 소계에서 VAT를 포함한 총액을 계산합니다.
 */
export function calculateTotal(subtotal: number): number {
  return subtotal + calculateVat(subtotal)
}
