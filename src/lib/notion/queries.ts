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
}

/**
 * 노션 API 응답을 파싱하여 타입 안전한 데이터로 변환
 * 노션 API 응답의 properties는 복잡한 구조를 가지므로 간편한 인터페이스로 변환
 */
function parseNotionProperties(
  properties: Record<string, NotionProperty>
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, prop] of Object.entries(properties)) {
    if (!prop || typeof prop !== 'object') continue

    // 각 property 타입별로 값 추출
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
      result[key] = prop.relation.map(r => r.id)
    }
  }

  return result
}

/**
 * 모든 견적서 조회
 * 활성화된(archived가 아닌) 견적서만 반환
 */
export async function getAllInvoices(): Promise<Invoice[]> {
  try {
    // 환경변수 검증
    if (!DATABASES.INVOICES || !DATABASES.ITEMS) {
      throw new Error('노션 데이터베이스 ID가 설정되지 않았습니다')
    }

    // Invoices 테이블에서 활성화된 페이지만 조회
    const invoicesResponse = await notionClient.databases.query({
      database_id: DATABASES.INVOICES,
      filter: {
        property: 'archived',
        checkbox: {
          equals: false,
        },
      },
    })

    // 각 견적서에 대해 항목 조회 및 변환
    const invoices: Invoice[] = []

    for (const page of invoicesResponse.results) {
      if (page.object !== 'page' || !('properties' in page)) continue

      const props = parseNotionProperties(
        page.properties as Record<string, NotionProperty>
      )
      const invoiceRaw: NotionInvoiceRaw = {
        id: page.id,
        견적서_번호: String(props['견적서 번호'] || ''),
        발행일: String(props['발행일'] || ''),
        상태: String(props['상태'] || 'draft'),
        유효기간: String(props['유효기간'] || ''),
        총금액: String(props['총금액'] || ''),
        클라이언트명: String(props['클라이언트명'] || ''),
        항목: JSON.stringify(props['항목'] || []),
      }

      // 항목 조회
      const itemsResponse = await notionClient.databases.query({
        database_id: DATABASES.ITEMS,
        filter: {
          property: 'invoice',
          relation: {
            contains: page.id,
          },
        },
      })

      const items = itemsResponse.results
        .filter(item => item.object === 'page' && 'properties' in item)
        .map(itemPage => {
          const props = parseNotionProperties(
            (itemPage as { properties: Record<string, NotionProperty> })
              .properties
          )
          return {
            id: (itemPage as { id: string }).id,
            항목명: String(props['항목명'] || ''),
            금액: String(props['금액'] || ''),
            단가: String(props['단가'] || ''),
            수량: typeof props['수량'] === 'number' ? props['수량'] : 0,
            순서: props['순서'],
          } as NotionItemRaw
        })

      const invoiceItems = mapNotionItemsToInvoiceItems(
        items.filter(item => item !== null)
      )
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
 */
export async function getInvoiceBySlug(slug: string): Promise<Invoice | null> {
  try {
    // 환경변수 검증
    if (!DATABASES.INVOICES || !DATABASES.ITEMS) {
      throw new Error('노션 데이터베이스 ID가 설정되지 않았습니다')
    }

    // Invoices 테이블에서 견적서 번호로 검색
    const invoicesResponse = await notionClient.databases.query({
      database_id: DATABASES.INVOICES,
      filter: {
        and: [
          {
            property: 'archived',
            checkbox: {
              equals: false,
            },
          },
          {
            property: '견적서 번호',
            title: {
              equals: slug,
            },
          },
        ],
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
    const invoiceRaw: NotionInvoiceRaw = {
      id: page.id,
      견적서_번호: String(props['견적서 번호'] || ''),
      발행일: String(props['발행일'] || ''),
      상태: String(props['상태'] || 'draft'),
      유효기간: String(props['유효기간'] || ''),
      총금액: String(props['총금액'] || ''),
      클라이언트명: String(props['클라이언트명'] || ''),
      항목: JSON.stringify(props['항목'] || []),
    }

    // 항목 조회
    const itemsResponse = await notionClient.databases.query({
      database_id: DATABASES.ITEMS,
      filter: {
        property: 'invoice',
        relation: {
          contains: page.id,
        },
      },
    })

    const items = itemsResponse.results
      .filter(item => item.object === 'page' && 'properties' in item)
      .map(itemPage => {
        const props = parseNotionProperties(
          (itemPage as { properties: Record<string, NotionProperty> })
            .properties
        )
        return {
          id: (itemPage as { id: string }).id,
          항목명: String(props['항목명'] || ''),
          금액: String(props['금액'] || ''),
          단가: String(props['단가'] || ''),
          수량: typeof props['수량'] === 'number' ? props['수량'] : 0,
          순서: props['순서'],
        } as NotionItemRaw
      })

    const invoiceItems = mapNotionItemsToInvoiceItems(items)
    const invoice = mapNotionInvoiceToInvoice(invoiceRaw, invoiceItems)

    return invoice
  } catch (error) {
    console.error(`노션 API 오류 - getInvoiceBySlug(${slug}):`, error)
    throw new Error(`견적서 조회에 실패했습니다: ${slug}`)
  }
}
