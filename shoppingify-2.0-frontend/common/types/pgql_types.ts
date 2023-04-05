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
  receiptNumber?: number
  merchant?: string
  tax?: string
  subtotal?: string
  total?: string
  purchaseDate?: string
  purchaseTime?: string
  numberOfItems?: number
  lineItemsByReceiptNumberAndUser?: {
    nodes: { [key: number]: UpdateLineItemPgql }
  }
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
  id?: number
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

// get line item with all receipts info
export interface LineItemStatsPgql {
  id: number
  price: number
  total: number
  unit: string
  itemTitle: string
  qty: number
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
