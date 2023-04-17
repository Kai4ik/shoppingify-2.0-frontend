'use client'

// ----- external modules ----- //
import {
  Stat,
  VStack,
  StatLabel,
  StatNumber,
  Text,
  HStack
} from '@chakra-ui/react'
import NextLink from 'next/link'

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

// components
import StatGroupCp from '@/common/components/statGroup'

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
      <StatGroupCp>
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
      </StatGroupCp>

      <StatGroupCp>
        <Stat>
          <StatLabel fontSize={15}>The cheapest item</StatLabel>
          <NextLink href={`/protected/productsList/${cheapestItem.itemTitle}`}>
            <StatNumber
              fontSize={18}
              color='secondary'
              display='inline'
              _hover={{ borderBottomWidth: '1px', borderColor: 'secondary' }}
            >
              {cheapestItem.itemTitle} - ${cheapestItem.price}
            </StatNumber>
          </NextLink>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>The most expensive item</StatLabel>
          <NextLink
            href={`/protected/productsList/${mostExpensiveItem.itemTitle}`}
          >
            <StatNumber
              fontSize={18}
              color='secondary'
              display='inline'
              _hover={{ borderBottomWidth: '1px', borderColor: 'secondary' }}
            >
              {mostExpensiveItem.itemTitle} - ${mostExpensiveItem.price}
            </StatNumber>
          </NextLink>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>You spend most on </StatLabel>
          <NextLink href={`/protected/productsList/${mostSpendOnItem.keys[0]}`}>
            <StatNumber
              fontSize={18}
              color='secondary'
              display='inline'
              _hover={{ borderBottomWidth: '1px', borderColor: 'secondary' }}
            >
              {mostSpendOnItem.keys[0]} - ${mostSpendOnItem.sum.total}
            </StatNumber>
          </NextLink>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>The most purchased item(s) </StatLabel>
          <NextLink href={`/protected/productsList/${mostPurchasedItem.title}`}>
            <StatNumber
              fontSize={18}
              color='secondary'
              display='inline'
              _hover={{ borderBottomWidth: '1px', borderColor: 'secondary' }}
            >
              {mostPurchasedItem.title} - {mostPurchasedItem.count} times
            </StatNumber>
          </NextLink>
        </Stat>
      </StatGroupCp>
    </VStack>
  )
}
