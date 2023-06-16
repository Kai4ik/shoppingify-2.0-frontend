import {
  ReceiptPgql,
  LineItemPgql,
  LineItemStatsPgql,
  LineItemGroupStatsPgql
} from './pgql_types'

interface BaseResponse {
  data?: unknown
  errors?: Array<{ message: string }>
}

// ---------------- Receipt Types ------------- //
export interface createReceiptResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: {
    createReceipt: {
      receipt: {
        receiptNumber: number
      }
    }
  }
}

export interface updateReceiptResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: {
    updateReceiptByReceiptNumberAndUser: {
      receipt: {
        receiptNumber: number
      }
    }
  }
}

export interface deleteReceiptResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: {
    deleteReceiptByReceiptNumberAndUser: {
      receipt: {
        receiptNumber: number
      }
    }
  }
}

export interface GetReceiptsResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: {
    allReceipts: {
      nodes: ReceiptPgql[]
    }
  }
}

// ---------------- Line Items Types ------------- //
export interface createLineItemsResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: {
    [key: string]: {
      lineItem: {
        id: number
      }
    }
  }
}

export interface updateLineItemsResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: {
    [key: string]: {
      lineItem: {
        id: number
      }
    }
  }
}

export interface deleteLineItemsResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: {
    [key: string]: {
      deletedLineItemId: number
    }
  }
}

export interface GetLineItemsResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: {
    allLineItems: {
      nodes: LineItemStatsPgql[]
    }
  }
}

export interface GetAllDataForSpecificUserResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
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
}
