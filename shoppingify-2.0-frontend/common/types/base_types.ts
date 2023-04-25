export interface BaseReceipt {
  merchant: string
  purchaseDate: string
  purchaseTime: string
  currency: string
  receiptNumber: string
  tax: number
  subtotal: number
  total: number
}

export interface BaseLineItem {
  id: string
  itemTitle: string
  price: number
  total: number
  unit: string
  qty: number
}

export type BaseFetchResponse =
  | {
    success: true
    payload?: {
      [key: string]: string | number
    }
  }
  | {
    success: false
    errors: Array<{ message: string }>
  }
