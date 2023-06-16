// ----- internal modules ----- //

// types
import { LineItemPgql } from '@/common/types/pgql_types'

const getMostExpensiveItem = (lineItems: LineItemPgql[]): LineItemPgql => {
  const startTime = performance.now()
  let mostExpensive: LineItemPgql = lineItems[0]

  lineItems.forEach((lineItem) => {
    const itemPrice = parseFloat(lineItem.price.toString())
    const mostExpensiveItemPrice = parseFloat(mostExpensive.price.toString())
    if (itemPrice > mostExpensiveItemPrice) mostExpensive = lineItem
  })
  const endTime = performance.now()
  console.log(`Call  took ${endTime - startTime} milliseconds`)
  return mostExpensive
}

export default getMostExpensiveItem
