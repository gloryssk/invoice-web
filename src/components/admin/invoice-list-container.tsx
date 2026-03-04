/**
 * 견적서 목록 컨테이너 컴포넌트
 *
 * 구조:
 * - 검색/정렬 상태 관리 (클라이언트)
 * - 필터링 및 정렬 로직 처리
 * - 반응형: 모바일(카드) / 데스크톱(테이블) 전환
 * - 페이지네이션 처리
 * - 빈 상태 처리
 *
 * TASK-008: Invoice 타입으로 교체 완료
 */

'use client'

import { useState, useMemo, Suspense, lazy } from 'react'
import { FileText, SearchX } from 'lucide-react'
import { InvoiceSearch } from '@/components/admin/invoice-search'
import { InvoiceSort, type SortOption } from '@/components/admin/invoice-sort'
import { InvoicePagination } from '@/components/admin/invoice-pagination'
import type { Invoice } from '@/types/invoice'

// 코드 스플리팅: 큰 컴포넌트는 동적 로딩으로 성능 최적화
const InvoiceTable = lazy(() =>
  import('@/components/admin/invoice-table').then(mod => ({
    default: mod.InvoiceTable,
  }))
)
const InvoiceCardList = lazy(() =>
  import('@/components/admin/invoice-card').then(mod => ({
    default: mod.InvoiceCardList,
  }))
)

// 로딩 스켈레톤 컴포넌트
import { InvoiceSkeleton } from '@/components/invoice/invoice-skeleton'

// ============================================================
// 상수 정의
// ============================================================

/** 페이지당 표시할 견적서 수 */
const ITEMS_PER_PAGE = 8

// ============================================================
// Props 타입 정의
// ============================================================

interface InvoiceListContainerProps {
  /** 초기 견적서 목록 */
  invoices: Invoice[]
}

// ============================================================
// 컨테이너 컴포넌트
// ============================================================

/**
 * 견적서 목록 컨테이너
 * 검색, 정렬, 페이지네이션 상태를 통합 관리
 */
export function InvoiceListContainer({ invoices }: InvoiceListContainerProps) {
  // --------------------------------------------------------
  // 상태 관리
  // TODO: TASK-008에서 Zustand 스토어로 이전
  // --------------------------------------------------------

  /** 검색어 상태 */
  const [searchQuery, setSearchQuery] = useState('')
  /** 정렬 기준 상태 */
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  /** 현재 페이지 상태 */
  const [currentPage, setCurrentPage] = useState(1)

  // --------------------------------------------------------
  // 필터링 및 정렬 처리
  // --------------------------------------------------------

  /** 검색어로 필터링된 견적서 목록 */
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices

    const query = searchQuery.toLowerCase()
    return invoices.filter(
      inv =>
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.clientName.toLowerCase().includes(query)
    )
  }, [invoices, searchQuery])

  /** 정렬 적용된 견적서 목록 (Invoice 타입: issueDate, totalAmount 필드) */
  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return (
            new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
          )
        case 'oldest':
          return (
            new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
          )
        case 'amount_high':
          return b.totalAmount - a.totalAmount
        case 'amount_low':
          return a.totalAmount - b.totalAmount
        default:
          return 0
      }
    })
  }, [filteredInvoices, sortOption])

  /** 전체 페이지 수 */
  const totalPages = Math.max(
    1,
    Math.ceil(sortedInvoices.length / ITEMS_PER_PAGE)
  )

  /** 현재 페이지에 표시할 견적서 */
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedInvoices, currentPage])

  // --------------------------------------------------------
  // 검색어 변경 시 첫 페이지로 이동
  // --------------------------------------------------------

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: SortOption) => {
    setSortOption(value)
    setCurrentPage(1)
  }

  // --------------------------------------------------------
  // 렌더링
  // --------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* 검색 및 정렬 툴바 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* 검색 바 */}
        <InvoiceSearch
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1"
        />

        {/* 정렬 드롭다운 */}
        <InvoiceSort
          value={sortOption}
          onChange={handleSortChange}
          className="shrink-0"
        />
      </div>

      {/* 검색 결과 없음 상태 */}
      {searchQuery && filteredInvoices.length === 0 && (
        <EmptySearchState query={searchQuery} />
      )}

      {/* 견적서 없음 상태 */}
      {!searchQuery && invoices.length === 0 && <EmptyInvoiceState />}

      {/* 견적서 목록 */}
      {paginatedInvoices.length > 0 && (
        <>
          {/* 데스크톱: 테이블 레이아웃 (동적 로딩으로 성능 최적화) */}
          <div className="hidden md:block" aria-label="견적서 목록 테이블">
            <Suspense fallback={<InvoiceSkeleton />}>
              <InvoiceTable invoices={paginatedInvoices} />
            </Suspense>
          </div>

          {/* 모바일: 카드 레이아웃 (동적 로딩으로 성능 최적화) */}
          <div className="md:hidden" aria-label="견적서 카드 목록">
            <Suspense fallback={<InvoiceSkeleton />}>
              <InvoiceCardList invoices={paginatedInvoices} />
            </Suspense>
          </div>

          {/* 페이지네이션 */}
          <InvoicePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
            onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          />
        </>
      )}

      {/* 총 건수 푸터 */}
      <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-400">
        총{' '}
        <span className="font-semibold text-slate-600">
          {filteredInvoices.length}
        </span>
        개의 견적서
        {searchQuery && (
          <span className="ml-1">
            (전체{' '}
            <span className="font-semibold text-slate-600">
              {invoices.length}
            </span>
            개 중)
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================================
// 빈 상태 컴포넌트
// ============================================================

/**
 * 검색 결과 없음 상태
 */
function EmptySearchState({ query }: { query: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-16 text-center"
      role="status"
      aria-label="검색 결과 없음"
    >
      <SearchX className="mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-500">
        &ldquo;{query}&rdquo; 검색 결과가 없습니다
      </p>
      <p className="mt-1 text-xs text-slate-400">
        견적서 번호 또는 클라이언트명을 다시 확인해주세요
      </p>
    </div>
  )
}

/**
 * 견적서 없음 상태
 */
function EmptyInvoiceState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-20 text-center"
      role="status"
      aria-label="견적서 없음"
    >
      <FileText className="mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-500">
        등록된 견적서가 없습니다
      </p>
      <p className="mt-1 text-xs text-slate-400">
        노션에서 견적서를 작성하면 이 곳에 표시됩니다
      </p>
    </div>
  )
}
