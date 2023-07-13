import {
  ReceiptPgql,
  LineItemStatsPgql,
  MonthlyItemsCountPgql,
  ReceiptsGeneralStatsPgql,
  LineItemsGeneralStatsPgql,
  TimingStatsPgql,
  MonthlyExpendituresPgql
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

// ---------------- Stats Items Types ------------- //
export interface GetReceiptsGeneralStatsResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: ReceiptsGeneralStatsPgql
}

export interface GetLineItemsGeneralStatsResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: LineItemsGeneralStatsPgql
}

export interface GetTimingStatsResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: TimingStatsPgql
}

export interface GetMonthlyExpendituresResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: MonthlyExpendituresPgql
}

export interface GetMonthlyItemsCountResponse
  extends Readonly<Omit<BaseResponse, 'data'>> {
  data?: MonthlyItemsCountPgql
}
