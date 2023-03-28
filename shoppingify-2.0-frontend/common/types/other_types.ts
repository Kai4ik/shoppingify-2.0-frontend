import { DetailedDiff } from 'deep-object-diff'
import { UpdateLineItemPgql } from './pgql_types'

export interface ExtendedDetailedDiff extends DetailedDiff {
  added: {
    lineItemsByReceiptNumberAndUser?: {
      nodes: {
        [key: number]: {
          id: number
          itemTitle: string
          price: number
          qty: number
          total: number
          unit: string
        }
      }
    }
  }
  deleted: {
    lineItemsByReceiptNumberAndUser?: {
      nodes: { [key: number]: undefined }
    }
  }
  updated: {
    lineItemsByReceiptNumberAndUser?: {
      nodes: { [key: number]: UpdateLineItemPgql }
    }
    receiptNumber?: number
    total?: string
    subtotal?: string
    tax?: string
    purchaseTime?: string
    purchaseDate?: string
    merchant?: string
  }
}
