// ----- internal modules ----- //

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

export const calculateLastThreeMonthsFluctuation = (
  lineItems: LineItemStatsPgql[]
): { totalFluctuation: number, qtyFluctuation: number } => {
  let totalQtyInLastThreeMonths = 0
  let totalQtyOld = 0
  let totalAmountInLastThreeMonths = 0
  let totalAmountOld = 0

  const lastThreeMonths = getMonthsNames(3)

  lineItems.forEach((lineItem) => {
    const total = parseFloat(lineItem.total.toString())

    const monthPurchased = new Date(
      lineItem.receiptByReceiptNumberAndUser.purchaseDate
    ).toLocaleString('default', { month: 'long' })

    if (lastThreeMonths.includes(monthPurchased)) {
      totalAmountInLastThreeMonths += total
      totalQtyInLastThreeMonths += 1
    } else {
      totalQtyOld += 1
      totalAmountOld += total
    }
  })

  const qtyFluctuationInLastThreeMonths = parseFloat(
    (((totalQtyInLastThreeMonths - totalQtyOld) / totalQtyOld) * 100).toFixed(2)
  )

  const amountFluctuationInLastThreeMonths = parseFloat(
    (
      ((totalAmountInLastThreeMonths - totalAmountOld) / totalAmountOld) *
      100
    ).toFixed(2)
  )

  return {
    totalFluctuation: amountFluctuationInLastThreeMonths,
    qtyFluctuation: qtyFluctuationInLastThreeMonths
  }
}

export const getLowestItemPrice = (
  lineItems: LineItemStatsPgql[]
): LineItemStatsPgql => {
  return lineItems.reduce((accum, curr) =>
    curr.price < accum.price ? curr : accum
  )
}

export const getHighestItemPrice = (
  lineItems: LineItemStatsPgql[]
): LineItemStatsPgql => {
  return lineItems.reduce((accum, curr) =>
    curr.price > accum.price ? curr : accum
  )
}

export const getChartData = (
  lineItems: LineItemStatsPgql[],
  monthsAgo: number
): Array<{ price: number, month: string }> => {
  const labels: string[] = getMonthsNames(monthsAgo)
  const monthPriceData: Array<{ price: number, month: string }> = []
  const sortedMonthPriceData: Array<{ price: number, month: string }> = []

  lineItems.forEach((item: LineItemStatsPgql) => {
    const purchaseDateArray =
      item.receiptByReceiptNumberAndUser.purchaseDate.split('-')
    const purchaseDate = new Date(
      parseInt(purchaseDateArray[0]),
      parseInt(purchaseDateArray[1]) - 1,
      parseInt(purchaseDateArray[2])
    )

    const nTimeAgo = new Date()
    nTimeAgo.setMonth(nTimeAgo.getMonth() - monthsAgo)

    const ifWithinRequestedTimeRange: boolean =
      new Date() > purchaseDate && purchaseDate > nTimeAgo
    if (ifWithinRequestedTimeRange) {
      const month = purchaseDate.toLocaleString('default', { month: 'long' })

      if (monthPriceData.some((elem) => elem.month === month)) {
        const index = monthPriceData.findIndex(
          (elem: { price: number, month: string }) => elem.month === month
        )
        if (monthPriceData[index].price < item.price) { monthPriceData[index].price = item.price }
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

const getMonthsNames = (total: number): string[] => {
  const today = new Date()
  const months: string[] = []

  for (let i = 0; i < total; i++) {
    const month = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    ).toLocaleString('default', { month: 'long' })
    months.push(month)
  }
  return months
}
