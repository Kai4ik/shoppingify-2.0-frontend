// ----- internal modules ----- //

// types
import { LineItemPgql } from '@/common/types/pgql_types'

const getMostPurchasedItems = (
  lineItems: LineItemPgql[],
  count: number
): Array<{ title: string, count: number }> => {
  const lineItemsCount: Array<{ title: string, count: number }> = []

  lineItems.forEach((lineItem) => {
    const filteredArray = lineItemsCount.filter(
      (lineItemCount) => lineItem.itemTitle === lineItemCount.title
    )

    if (filteredArray.length === 0) {
      lineItemsCount.push({ title: lineItem.itemTitle, count: 1 })
    } else {
      const index = lineItemsCount.findIndex(
        (lineItemCount) => lineItem.itemTitle === lineItemCount.title
      )
      lineItemsCount[index].count += 1
    }
  })

  const sortedLineItemsCount = lineItemsCount.sort((a, b) =>
    a.count < b.count ? 1 : a.count === b.count ? 0 : -1
  )

  return sortedLineItemsCount.slice(0, count)
}

export default getMostPurchasedItems
