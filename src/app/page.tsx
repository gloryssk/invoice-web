import {
  FileText,
  Link,
  Download,
  AlertCircle,
  LayoutDashboard,
} from 'lucide-react'
import NextLink from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 우측 상단 대시보드 버튼 */}
      <header className="flex justify-end px-6 pt-5">
        <NextLink
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <LayoutDashboard className="h-4 w-4" />
          관리자 대시보드
        </NextLink>
      </header>

      <main className="flex-1">
        {/* 상단 헤더 영역 */}
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            견적서 조회 시스템
          </h1>
          <p className="mt-3 text-base text-slate-500">
            노션 기반 견적서 관리 시스템에 오신 것을 환영합니다
          </p>
        </section>

        {/* 본문 카드 영역 */}
        <div className="mx-auto max-w-2xl space-y-5 px-4 pb-16">
          {/* 견적서 조회 방법 카드 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-slate-700">
              <FileText className="h-4 w-4" />
              <span className="font-semibold">견적서 조회 방법</span>
            </div>
            <ol className="space-y-4">
              <li>
                <p className="text-sm font-semibold text-slate-800">
                  1. 견적서 링크 받기
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  발행자로부터 이메일이나 메신저를 통해 견적서 고유 링크를
                  받습니다.
                </p>
              </li>
              <li>
                <p className="text-sm font-semibold text-slate-800">
                  2. 견적서 확인
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  링크를 클릭하면 견적서 내용을 웹에서 바로 확인할 수 있습니다.
                </p>
              </li>
              <li>
                <p className="text-sm font-semibold text-slate-800">
                  3. PDF 다운로드
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  견적서 페이지에서 &apos;PDF 다운로드&apos; 버튼을 클릭하여
                  파일로 저장하거나 인쇄할 수 있습니다.
                </p>
              </li>
            </ol>
          </div>

          {/* 견적서 URL 예시 카드 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-slate-700">
              <Download className="h-4 w-4" />
              <span className="font-semibold">견적서 URL 예시</span>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <code className="text-sm text-slate-600">
                https://yourdomain.com/view/[견적서ID]
              </code>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              발행자가 보낸 링크의 [견적서ID] 부분은 각 견적서마다 고유한
              값입니다.
            </p>
          </div>

          {/* 문제가 있나요? 카드 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-slate-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-semibold">문제가 있나요?</span>
            </div>
            <p className="text-sm text-slate-500">
              견적서를 찾을 수 없거나 문제가 발생한 경우, 견적서를 발행한
              담당자에게 올바른 링크를 다시 요청해 주세요.
            </p>
          </div>

          {/* 시스템 장점 카드 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-slate-700">
              <Link className="h-4 w-4" />
              <span className="font-semibold">시스템 특징</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-700">
                  공개 견적서 링크
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  계정 없이 링크만으로 견적서 확인
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-700">PDF 저장</p>
                <p className="mt-1 text-xs text-slate-500">
                  전문적인 형식의 PDF 즉시 다운로드
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-700">
                  관리자 대시보드
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  모든 견적서를 한눈에 관리
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-700">
                  반응형 디자인
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PC·태블릿·모바일 모두 최적화
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
