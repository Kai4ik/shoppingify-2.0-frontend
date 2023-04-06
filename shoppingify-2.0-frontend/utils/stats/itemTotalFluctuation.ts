// ----- internal modules ----- //
import { stringDateIntoDateFormat } from '../helpers'

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

const calcItemTotalFluctuation = (lineItems: LineItemStatsPgql[]): number => {
  let totalAmountInLastThreeMonths = 0
  let totalAmountOld = 0

  lineItems.forEach((lineItem) => {
    const total = parseFloat(lineItem.total.toString())

    const purchaseDate = stringDateIntoDateFormat(
      lineItem.receiptByReceiptNumberAndUser.purchaseDate
    )
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const ifWithinThreeMonthsRange: boolean =
      new Date() > purchaseDate && purchaseDate > threeMonthsAgo

    if (ifWithinThreeMonthsRange) totalAmountInLastThreeMonths += total
    else totalAmountOld += total
  })

  const amountFluctuationInLastThreeMonths = parseFloat(
    (
      ((totalAmountInLastThreeMonths - totalAmountOld) / totalAmountOld) *
      100
    ).toFixed(2)
  )

  return amountFluctuationInLastThreeMonths
}

export default calcItemTotalFluctuation
