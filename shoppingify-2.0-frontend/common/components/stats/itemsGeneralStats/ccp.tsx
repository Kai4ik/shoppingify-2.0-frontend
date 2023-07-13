'use client'

// ----- external modules ----- //
import {
  Stat,
  VStack,
  Stack,
  StatLabel,
  StatNumber,
  Text
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import NextLink from 'next/link'

// ----- internal modules ----- //

// types
import { LineItemsGeneralStatsPgql } from '@/common/types/pgql_types'

// components
import NumberOfItemsChart from './numberOfItemsChart'
import TopPurchasedItemsChart from './topPurchasedItemsChart'
import Sort from '@/common/components/sort'
import StatGroupCp from '@/common/components/statGroup'

// server actions
import { getData } from './action'

interface Props {
  statsData: LineItemsGeneralStatsPgql
  username: string
}

export default function GeneralReceiptsStatsCcp ({
  statsData,
  username
}: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('All')

  const [cheapestItem, setCheapestItem] = useState(
    statsData.getcheapestitem.nodes[0]
  )

  const [mostExpensiveItem, setMostExpensiveItem] = useState(
    statsData.getmostexpensiveitem.nodes[0]
  )

  const [mostSpendOnItem, setMostSpendOnItem] = useState(
    statsData.getmostspendonitem.nodes[0]
  )

  const [mostPurchasedItem, setMostPurchasedItem] = useState(
    statsData.getmostpurchaseditem.nodes[0]
  )

  const [topPurchasedItems, setTopPurchasedItems] = useState(
    statsData.getmostpurchaseditem.nodes
  )

  const [countByNumberOfItems, setCountByNumberOfItems] = useState(
    statsData.countbynumberofitems.nodes
  )

  const fetchUpdatedData = useCallback(async () => {
    const data = await getData(username, sortOption)
    if (data.payload == null) {
      return <p> Error occured </p>
    } else {
      const updatedData: LineItemsGeneralStatsPgql = data.payload
      setCheapestItem(updatedData.getcheapestitem.nodes[0])
      setMostExpensiveItem(updatedData.getmostexpensiveitem.nodes[0])
      setMostSpendOnItem(updatedData.getmostspendonitem.nodes[0])
      setMostPurchasedItem(updatedData.getmostpurchaseditem.nodes[0])
      setCountByNumberOfItems(updatedData.countbynumberofitems.nodes)
      setTopPurchasedItems(updatedData.getmostpurchaseditem.nodes)
    }
    // eslint-disable-next-line
  }, [sortOption]);

  useEffect(() => {
    fetchUpdatedData()
  }, [fetchUpdatedData])

  return (
    <Stack p={['0 0 0 5%', '0 0 0 10%']} w='95%'>
      <VStack w='100%' spacing={4} align='flex-start'>
        <Stack
          direction={['column', 'row']}
          w='100%'
          justify='space-between'
          align={['flex-start', 'center']}
        >
          <Text fontSize={22} color='main' fontWeight={600}>
            Products Insights
          </Text>
          <Sort
            sortOption={sortOption}
            setSortOption={setSortOption}
            options={[
              { value: 'All', label: 'All Time' },
              { value: '3', label: 'Last 3 months' },
              { value: '6', label: 'Last 6 months' },
              { value: '12', label: 'Last 12 months' }
            ]}
          />
        </Stack>

        <StatGroupCp>
          <Stat>
            <StatLabel fontSize={15}>The cheapest item</StatLabel>
            <NextLink
              href={`/protected/productsList/${cheapestItem.itemtitle}`}
            >
              <StatNumber
                color='secondary'
                display='inline'
                _hover={{ borderBottomWidth: '1px', borderColor: 'secondary' }}
              >
                {cheapestItem.itemtitle} - $
                {parseFloat(cheapestItem.price).toFixed(2)}
              </StatNumber>
            </NextLink>
          </Stat>
          <Stat>
            <StatLabel fontSize={15}>The most expensive item</StatLabel>
            <NextLink
              href={`/protected/productsList/${mostExpensiveItem.itemtitle}`}
            >
              <StatNumber
                color='secondary'
                display='inline'
                _hover={{ borderBottomWidth: '1px', borderColor: 'secondary' }}
              >
                {mostExpensiveItem.itemtitle} - $
                {parseFloat(mostExpensiveItem.price).toFixed(2)}
              </StatNumber>
            </NextLink>
          </Stat>
          <Stat>
            <StatLabel fontSize={15}>You spend most on</StatLabel>
            <NextLink
              href={`/protected/productsList/${mostSpendOnItem.itemtitle}`}
            >
              <StatNumber
                color='secondary'
                display='inline'
                _hover={{ borderBottomWidth: '1px', borderColor: 'secondary' }}
              >
                {mostSpendOnItem.itemtitle} - $
                {parseFloat(mostSpendOnItem.totalsum).toFixed(2)}
              </StatNumber>
            </NextLink>
          </Stat>
          <Stat>
            <StatLabel fontSize={15}>The most purchased item</StatLabel>
            <NextLink
              href={`/protected/productsList/${mostPurchasedItem.itemtitle}`}
            >
              <StatNumber
                color='secondary'
                display='inline'
                _hover={{ borderBottomWidth: '1px', borderColor: 'secondary' }}
              >
                {mostPurchasedItem.itemtitle} - {mostPurchasedItem.totalcount}{' '}
                times
              </StatNumber>
            </NextLink>
          </Stat>
        </StatGroupCp>
      </VStack>
      <Stack
        w='100%'
        direction={['column', 'row']}
        align='center'
        m='50px 0 !important'
      >
        <NumberOfItemsChart data={countByNumberOfItems} />
        <TopPurchasedItemsChart data={topPurchasedItems} />
      </Stack>
    </Stack>
  )
}
