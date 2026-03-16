/**
 * 신고 처리 Zustand 스토어
 *
 * 구조:
 * - 상태: reports (신고 데이터 매핑)
 * - 액션: updateReport (상태 업데이트), getReport (조회), clearReports (초기화)
 * - localStorage persist로 데이터 유지
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReportEntry, ReportStatus } from '@/types/invoice'

// ============================================================
// 타입 정의
// ============================================================

interface ReportState {
  reports: Record<string, ReportEntry>
}

interface ReportActions {
  updateReport: (slug: string, status: ReportStatus) => void
  getReport: (slug: string) => ReportEntry | undefined
  clearReports: () => void
}

type ReportStore = ReportState & ReportActions

// ============================================================
// 초기 상태
// ============================================================

const initialState: ReportState = {
  reports: {},
}

// ============================================================
// 스토어 구현
// ============================================================

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 신고 상태 업데이트
      updateReport: (slug: string, status: ReportStatus) => {
        set(state => ({
          reports: {
            ...state.reports,
            [slug]: {
              slug,
              status,
              reportContent:
                state.reports[slug]?.reportContent || '신고가 접수되었습니다.',
              updatedAt: new Date().toISOString(),
            },
          },
        }))
      },

      // 특정 신고 조회
      getReport: (slug: string) => {
        return get().reports[slug]
      },

      // 스토어 초기화
      clearReports: () => {
        set(initialState)
      },
    }),
    {
      name: 'invoice-report-store', // localStorage 키
    }
  )
)
