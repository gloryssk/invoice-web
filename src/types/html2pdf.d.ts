/**
 * html2pdf.js 타입 선언 파일
 * 공식 @types 패키지가 없어 직접 선언합니다.
 */

// html2pdf.js 옵션 인터페이스
interface Html2PdfOptions {
  /** 마진 설정 (숫자 또는 배열) */
  margin?: number | [number, number] | [number, number, number, number]
  /** 출력 파일명 */
  filename?: string
  /** 이미지 설정 */
  image?: {
    type?: 'jpeg' | 'png' | 'webp'
    quality?: number
  }
  /** html2canvas 설정 */
  html2canvas?: {
    scale?: number
    useCORS?: boolean
    allowTaint?: boolean
    backgroundColor?: string
    logging?: boolean
    width?: number
    height?: number
    scrollX?: number
    scrollY?: number
  }
  /** jsPDF 설정 */
  jsPDF?: {
    unit?: 'pt' | 'mm' | 'cm' | 'in' | 'px'
    format?: string | [number, number]
    orientation?: 'portrait' | 'landscape' | 'p' | 'l'
    compress?: boolean
  }
  /** 페이지 나누기 설정 */
  pagebreak?: {
    mode?: string | string[]
    before?: string | string[]
    after?: string | string[]
    avoid?: string | string[]
  }
  /** 인쇄 모드 */
  enableLinks?: boolean
}

// html2pdf 빌더 인터페이스
interface Html2PdfInstance {
  set(options: Html2PdfOptions): Html2PdfInstance
  from(element: HTMLElement | string): Html2PdfInstance
  save(): Promise<void>
  output(type: string, options?: Record<string, unknown>): Promise<unknown>
  outputPdf(type?: string): Promise<unknown>
  toPdf(): Html2PdfInstance
  toContainer(): Html2PdfInstance
  toCanvas(): Html2PdfInstance
  toImg(): Html2PdfInstance
  then(onFulfilled: () => void): Html2PdfInstance
}

// html2pdf 함수 타입 선언
declare module 'html2pdf.js' {
  function html2pdf(): Html2PdfInstance
  function html2pdf(
    element: HTMLElement | string,
    options?: Html2PdfOptions
  ): Html2PdfInstance
  export = html2pdf
}
