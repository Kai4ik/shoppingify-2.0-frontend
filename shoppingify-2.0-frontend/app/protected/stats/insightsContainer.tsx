'use client'

// ----- external modules ----- //
import { VStack } from '@chakra-ui/react'

// ----- internal modules ----- //
// components
import GeneralInsights from './generalInsights'
import LineItemsInsights from './lineItemsInsights'
import SpendByMonthChart from './spendByMonths'
import BoughtItemsByMonthChart from './boughtItemsByMonths'
import NumberOfItemsRangeChart from './numberOfItemsRange'

// types
import {
  ReceiptPgql,
  LineItemPgql,
  StatsPgql,
  LineItemGroupStatsPgql
} from '@/common/types/pgql_types'

interface Props {
  lineItems: LineItemPgql[]
  receipts: ReceiptPgql[]
  statsData: StatsPgql
  lineItemsStatsData: [LineItemGroupStatsPgql]
}

export default function InsightsContainer ({
  lineItems,
  receipts,
  statsData,
  lineItemsStatsData
}: Props): JSX.Element {
  return (
    <VStack w='95%' p='4% 0 4% 10%' spacing={10} align='flex-start'>
      <GeneralInsights statsData={statsData} receiptsData={receipts} />
      <LineItemsInsights
        statsData={statsData}
        lineItems={lineItems}
        lineItemsStatsData={lineItemsStatsData}
      />
      <SpendByMonthChart receipts={receipts} />
      <BoughtItemsByMonthChart receipts={receipts} />

      <NumberOfItemsRangeChart receipts={receipts} />
    </VStack>
  )
}
