// ----- internal modules ----- //
import { getMonthsNames, dateIntoMonthYearString } from '../helpers'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

const calcMonthlyItemCount = (
  receipts: ReceiptPgql[],
  months: number
): Array<{ items: number, month: string }> => {
  const labels: string[] = getMonthsNames(months)
  const totalByMonth: Array<{ month: string, items: number }> = []
  const sortedMonthPriceData: Array<{ items: number, month: string }> = []

  receipts.forEach((receipt: ReceiptPgql) => {
    const monthYearString = dateIntoMonthYearString(receipt.purchaseDate)
    const index = totalByMonth.findIndex(
      (elem) => elem.month === monthYearString
    )
    if (index === -1) {
      totalByMonth.push({
        month: monthYearString,
        items: receipt.numberOfItems
      })
    } else {
      totalByMonth[index].items += receipt.numberOfItems
    }
  })

  labels.forEach((label) => {
    if (totalByMonth.some((elem) => elem.month === label)) {
      const index = totalByMonth.findIndex(
        (elem: { items: number, month: string }) => elem.month === label
      )
      sortedMonthPriceData.push({
        items: totalByMonth[index].items,
        month: label
      })
    } else {
      sortedMonthPriceData.push({ items: 0, month: label })
    }
  })

  return sortedMonthPriceData.reverse()
}

export default calcMonthlyItemCount
