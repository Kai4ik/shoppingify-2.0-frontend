// ----- internal modules ----- //

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

export const getLowestPriceItem = (
  lineItems: LineItemStatsPgql[]
): LineItemStatsPgql => {
  return lineItems.reduce((accum, curr) =>
    curr.price < accum.price ? curr : accum
  )
}

export default getLowestPriceItem
