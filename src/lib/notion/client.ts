import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

/**
 * 노션 클라이언트 초기화
 * NOTION_TOKEN을 사용하여 인증된 클라이언트 생성
 */
export const notionClient = new Client({
  auth: env.NOTION_TOKEN,
})

/**
 * 데이터베이스 ID
 * 항목(Items)은 양방향 relation으로 Invoice 페이지에서 직접 조회
 */
export const DATABASES = {
  INVOICES: env.NOTION_INVOICES_DB_ID,
} as const
