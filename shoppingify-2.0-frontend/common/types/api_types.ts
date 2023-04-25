// ----- internal modules ----- //
// types
import { BaseReceipt, BaseLineItem } from './base_types'

export interface ReceiptScan extends BaseReceipt {
  merchantAddress: string
  paymentType: string
  lineItems: LineItemScan[]
}

export interface ReceiptScanResponse {
  success: boolean
  error_message: string
  data: ReceiptScan
}

export interface LineItemScan extends BaseLineItem {
  sku?: string
  payAttention?: boolean
}
