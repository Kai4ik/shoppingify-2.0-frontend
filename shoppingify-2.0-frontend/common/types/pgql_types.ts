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

export interface ReceiptsGeneralStatsPgql {
  allReceipts: {
    nodes: Array<{
      receiptNumber: string
      purchaseDate: string
    }>
    aggregates: {
      distinctCount: {
        receiptNumber: string
        merchant: string
      }
      average: {
        total: string
        numberOfItems: string
      }
      sum: {
        total: string
        tax: string
      }
    }
  }
  getmaxtotalreceipt: {
    nodes: Array<{
      receiptnumber: string
      total: string
      purchasedate: string
    }>
  }
  getmintotalreceipt: {
    nodes: Array<{
      receiptnumber: string
      total: string
      purchasedate: string
    }>
  }
  getmaxnumberofitems: {
    nodes: Array<{
      receiptnumber: string
      numberofitems: string
      purchasedate: string
    }>
  }
  getminnumberofitems: {
    nodes: Array<{
      receiptnumber: string
      numberofitems: string
      purchasedate: string
    }>
  }
}

export interface LineItemsGeneralStatsPgql {
  getcheapestitem: {
    nodes: Array<{
      itemtitle: string
      price: string
    }>
  }
  getmostexpensiveitem: {
    nodes: Array<{
      itemtitle: string
      price: string
    }>
  }
  getmostspendonitem: {
    nodes: Array<{
      itemtitle: string
      totalsum: string
    }>
  }
  getmostpurchaseditem: {
    nodes: Array<{
      itemtitle: string
      totalcount: string
    }>
  }
  countbynumberofitems: {
    nodes: Array<{
      countcategory: string
      numberofitemscount: string
    }>
  }
}

export interface TimingStatsPgql {
  countbyweekday: {
    nodes: Array<{
      weekday: string
      numberoftimescount: string
    }>
  }
  countbypurchasetime: {
    nodes: Array<{
      timeframe: string
      numberoftimescount: string
    }>
  }
}

export interface MonthlyExpendituresPgql {
  monthlyexpenditures: {
    nodes: Array<{
      monthname: string
      monthlytotal: string
    }>
  }
}

export interface MonthlyItemsCountPgql {
  monthlyitemscount: {
    nodes: Array<{
      monthname: string
      monthlyitemstotal: string
    }>
  }
}
