// ----- internal modules ----- //
// types
import { ReceiptPgql } from '@/common/types/pgql_types'

export const getMinValue = (receipts: ReceiptPgql[]): number => {
  let min: number = Math.floor(parseFloat(receipts[0].total))
  receipts.forEach((receipt) => {
    const total = Math.floor(parseFloat(receipt.total))
    if (total < min) min = total
  })
  return min
}

export const getMaxValue = (receipts: ReceiptPgql[]): number => {
  let max: number = Math.floor(parseFloat(receipts[0].total))
  receipts.forEach((receipt) => {
    const total = Math.floor(parseFloat(receipt.total))
    if (total > max) max = total
  })
  return max
}
