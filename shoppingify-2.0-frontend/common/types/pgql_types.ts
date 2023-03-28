// PostGraphile Types

// ---------------- Receipt Types ------------- //
// get receipt
export interface ReceiptPgql {
  id: number
  merchant: string
  tax: string
  subtotal: string
  total: string
  currency: string
  purchaseDate: string
  purchaseTime: string
  receiptNumber: string
  numberOfItems: number
  lineItemsByReceiptNumberAndUser: {
    nodes: LineItemPgql[]
  }
}

// update receipt
export interface UpdateReceiptPgql {
  merchant?: string
  tax?: string
  subtotal?: string
  total?: string
  purchaseDate?: string
  purchaseTime?: string
  numberOfItems?: number
}

// ---------------- Line Item Types ------------- //
// get line item
export interface LineItemPgql {
  id: number
  price: number
  total: number
  unit: string
  itemTitle: string
  qty: number
}

// update line item
export interface UpdateLineItemPgql {
  price?: number
  total?: number
  unit?: string
  itemTitle?: string
  qty?: number
}

// create line item
export interface CreateLineItemPgql {
  price: number
  total: number
  unit: string
  itemTitle: string
  qty: number
  user: string
  receiptNumber: number
}
