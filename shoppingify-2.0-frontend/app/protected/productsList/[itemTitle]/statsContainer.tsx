'use client'

// ----- external modules ----- //
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup
} from '@chakra-ui/react'

// ----- internal modules ----- //
import calcItemTotalFluctuation from '@/utils/stats/itemTotalFluctuation'
import calcLastQtyFluctuation from '@/utils/stats/itemQtyFluctuation'
import getHighestPriceItem from '@/utils/stats/highestPriceItem'
import getLowestPriceItem from '@/utils/stats/lowestPriceItem'

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

interface Props {
  lineItemStats: LineItemStatsPgql[]
}

export default function StatsContainer ({ lineItemStats }: Props): JSX.Element {
  const totalSpendOnThisProduct = lineItemStats
    .reduce((accum, curr) => accum + parseFloat(curr.total.toString()), 0)
    .toFixed(2)
  const averagePrice = (
    lineItemStats.reduce(
      (accum, curr) => accum + parseFloat(curr.price.toString()),
      0
    ) / lineItemStats.length
  ).toFixed(2)
  const itemTotalFluctuation = calcItemTotalFluctuation(lineItemStats)
  const qtyFluctuation = calcLastQtyFluctuation(lineItemStats)
  const lowestPriceObj = getLowestPriceItem(lineItemStats)
  const highestPriceObj = getHighestPriceItem(lineItemStats)

  return (
    <StatGroup
      backgroundColor='blackAlpha.50'
      p='20px 25px'
      borderRadius={8}
      color='main'
      w='100%'
    >
      <Stat>
        <StatLabel fontSize={15}>Average price</StatLabel>
        <StatNumber color='secondary'>${averagePrice}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel fontSize={15}>Lowest price</StatLabel>
        <StatNumber color='secondary'>${lowestPriceObj.price}</StatNumber>
        <StatHelpText>
          was bought on{' '}
          {lowestPriceObj.receiptByReceiptNumberAndUser.purchaseDate}
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel fontSize={15}>Highest price</StatLabel>
        <StatNumber color='secondary'>${highestPriceObj.price}</StatNumber>
        <StatHelpText>
          was bought on{' '}
          {highestPriceObj.receiptByReceiptNumberAndUser.purchaseDate}
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel fontSize={15}>Total spent</StatLabel>
        <StatNumber color='secondary'>${totalSpendOnThisProduct}</StatNumber>
        <StatHelpText>
          <StatArrow
            type={itemTotalFluctuation >= 0 ? 'increase' : 'decrease'}
          />
          {itemTotalFluctuation}% in last 3 months
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel fontSize={15}>Times Purchased</StatLabel>
        <StatNumber color='secondary'>{lineItemStats.length}</StatNumber>
        <StatHelpText>
          <StatArrow type={qtyFluctuation >= 0 ? 'increase' : 'decrease'} />
          {qtyFluctuation}% in last 3 months
        </StatHelpText>
      </Stat>
    </StatGroup>
  )
}
