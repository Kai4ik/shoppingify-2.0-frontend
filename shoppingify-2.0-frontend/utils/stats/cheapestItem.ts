// ----- internal modules ----- //

// types
import { LineItemPgql } from '@/common/types/pgql_types'

const getCheapestItem = (lineItems: LineItemPgql[]): LineItemPgql => {
  let cheapest: LineItemPgql = lineItems[0]
  lineItems.forEach((lineItem) => {
    const itemPrice = parseFloat(lineItem.price.toString())
    const cheapestItemPrice = parseFloat(cheapest.price.toString())
    if (itemPrice < cheapestItemPrice) cheapest = lineItem
  })
  return cheapest
}

export default getCheapestItem
