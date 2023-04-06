// ----- internal modules ----- //
import { getMonthsNames, stringDateIntoDateFormat } from '../helpers'

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

const getMonthlyItemPrice = (
  lineItems: LineItemStatsPgql[],
  monthsAgo: number
): Array<{ price: number, month: string }> => {
  const labels: string[] = getMonthsNames(monthsAgo)
  const monthPriceData: Array<{ price: number, month: string }> = []
  const sortedMonthPriceData: Array<{ price: number, month: string }> = []

  lineItems.forEach((item: LineItemStatsPgql) => {
    const purchaseDate = stringDateIntoDateFormat(
      item.receiptByReceiptNumberAndUser.purchaseDate
    )

    const nTimeAgo = new Date()
    nTimeAgo.setMonth(nTimeAgo.getMonth() - monthsAgo)

    const ifWithinRequestedTimeRange: boolean =
      new Date() > purchaseDate && purchaseDate > nTimeAgo
    if (ifWithinRequestedTimeRange) {
      const month = purchaseDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
      })

      if (monthPriceData.some((elem) => elem.month === month)) {
        const index = monthPriceData.findIndex(
          (elem: { price: number, month: string }) => elem.month === month
        )
        if (monthPriceData[index].price < item.price) {
          monthPriceData[index].price = item.price
        }
      } else {
        monthPriceData.push({ price: item.price, month })
      }
    }
  })

  labels.forEach((label) => {
    if (monthPriceData.some((elem) => elem.month === label)) {
      const index = monthPriceData.findIndex(
        (elem: { price: number, month: string }) => elem.month === label
      )
      sortedMonthPriceData.push({
        price: monthPriceData[index].price,
        month: label
      })
    } else {
      sortedMonthPriceData.push({ price: 0, month: label })
    }
  })

  return sortedMonthPriceData.reverse()
}

export default getMonthlyItemPrice
