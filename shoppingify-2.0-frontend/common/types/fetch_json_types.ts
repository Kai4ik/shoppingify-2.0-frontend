// ----- internal modules ----- //

// types
import {
  LineItemStatsPgql,
  ReceiptPgql,
  LineItemPgql,
  LineItemGroupStatsPgql
} from '@/common/types/pgql_types'

export interface FetchLineItemsResponse {
  data?: {
    allLineItems: {
      nodes: LineItemStatsPgql[]
    }
  }
  errors?: Array<{ message: string }>
}

export interface FetchReceiptsResponse {
  data?: {
    allReceipts: {
      nodes: ReceiptPgql[]
    }
  }
  errors?: Array<{ message: string }>
}

export interface FetchAllDataForSpecificUserResponse {
  data?: {
    allLineItems: {
      nodes: LineItemPgql[]
      groupedAggregates: [LineItemGroupStatsPgql]
    }
    allReceipts: {
      nodes: ReceiptPgql[]
      aggregates: {
        max: {
          total: string
          numberOfItems: number
        }
        min: {
          total: string
          numberOfItems: number
        }
        distinctCount: {
          merchant: string
          receiptNumber: string
        }
        average: {
          total: string
          numberOfItems: string
        }
        sum: {
          total: string
        }
      }
    }
  }
  errors?: Array<{ message: string }>
}
