// ----- internal modules ----- //

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

export const calcGroupedPurchaseTimeCount = (
  receipts: ReceiptPgql[]
): Array<{ time: string, number: number }> => {
  let morning = 0
  let afternoon = 0
  let evening = 0

  receipts.forEach((receipt: ReceiptPgql) => {
    const purchaseTime = receipt.purchaseTime
    const hour = parseInt(purchaseTime.split(':')[0])
    if (hour >= 8 && hour < 13) morning += 1
    else if (hour >= 13 && hour < 18) afternoon += 1
    else if (hour >= 18 && hour < 23) evening += 1
  })

  return [
    { time: 'Morning (8am - 1pm)', number: morning },
    { time: 'Afternoon (1pm - 6pm)', number: afternoon },
    { time: 'Evening (6pm - 11pm)', number: evening }
  ]
}

export default calcGroupedPurchaseTimeCount
