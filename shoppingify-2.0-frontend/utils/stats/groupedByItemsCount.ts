// ----- internal modules ----- //

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

const calcGroupedItemsCount = (
  receipts: ReceiptPgql[]
): Array<{ range: string, number: number }> => {
  let lessThanFive = 0
  let fiveToFifteen = 0
  let fifteenToTwentyFive = 0
  let twentyFivePlus = 0
  let fiftyPlus = 0

  receipts.forEach((receipt: ReceiptPgql) => {
    const numberOfItems = receipt.numberOfItems
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

export default calcGroupedItemsCount
