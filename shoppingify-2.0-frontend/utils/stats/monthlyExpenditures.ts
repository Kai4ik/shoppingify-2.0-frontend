// ----- internal modules ----- //
import { getMonthsNames, dateIntoMonthYearString } from '../helpers'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

const calcExpendituresByMonths = (
  receipts: ReceiptPgql[],
  months: number
): Array<{ total: number, month: string }> => {
  const labels: string[] = getMonthsNames(months)
  const totalByMonth: Array<{ month: string, total: number }> = []
  const sortedMonthPriceData: Array<{ total: number, month: string }> = []

  receipts.forEach((receipt: ReceiptPgql) => {
    const monthYearString = dateIntoMonthYearString(receipt.purchaseDate)
    const index = totalByMonth.findIndex(
      (elem) => elem.month === monthYearString
    )
    if (index === -1) {
      totalByMonth.push({
        month: monthYearString,
        total: parseFloat(receipt.total)
      })
    } else {
      totalByMonth[index].total += parseFloat(receipt.total)
    }
  })

  labels.forEach((label) => {
    if (totalByMonth.some((elem) => elem.month === label)) {
      const index = totalByMonth.findIndex(
        (elem: { total: number, month: string }) => elem.month === label
      )
      sortedMonthPriceData.push({
        total: totalByMonth[index].total,
        month: label
      })
    } else {
      sortedMonthPriceData.push({ total: 0, month: label })
    }
  })

  return sortedMonthPriceData.reverse()
}

export default calcExpendituresByMonths
