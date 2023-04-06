// ----- internal modules ----- //

// types
import { LineItemPgql } from '@/common/types/pgql_types'

const getMostExpensiveItem = (lineItems: LineItemPgql[]): LineItemPgql => {
  let mostExpensive: LineItemPgql = lineItems[0]

  lineItems.forEach((lineItem) => {
    const itemPrice = parseFloat(lineItem.price.toString())
    const mostExpensiveItemPrice = parseFloat(mostExpensive.price.toString())
    if (itemPrice > mostExpensiveItemPrice) mostExpensive = lineItem
  })
  return mostExpensive
}

export default getMostExpensiveItem
