// PostGraphile Types

import { BaseReceipt, BaseLineItem } from './base_types'

// ---------------- Receipt Types ------------- //
// get receipt
export interface ReceiptPgql
  extends Omit<BaseReceipt, 'tax' | 'subtotal' | 'total'> {
  id: number
  tax: string
  subtotal: string
  total: string
  numberOfItems: number
  lineItemsByReceiptNumberAndUser: {
    nodes: LineItemPgql[]
  }
}

// update receipt
export interface UpdateReceiptPgql
  extends Partial<
  Omit<
  ReceiptPgql,
  'receiptNumber' | 'lineItemsByReceiptNumberAndUser' | 'id'
  >
  > {
  receiptNumber?: number
  lineItemsByReceiptNumberAndUser?: {
    nodes: { [key: number]: UpdateLineItemPgql }
  }
}

// ---------------- Line Item Types ------------- //
// get line item
export interface LineItemPgql extends Omit<BaseLineItem, 'id'> {
  id: number
}

// update line item
export type UpdateLineItemPgql = Partial<LineItemPgql>

// create line item
export interface CreateLineItemPgql extends Omit<BaseLineItem, 'id'> {
  user?: string
  receiptNumber?: number
  sku?: string
}

// get line item with all receipts info
export interface LineItemStatsPgql extends LineItemPgql {
  receiptByReceiptNumberAndUser: {
    receiptNumber: number
    total: number
    numberOfItems: number
    purchaseDate: string
  }
}

// ---------------- Line Item & Receipts Stats Types ------------- //
export interface StatsPgql {
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

export interface LineItemGroupStatsPgql {
  sum: {
    total: string
  }
  keys: string[]
}
