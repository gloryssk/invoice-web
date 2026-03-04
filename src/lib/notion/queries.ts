import type { NotionInvoiceRaw, NotionItemRaw, Invoice } from '@/types'
import { notionClient, DATABASES } from './client'
import {
  mapNotionInvoiceToInvoice,
  mapNotionItemsToInvoiceItems,
} from './mapper'

/**
 * 노션 API Property 타입
 */
interface NotionProperty {
  type: string
  title?: Array<{ plain_text: string }>
  rich_text?: Array<{ plain_text: string }>
  number?: number
  select?: { name: string }
  relation?: Array<{ id: string }>
  date?: { start: string; end?: string }
  formula?: { type: string; number?: number; string?: string }
}

/**
 * 노션 API 응답을 파싱하여 타입 안전한 데이터로 변환
 */
function parseNotionProperties(
  properties: Record<string, NotionProperty>
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, prop] of Object.entries(properties)) {
    if (!prop || typeof prop !== 'object') continue

    if (prop.type === 'title' && prop.title && prop.title.length > 0) {
      result[key] = prop.title.map(t => t.plain_text).join('')
    } else if (
      prop.type === 'rich_text' &&
      prop.rich_text &&
      prop.rich_text.length > 0
    ) {
      result[key] = prop.rich_text.map(t => t.plain_text).join('')
    } else if (prop.type === 'number') {
      result[key] = prop.number
    } else if (prop.type === 'select' && prop.select) {
      result[key] = prop.select.name
    } else if (prop.type === 'relation' && prop.relation) {
      // relation은 연결된 페이지 ID 배열로 반환
      result[key] = prop.relation.map(r => r.id)
    } else if (prop.type === 'date' && prop.date) {
      result[key] = prop.date.start
    } else if (prop.type === 'formula' && prop.formula) {
      // formula는 number 또는 string 값
      result[key] = prop.formula.number ?? prop.formula.string ?? null
    }
  }

  return result
}

/**
 * Invoice 페이지의 항목 relation ID 배열로 각 Item 페이지를 직접 조회
 * Items DB를 별도 쿼리하지 않고 양방향 relation 활용
 */
async function fetchItemsByRelationIds(
  itemIds: string[]
): Promise<NotionItemRaw[]> {
  if (itemIds.length === 0) return []

  // 각 항목 페이지를 병렬로 조회
  const itemPages = await Promise.all(
    itemIds.map(id => notionClient.pages.retrieve({ page_id: id }))
  )

  return itemPages
    .filter(page => 'properties' in page)
    .map((page, index) => {
      const props = parseNotionProperties(
        (page as { properties: Record<string, NotionProperty> }).properties
      )
      return {
        id: page.id,
        항목명: String(props['항목명'] || ''),
        금액: props['금액'] != null ? String(props['금액']) : '',
        단가: props['단가'] != null ? String(props['단가']) : '',
        수량: typeof props['수량'] === 'number' ? props['수량'] : 0,
        순서: props['순서'] ?? index,
      } as NotionItemRaw
    })
}

/**
 * 모든 견적서 조회
 * Invoice 페이지의 항목 relation으로 Items를 직접 조회
 */
export async function getAllInvoices(): Promise<Invoice[]> {
  try {
    if (!DATABASES.INVOICES) {
      throw new Error('노션 데이터베이스 ID가 설정되지 않았습니다')
    }

    const invoicesResponse = await notionClient.databases.query({
      database_id: DATABASES.INVOICES,
    })

    const invoices: Invoice[] = []

    for (const page of invoicesResponse.results) {
      if (page.object !== 'page' || !('properties' in page)) continue

      const props = parseNotionProperties(
        page.properties as Record<string, NotionProperty>
      )

      // 항목 relation ID 배열 추출
      const itemIds = Array.isArray(props['항목'])
        ? (props['항목'] as string[])
        : []

      const invoiceRaw: NotionInvoiceRaw = {
        id: page.id,
        견적서_번호: String(props['견적서 번호'] || ''),
        발행일: String(props['발행일'] || ''),
        상태: String(props['상태'] || 'draft'),
        유효기간: String(props['유효기간'] || ''),
        총금액: String(props['총금액'] || ''),
        클라이언트명: String(props['클라이언트명'] || ''),
        항목: JSON.stringify(itemIds),
      }

      // 양방향 relation으로 Items 페이지 직접 조회
      const items = await fetchItemsByRelationIds(itemIds)
      const invoiceItems = mapNotionItemsToInvoiceItems(items)
      const invoice = mapNotionInvoiceToInvoice(invoiceRaw, invoiceItems)
      invoices.push(invoice)
    }

    return invoices
  } catch (error) {
    console.error('노션 API 오류 - getAllInvoices:', error)
    throw new Error('견적서 목록 조회에 실패했습니다')
  }
}

/**
 * 특정 견적서 조회 (slug로 검색)
 * Invoice 페이지의 항목 relation으로 Items를 직접 조회
 */
export async function getInvoiceBySlug(slug: string): Promise<Invoice | null> {
  try {
    if (!DATABASES.INVOICES) {
      throw new Error('노션 데이터베이스 ID가 설정되지 않았습니다')
    }

    const invoicesResponse = await notionClient.databases.query({
      database_id: DATABASES.INVOICES,
      filter: {
        property: '견적서 번호',
        title: {
          equals: slug,
        },
      },
    })

    if (invoicesResponse.results.length === 0) {
      return null
    }

    const page = invoicesResponse.results[0]
    if (page.object !== 'page' || !('properties' in page)) return null

    const props = parseNotionProperties(
      page.properties as Record<string, NotionProperty>
    )

    // 항목 relation ID 배열 추출
    const itemIds = Array.isArray(props['항목'])
      ? (props['항목'] as string[])
      : []

    const invoiceRaw: NotionInvoiceRaw = {
      id: page.id,
      견적서_번호: String(props['견적서 번호'] || ''),
      발행일: String(props['발행일'] || ''),
      상태: String(props['상태'] || 'draft'),
      유효기간: String(props['유효기간'] || ''),
      총금액: String(props['총금액'] || ''),
      클라이언트명: String(props['클라이언트명'] || ''),
      항목: JSON.stringify(itemIds),
    }

    // 양방향 relation으로 Items 페이지 직접 조회
    const items = await fetchItemsByRelationIds(itemIds)
    const invoiceItems = mapNotionItemsToInvoiceItems(items)
    return mapNotionInvoiceToInvoice(invoiceRaw, invoiceItems)
  } catch (error) {
    console.error(`노션 API 오류 - getInvoiceBySlug(${slug}):`, error)
    throw new Error(`견적서 조회에 실패했습니다: ${slug}`)
  }
}
