/**
 * 신고 처리 Dialog 컴포넌트
 *
 * 구조:
 * - Dialog: 팝업 창
 * - 내용: 견적번호/클라이언트명, 신고 내용, 상태 라디오 버튼
 * - 액션: 취소/저장 버튼
 * - 상태 업데이트 시 reportStore 갱신
 */

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useReportStore } from '@/store/reportStore'
import type { Invoice, ReportStatus } from '@/types/invoice'

// ============================================================
// Props 타입 정의
// ============================================================

interface ReportDialogProps {
  invoice: Invoice
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ============================================================
// Dialog 컴포넌트
// ============================================================

/**
 * 신고 처리 Dialog
 */
export function ReportDialog({
  invoice,
  open,
  onOpenChange,
}: ReportDialogProps) {
  // 스토어에서 현재 신고 데이터 조회
  const { getReport, updateReport } = useReportStore()
  const currentReport = getReport(invoice.slug)

  // 로컬 상태: Dialog 내에서 임시로 상태 관리
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(
    currentReport?.status || 'pending'
  )

  // ============================================================
  // 이벤트 핸들러
  // ============================================================

  // 저장 버튼 클릭
  const handleSave = () => {
    updateReport(invoice.slug, selectedStatus)
    onOpenChange(false)
  }

  // 취소 버튼 클릭
  const handleCancel = () => {
    setSelectedStatus(currentReport?.status || 'pending')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Dialog 전체 배경: 흰색 기반으로 깔끔하게 */}
      <DialogContent className="bg-white p-6 sm:max-w-[500px]">
        {/* 헤더: 타이틀과 견적서 정보 */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            신고 처리
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {invoice.invoiceNumber} &mdash; {invoice.clientName}
          </DialogDescription>
        </DialogHeader>

        {/* 구분선 */}
        <div className="my-1 border-t border-slate-100" />

        {/* 본문 */}
        <div className="space-y-5">
          {/* 신고 내용 (읽기 전용) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              신고 내용
            </Label>
            {/* 텍스트 가독성: text-slate-800로 명확히 지정 */}
            <Textarea
              value={currentReport?.reportContent || '신고가 접수되었습니다.'}
              readOnly
              className="resize-none border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:ring-slate-300"
              rows={4}
            />
          </div>

          {/* 처리 상태 라디오 버튼 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              처리 상태
            </Label>
            {/* 라디오 옵션 컨테이너: 연한 배경으로 구역 강조 */}
            <RadioGroup
              value={selectedStatus}
              onValueChange={value => setSelectedStatus(value as ReportStatus)}
              className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              {/* 처리중 옵션 */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="status-pending" />
                <Label
                  htmlFor="status-pending"
                  className="cursor-pointer font-normal text-slate-700"
                >
                  처리중
                </Label>
              </div>

              {/* 처리완료 옵션 */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label
                  htmlFor="status-completed"
                  className="cursor-pointer font-normal text-slate-700"
                >
                  처리완료
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 마지막 수정 시각 */}
          {currentReport?.updatedAt && (
            <p className="text-xs text-slate-400">
              마지막 수정:{' '}
              {new Date(currentReport.updatedAt).toLocaleString('ko-KR')}
            </p>
          )}
        </div>

        {/* 구분선 */}
        <div className="mt-1 border-t border-slate-100" />

        {/* 푸터: 취소/저장 버튼 */}
        <DialogFooter className="gap-2 pt-1 sm:gap-2">
          {/* 취소 버튼: 테두리 스타일, 텍스트 명확히 */}
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            취소
          </Button>
          {/* 저장 버튼: 진한 배경 + 흰 글씨로 대비 확보 */}
          <Button
            type="button"
            onClick={handleSave}
            className="bg-slate-900 text-white hover:bg-slate-700"
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
