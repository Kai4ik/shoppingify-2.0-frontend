export interface ReceiptScanResponse {
  success: boolean
  error_message: string
  data: {
    merchant: string
    merchant_address: string
    tax: number
    subtotal: number
    total: number
    currency: string
    purchase_date: string
    payment_type: string
    receipt_number: string
    line_items: LineItem[]
  }
}

export interface LineItem {
  id: string
  sku?: string
  price: number
  total: number
  unit: string
  productTitle: string
  qty: number
  payAttention?: boolean
}
