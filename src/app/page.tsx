import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <section className="py-20 md:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                노션 기반
                <span className="text-primary block">견적서 웹 뷰어</span>
              </h1>

              <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
                노션에서 작성한 견적서를 전문적인 웹 인터페이스로 제공하고, PDF
                저장 기능으로 간편하게 공유하세요.
              </p>

              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div className="rounded-lg border p-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    공개 견적서 링크
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    클라이언트가 계정 없이 링크 클릭만으로 견적서 확인
                  </p>
                </div>
                <div className="rounded-lg border p-6">
                  <h3 className="mb-2 text-lg font-semibold">PDF 저장</h3>
                  <p className="text-muted-foreground text-sm">
                    전문적인 형식의 PDF를 한 번에 다운로드
                  </p>
                </div>
                <div className="rounded-lg border p-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    관리자 대시보드
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    패스워드 기반으로 모든 견적서를 관리
                  </p>
                </div>
                <div className="rounded-lg border p-6">
                  <h3 className="mb-2 text-lg font-semibold">반응형 디자인</h3>
                  <p className="text-muted-foreground text-sm">
                    PC, 태블릿, 모바일 모든 기기에 최적화
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
