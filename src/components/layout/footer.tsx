import { Container } from './container'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/40 border-t">
      <Container>
        <div className="py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Invoice Viewer. 모든 권리 보유.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
