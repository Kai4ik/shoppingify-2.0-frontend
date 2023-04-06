'use client'

// ----- external modules ----- //
import {
  Stat,
  VStack,
  StatLabel,
  StatNumber,
  StatGroup,
  Text,
  HStack,
  Link
} from '@chakra-ui/react'

// ----- internal modules ----- //

import getCheapestItem from '@/utils/stats/cheapestItem'
import getMostExpensiveItem from '@/utils/stats/mostExpensiveItem'
import getMostSpendOnItem from '@/utils/stats/mostSpendOnItem'
import getMostPurchasedItems from '@/utils/stats/mostPurchasedItems'

// types
import {
  StatsPgql,
  LineItemPgql,
  LineItemGroupStatsPgql
} from '@/common/types/pgql_types'

interface Props {
  statsData: StatsPgql
  lineItems: LineItemPgql[]
  lineItemsStatsData: [LineItemGroupStatsPgql]
}

export default function LineItemsInsights ({
  statsData,
  lineItems,
  lineItemsStatsData
}: Props): JSX.Element {
  const leastNumber = statsData.min.numberOfItems
  const mostNumber = statsData.max.numberOfItems
  const average = parseFloat(statsData.average.numberOfItems).toFixed(2)

  const mostExpensiveItem = getMostExpensiveItem(lineItems)
  const cheapestItem = getCheapestItem(lineItems)
  const mostSpendOnItem = getMostSpendOnItem(lineItemsStatsData)
  const mostPurchasedItem = getMostPurchasedItems(lineItems, 1)[0]

  return (
    <VStack w='100%' spacing={4} align='flex-start'>
      <Text fontSize={22} color='main' fontWeight={600}>
        Products Insights
      </Text>
      <StatGroup
        backgroundColor='blackAlpha.50'
        p='20px 25px'
        borderRadius={8}
        color='main'
        w='100%'
      >
        <Stat>
          <StatLabel fontSize={15}>Least number of items purchased</StatLabel>
          <StatNumber color='#56CCF2'>
            <HStack>
              <Text>{leastNumber} </Text>
              <Text pt={1} fontSize={14}>
                items
              </Text>
            </HStack>
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>Most number of items purchased</StatLabel>

          <StatNumber color='#56CCF2'>
            <HStack>
              <Text>{mostNumber} </Text>
              <Text pt={1} fontSize={14}>
                items
              </Text>
            </HStack>
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>In average you buy </StatLabel>
          <StatNumber color='#56CCF2'>
            <HStack>
              <Text>{average} </Text>
              <Text pt={2} fontSize={14}>
                items
              </Text>
            </HStack>
          </StatNumber>
        </Stat>

        <Stat />
      </StatGroup>

      <StatGroup
        backgroundColor='blackAlpha.50'
        p='20px 25px'
        borderRadius={8}
        color='main'
        w='100%'
      >
        <Stat>
          <StatLabel fontSize={15}>The cheapest item</StatLabel>
          <Link
            href={`/protected/productsList/${cheapestItem.itemTitle}`}
            color='secondary'
          >
            <StatNumber fontSize={18}>
              {cheapestItem.itemTitle} - ${cheapestItem.price}
            </StatNumber>
          </Link>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>The most expensive item</StatLabel>
          <Link
            href={`/protected/productsList/${mostExpensiveItem.itemTitle}`}
            color='secondary'
          >
            <StatNumber fontSize={18}>
              {mostExpensiveItem.itemTitle} - ${mostExpensiveItem.price}
            </StatNumber>
          </Link>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>You spend most on </StatLabel>
          <Link
            href={`/protected/productsList/${mostSpendOnItem.keys[0]}`}
            color='secondary'
          >
            <StatNumber fontSize={18}>
              {mostSpendOnItem.keys[0]} - ${mostSpendOnItem.sum.total}
            </StatNumber>
          </Link>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>The most purchased item(s) </StatLabel>
          <Link
            href={`/protected/productsList/${mostPurchasedItem.title}`}
            color='secondary'
          >
            <StatNumber fontSize={18}>
              {mostPurchasedItem.title} - {mostPurchasedItem.count} times
            </StatNumber>
          </Link>
        </Stat>
      </StatGroup>
    </VStack>
  )
}
