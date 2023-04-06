// ----- internal modules ----- //

// types
import { LineItemGroupStatsPgql } from '@/common/types/pgql_types'

const getMostSpendOnItem = (
  lineItemsGroupStats: [LineItemGroupStatsPgql]
): LineItemGroupStatsPgql => {
  let mostSpendOn = lineItemsGroupStats[0]
  lineItemsGroupStats.forEach((lineItemGroupStatsObj) => {
    const mostSpendOnTotal = parseFloat(mostSpendOn.sum.total)
    const spendOnTotal = parseFloat(lineItemGroupStatsObj.sum.total)
    if (mostSpendOnTotal < spendOnTotal) {
      mostSpendOn = lineItemGroupStatsObj
    }
  })

  return mostSpendOn
}

export default getMostSpendOnItem
