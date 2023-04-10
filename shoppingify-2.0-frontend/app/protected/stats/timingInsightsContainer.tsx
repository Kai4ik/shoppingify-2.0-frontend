'use client'

// ----- external modules ----- //
import { VStack, Text, Stack } from '@chakra-ui/react'
import { useState } from 'react'

// ----- internal modules ----- //

// components
import PurchaseTimeChart from './purchaseTimeChart'
import WeekdaysChart from './weekdaysChart'
import Sort from '@/common/components/sort'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

interface Props {
  receipts: ReceiptPgql[]
}

export default function TimingInsightsContainer ({
  receipts
}: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('6')

  return (
    <VStack w='100%' align='flex-start' spacing={[9, 4]}>
      <Stack
        direction={['column', 'row']}
        w='100%'
        justify='space-between'
        align={['flex-start', 'center']}
      >
        <Text fontSize={22} color='main' fontWeight={600}>
          Timing Insights
        </Text>
        <Sort
          sortOption={sortOption}
          setSortOption={setSortOption}
          options={[
            { value: '3', label: 'Last 3 months' },
            { value: '6', label: 'Last 6 months' },
            { value: '12', label: 'Last year' }
          ]}
        />
      </Stack>
      <Stack
        w='100%'
        justify='space-between'
        align='center'
        direction={['column', 'row']}
      >
        <PurchaseTimeChart receipts={receipts} sortOption={sortOption} />
        <WeekdaysChart receipts={receipts} sortOption={sortOption} />
      </Stack>
    </VStack>
  )
}
