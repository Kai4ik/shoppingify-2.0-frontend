'use client'

// ----- external modules ----- //
import { VStack, Text, Stack } from '@chakra-ui/react'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'

// ----- internal modules ----- //
// components
import GeneralInsights from './generalInsights'
import LineItemsInsights from './lineItemsInsights'
import MonthlyExpendituresChart from './monthlyExpendituresChart'
import MonthlyItemsCountChart from './monthlyItemCountChart'
import ItemCountGroupsChart from './itemCountGroupsChart'
import TopItemsChart from './topPurchasedItemsChart'
import PurchaseTimeChart from './purchaseTimeChart'
import WeekdaysChart from './weekdaysChart'

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

ChartJS.register(
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend
)

export default function InsightsContainer ({
  lineItems,
  receipts,
  statsData,
  lineItemsStatsData
}: Props): JSX.Element {
  return (
    <VStack
      w='95%'
      p={['4% 0 4% 5%', '4% 0 4% 10%']}
      spacing={10}
      align='flex-start'
    >
      <GeneralInsights statsData={statsData} receiptsData={receipts} />
      <LineItemsInsights
        statsData={statsData}
        lineItems={lineItems}
        lineItemsStatsData={lineItemsStatsData}
      />
      <Stack
        direction={['column', 'row']}
        w='100%'
        m='50px 0 !important'
        align='center'
      >
        <ItemCountGroupsChart receipts={receipts} />
        <TopItemsChart lineItems={lineItems} />
      </Stack>
      <MonthlyExpendituresChart receipts={receipts} />
      <MonthlyItemsCountChart receipts={receipts} />
      <VStack w='100%' align='flex-start'>
        <Text fontSize={22} color='main' fontWeight={600}>
          Timing Insights
        </Text>
        <Stack
          w='100%'
          justify='space-between'
          align='center'
          direction={['column', 'row']}
        >
          <PurchaseTimeChart receipts={receipts} />
          <WeekdaysChart receipts={receipts} />
        </Stack>
      </VStack>
    </VStack>
  )
}
