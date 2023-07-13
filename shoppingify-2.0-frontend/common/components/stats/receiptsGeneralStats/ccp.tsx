'use client'

// ----- external modules ----- //
import {
  Stat,
  VStack,
  Stack,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Text
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import NextLink from 'next/link'

// ----- internal modules ----- //

// types
import { ReceiptsGeneralStatsPgql } from '@/common/types/pgql_types'

// components
import Sort from '@/common/components/sort'
import StatGroupCp from '@/common/components/statGroup'

// server actions
import { getData } from './action'

interface Props {
  statsData: ReceiptsGeneralStatsPgql
  username: string
}

export default function GeneralReceiptsStatsCcp ({
  statsData,
  username
}: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('All')

  const [totalSpend, setTotalSpend] = useState(
    statsData.allReceipts.aggregates.sum.total
  )

  const [totalTaxes, setTotalTaxes] = useState(
    statsData.allReceipts.aggregates.sum.tax
  )

  const [distinctMerchants, setDistinctMerchants] = useState(
    statsData.allReceipts.aggregates.distinctCount.merchant
  )

  const [totalPurchases, setTotalPurchases] = useState(
    statsData.allReceipts.aggregates.distinctCount.receiptNumber
  )

  // most expensive purchase
  const [mostExpensivePurchase, setMostExpensivePurchase] = useState(
    statsData.getmaxtotalreceipt.nodes[0]
  )

  // cheapest purchase
  const [cheapestPurchase, setCheapestPurchase] = useState(
    statsData.getmintotalreceipt.nodes[0]
  )

  // earliest purchase
  const [earliestPurchase, setEarliestPurchase] = useState(
    statsData.allReceipts.nodes[0]
  )

  // average spend
  const [averageSpenditure, setAverageSpenditure] = useState(
    statsData.allReceipts.aggregates.average.total
  )

  const [averageNumberOfItems, setAverageNumberOfItems] = useState(
    statsData.allReceipts.aggregates.average.numberOfItems
  )

  const [leastNumberOfItems, setLeastNumberOfItems] = useState(
    statsData.getminnumberofitems.nodes[0]
  )

  const [mostNumberOfItems, setMostNumberOfItems] = useState(
    statsData.getmaxnumberofitems.nodes[0]
  )

  const fetchUpdatedData = useCallback(async () => {
    const data = await getData(username, sortOption)
    if (data.payload == null) {
      return <p> Error occured </p>
    } else {
      const updatedData: ReceiptsGeneralStatsPgql = data.payload
      setTotalSpend(updatedData.allReceipts.aggregates.sum.total)
      setTotalPurchases(
        updatedData.allReceipts.aggregates.distinctCount.receiptNumber
      )
      setEarliestPurchase(updatedData.allReceipts.nodes[0])
      setAverageSpenditure(updatedData.allReceipts.aggregates.average.total)
      setMostExpensivePurchase(updatedData.getmaxtotalreceipt.nodes[0])
      setCheapestPurchase(updatedData.getmintotalreceipt.nodes[0])
      setTotalTaxes(updatedData.allReceipts.aggregates.sum.tax)
      setDistinctMerchants(
        updatedData.allReceipts.aggregates.distinctCount.merchant
      )
      setAverageNumberOfItems(
        updatedData.allReceipts.aggregates.average.numberOfItems
      )
      setLeastNumberOfItems(updatedData.getminnumberofitems.nodes[0])
      setMostNumberOfItems(updatedData.getmaxnumberofitems.nodes[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption])

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
            General Insights
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

        <StatGroup
          backgroundColor='blackAlpha.50'
          p='20px 25px'
          borderRadius={8}
          color='main'
          w='100%'
        >
          <Stack direction={['column', 'row']} w='100%' align='flex-start'>
            <Stat>
              <StatLabel fontSize={15}>Total Spend</StatLabel>
              <StatNumber color='secondary'>${totalSpend}</StatNumber>

              <NextLink
                href={`/protected/purchaseHistory/${earliestPurchase.receiptNumber}`}
              >
                <StatHelpText
                  display='inline'
                  _hover={{ borderBottomWidth: '1px', borderColor: 'main' }}
                >
                  earliest was captured on {earliestPurchase.purchaseDate}
                </StatHelpText>
              </NextLink>
            </Stat>
            <Stat>
              <StatLabel fontSize={15}>Total Purchases</StatLabel>
              <StatNumber color='secondary'>{totalPurchases}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel fontSize={15}>Most expensive purchase</StatLabel>
              <StatNumber color='secondary'>
                ${mostExpensivePurchase.total}
              </StatNumber>
              <NextLink
                href={`/protected/purchaseHistory/${mostExpensivePurchase.receiptnumber}`}
              >
                <StatHelpText
                  display='inline'
                  _hover={{ borderBottomWidth: '1px', borderColor: 'main' }}
                >
                  was made on {mostExpensivePurchase.purchasedate}
                </StatHelpText>
              </NextLink>
            </Stat>

            <Stat>
              <StatLabel fontSize={15}>Cheapest purchase</StatLabel>
              <StatNumber color='secondary'>
                ${cheapestPurchase.total}
              </StatNumber>
              <NextLink
                href={`/protected/purchaseHistory/${cheapestPurchase.receiptnumber}`}
              >
                <StatHelpText
                  display='inline'
                  _hover={{ borderBottomWidth: '1px', borderColor: 'main' }}
                >
                  was made on {cheapestPurchase.purchasedate}
                </StatHelpText>
              </NextLink>
            </Stat>

            <Stat>
              <StatLabel fontSize={15}>In average you spend</StatLabel>
              <StatNumber color='secondary'>
                ${parseFloat(averageSpenditure).toFixed(2)}
              </StatNumber>
            </Stat>
          </Stack>
        </StatGroup>
        <StatGroupCp>
          <Stat>
            <StatLabel fontSize={15}>Total Taxes</StatLabel>
            <StatNumber color='secondary'>${totalTaxes}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize={15}> Merchants</StatLabel>
            <StatNumber color='secondary'>{distinctMerchants}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize={15}>Most number of purchased items</StatLabel>
            <StatNumber color='secondary'>
              {mostNumberOfItems.numberofitems}
            </StatNumber>

            <NextLink
              href={`/protected/purchaseHistory/${mostNumberOfItems.receiptnumber}`}
            >
              <StatHelpText
                display='inline'
                _hover={{ borderBottomWidth: '1px', borderColor: 'main' }}
              >
                most recent was captured on <br />
                {mostNumberOfItems.purchasedate}
              </StatHelpText>
            </NextLink>
          </Stat>
          <Stat>
            <StatLabel fontSize={15}>Least number of purchased items</StatLabel>
            <StatNumber color='secondary'>
              {leastNumberOfItems.numberofitems}
            </StatNumber>

            <NextLink
              href={`/protected/purchaseHistory/${leastNumberOfItems.receiptnumber}`}
            >
              <StatHelpText
                display='inline'
                _hover={{ borderBottomWidth: '1px', borderColor: 'main' }}
              >
                most recent was captured on <br />
                {leastNumberOfItems.purchasedate}
              </StatHelpText>
            </NextLink>
          </Stat>
          <Stat>
            <StatLabel fontSize={15}> In average you buy</StatLabel>
            <StatNumber color='secondary'>
              {parseFloat(averageNumberOfItems).toFixed(2)}
            </StatNumber>
          </Stat>
        </StatGroupCp>
      </VStack>
    </Stack>
  )
}
