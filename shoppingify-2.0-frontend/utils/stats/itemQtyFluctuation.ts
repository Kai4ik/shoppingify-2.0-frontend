// ----- internal modules ----- //
import { stringDateIntoDateFormat } from '../helpers'

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

const calcLastQtyFluctuation = (lineItems: LineItemStatsPgql[]): number => {
  let totalQtyInLastThreeMonths = 0
  let totalQtyOld = 0

  lineItems.forEach((lineItem) => {
    const purchaseDate = stringDateIntoDateFormat(
      lineItem.receiptByReceiptNumberAndUser.purchaseDate
    )
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const ifWithinThreeMonthsRange: boolean =
      new Date() > purchaseDate && purchaseDate > threeMonthsAgo

    if (ifWithinThreeMonthsRange) totalQtyInLastThreeMonths += 1
    else totalQtyOld += 1
  })

  const qtyFluctuationInLastThreeMonths = parseFloat(
    (((totalQtyInLastThreeMonths - totalQtyOld) / totalQtyOld) * 100).toFixed(2)
  )

  return qtyFluctuationInLastThreeMonths
}

export default calcLastQtyFluctuation
