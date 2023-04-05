// ----- internal modules ----- //

// types
import {
  LineItemPgql,
  LineItemStatsPgql,
  ReceiptPgql,
  LineItemGroupStatsPgql
} from '@/common/types/pgql_types'

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

const getMonthsNames = (total: number): string[] => {
  const today = new Date()
  const months: string[] = []

  for (let i = 0; i < total; i++) {
    const month = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    ).toLocaleString('default', { month: 'long', year: 'numeric' })
    months.push(month)
  }
  return months
}

export const getReceiptByTotal = (
  total: string,
  receipts: ReceiptPgql[]
): ReceiptPgql => {
  const index = receipts.findIndex(
    (receipt: ReceiptPgql) => receipt.total === total
  )
  return receipts[index]
}

export const getMostExpensiveAndCheapestItems = (
  lineItems: LineItemPgql[]
): { cheapest: LineItemPgql, mostExpensive: LineItemPgql } => {
  let mostExpensive: LineItemPgql = lineItems[0]
  let cheapest: LineItemPgql = lineItems[0]
  lineItems.forEach((lineItem) => {
    if (
      parseFloat(lineItem.price.toString()) >
      parseFloat(mostExpensive.price.toString())
    ) { mostExpensive = lineItem }
    if (
      parseFloat(lineItem.price.toString()) <
      parseFloat(cheapest.price.toString())
    ) { cheapest = lineItem }
  })
  return { cheapest, mostExpensive }
}

export const getMostSpendOnItem = (
  lineItemsGroupStats: [LineItemGroupStatsPgql]
): LineItemGroupStatsPgql => {
  let mostSpendOn = lineItemsGroupStats[0]
  lineItemsGroupStats.forEach((lineItemGroupStatsObj) => {
    if (
      parseFloat(mostSpendOn.sum.total) <
      parseFloat(lineItemGroupStatsObj.sum.total)
    ) { mostSpendOn = lineItemGroupStatsObj }
  })

  return mostSpendOn
}

export const getMostPurchasedItems = (
  lineItems: LineItemPgql[]
): { title: string, count: number } => {
  const lineItemsCount: Array<{ title: string, count: number }> = []

  lineItems.forEach((lineItem) => {
    if (
      lineItemsCount.filter(
        (lineItemCount) => lineItem.itemTitle === lineItemCount.title
      ).length === 0
    ) { lineItemsCount.push({ title: lineItem.itemTitle, count: 1 }) } else {
      const index = lineItemsCount.findIndex(
        (lineItemCount) => lineItem.itemTitle === lineItemCount.title
      )
      lineItemsCount[index].count += 1
    }
  })

  const sortedLineItemsCount = lineItemsCount.sort((a, b) =>
    a.count < b.count ? 1 : a.count === b.count ? 0 : -1
  )

  /* const mostPurchasedItemsMaxCount: number = sortedLineItemsCount[0].count;
  const mostPurchasedItems = sortedLineItemsCount.filter(
    (lineItem) => lineItem.count === mostPurchasedItemsMaxCount
  ); */

  return sortedLineItemsCount[0]
}

export const spendByMonths = (
  receipts: ReceiptPgql[],
  months: number
): Array<{ total: number, month: string }> => {
  const labels: string[] = getMonthsNames(months)
  const totalByMonth: Array<{ month: string, total: number }> = []
  const sortedMonthPriceData: Array<{ total: number, month: string }> = []

  receipts.forEach((receipt: ReceiptPgql) => {
    const purchaseDate = new Date(receipt.purchaseDate)
    purchaseDate.setDate(purchaseDate.getDate() + 1)

    const monthYearString = `${purchaseDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    })}`
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
    console.log(label)
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

export const boughtItemsByMonths = (
  receipts: ReceiptPgql[],
  months: number
): Array<{ items: number, month: string }> => {
  const labels: string[] = getMonthsNames(months)
  const totalByMonth: Array<{ month: string, items: number }> = []
  const sortedMonthPriceData: Array<{ items: number, month: string }> = []

  receipts.forEach((receipt: ReceiptPgql) => {
    const purchaseDate = new Date(receipt.purchaseDate)
    purchaseDate.setDate(purchaseDate.getDate() + 1)

    const monthYearString = `${purchaseDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    })}`
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
    console.log(label)
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

export const groupedByNumberOfItems = (
  receipts: ReceiptPgql[]
): Array<{ range: string, number: number }> => {
  let lessThanFive = 0
  let fiveToFifteen = 0
  let fifteenToTwentyFive = 0
  let twentyFivePlus = 0
  let fiftyPlus = 0

  receipts.forEach((receipt: ReceiptPgql) => {
    const numberOfItems = receipt.numberOfItems
    console.log(numberOfItems)
    if (numberOfItems < 5) lessThanFive += 1
    else if (numberOfItems >= 5 && numberOfItems < 15) fiveToFifteen += 1
    else if (numberOfItems >= 15 && numberOfItems < 25) { fifteenToTwentyFive += 1 } else if (numberOfItems > 25) twentyFivePlus += 1
    else if (numberOfItems > 50) fiftyPlus += 1
  })

  return [
    { range: 'Less than 5', number: lessThanFive },
    { range: '5-15', number: fiveToFifteen },
    { range: '15-25', number: fifteenToTwentyFive },
    { range: '25+', number: twentyFivePlus },
    { range: '50+', number: fiftyPlus }
  ]
}
