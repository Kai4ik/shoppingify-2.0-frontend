// ----- internal modules ----- //
// types
import {
  CreateLineItemPgql,
  UpdateLineItemPgql,
  UpdateReceiptPgql
} from '@/common/types/pgql_types'
import { ReceiptScan } from './api_types'

// line items crud types
export interface createLineItemInput {
  [key: string]: {
    [key: string]: CreateLineItemPgql
  }
}

export interface updateLineItemInput {
  [key: string]: {
    id: number
    lineItemPatch: UpdateLineItemPgql
  }
}

export interface deleteLineItemInput {
  [key: string]: {
    [key: string]: number
  }
}

// receipt crud types
export interface ReceiptInput
  extends Omit<ReceiptScan, 'receiptNumber' | 'lineItems'> {
  receiptNumber: number
  user: string
  numberOfItems: number
}

export interface createReceiptInput {
  [key: string]: {
    receipt: ReceiptInput
  }
}

export interface updateReceiptInput {
  [key: string]: {
    receiptNumber: number
    user: string
    receiptPatch: UpdateReceiptPgql
  }
}

export interface deleteReceiptInput {
  [key: string]: {
    receiptNumber: number
    user: string
  }
}
