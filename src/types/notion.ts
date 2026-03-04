/**
 * 노션 API 원시 응답 타입 - Invoices 테이블
 * CSV 구조 기반 (견적서 번호, 발행일, 상태, 유효기간, 총금액, 클라이언트명, 항목)
 */
export interface NotionInvoiceRaw {
  // 견적서 번호: INV-2026-001 형식
  견적서_번호: string

  // 발행일: "2026년 3월 4일" 형식
  발행일: string

  // 상태: "대기", "승인", "만료" 등
  상태: string

  // 유효기간: "2026년 6월 4일" 형식
  유효기간: string

  // 총금액: 빈 값 또는 "3,300,000" 형식 (항목에서 계산)
  총금액: string

  // 클라이언트명: "회사명" 형식
  클라이언트명: string

  // 항목: 노션 relation 링크 배열 (JSON 문자열)
  항목: string

  // 제목 (선택사항)
  제목?: string

  // 메모 (선택사항)
  메모?: string

  // 결제 조건 (선택사항)
  결제조건?: string

  // 노션 Page ID (내부 사용)
  id?: string

  // 생성 시간
  created_time?: string

  // 수정 시간
  last_edited_time?: string
}

/**
 * 노션 API 원시 응답 타입 - Items 테이블
 * CSV 구조 기반 (항목명, invoice relation, 금액, 단가, 수량)
 */
export interface NotionItemRaw {
  // 항목명: "웹사이트 디자인" 형식
  항목명: string

  // invoice relation: 견적서 번호 또는 노션 페이지 링크
  invoice: string

  // 금액: "₩300,000" 형식 (화폐 기호 포함)
  금액: string

  // 단가: "₩100,000" 형식
  단가: string

  // 수량: 숫자
  수량: number | string

  // 순서 (선택사항, 정렬용)
  순서?: number | string

  // 노션 Page ID (내부 사용)
  id?: string

  // 생성 시간
  created_time?: string

  // 수정 시간
  last_edited_time?: string
}

/**
 * 노션 Database 응답 타입
 */
export interface NotionDatabase {
  object: 'database'
  id: string
  created_time: string
  created_by: NotionUser
  last_edited_time: string
  last_edited_by: NotionUser
  title: NotionRichText[]
  description: NotionRichText[]
  is_inline: boolean
  is_template: boolean
  properties: Record<string, NotionPropertyConfig>
  parent: NotionParent
  url: string
  public_url: string | null
}

/**
 * 노션 Page 응답 타입
 */
export interface NotionPage {
  object: 'page'
  id: string
  created_time: string
  created_by: NotionUser
  last_edited_time: string
  last_edited_by: NotionUser
  created_by_id: string
  last_edited_by_id: string
  parent: NotionParent
  archived: boolean
  icon: NotionIcon | null
  cover: NotionFile | null
  properties: Record<string, NotionProperty>
  url: string
  public_url: string | null
}

/**
 * 노션 유저 타입
 */
export interface NotionUser {
  object: 'user'
  id: string
  type: 'person' | 'bot'
  person?: {
    email: string
  }
  bot?: {
    owner: {
      type: 'workspace'
    }
    workspace_name: string
  }
  name?: string
  avatar_url?: string
}

/**
 * 노션 부모 타입
 */
export interface NotionParent {
  type: 'database_id' | 'page_id' | 'workspace'
  database_id?: string
  page_id?: string
}

/**
 * 노션 아이콘 타입
 */
export interface NotionIcon {
  type: 'emoji' | 'external' | 'file' | 'database'
  emoji?: string
  external?: {
    url: string
  }
  file?: {
    url: string
  }
}

/**
 * 노션 파일 타입
 */
export interface NotionFile {
  type: 'external' | 'file'
  file?: {
    url: string
    expiry_time: string
  }
  external?: {
    url: string
  }
}

/**
 * 노션 Rich Text 타입
 */
export interface NotionRichText {
  type: 'text' | 'mention' | 'equation'
  text?: {
    content: string
    link: string | null
  }
  mention?: Record<string, unknown>
  equation?: {
    expression: string
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href: string | null
}

/**
 * 노션 Property 설정 타입
 */
export interface NotionPropertyConfig {
  id: string
  name: string
  type: string
  [key: string]: unknown
}

/**
 * 노션 Property 타입
 */
export interface NotionProperty {
  id: string
  type: string
  [key: string]: unknown
}

/**
 * 노션 Query 응답 타입
 */
export interface NotionQueryResponse {
  object: 'list'
  results: NotionPage[]
  next_cursor: string | null
  has_more: boolean
}
