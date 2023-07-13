'use client'

// ----- external modules ----- //

// Chakra UI
import { VStack, Stack, Text } from '@chakra-ui/react'

// React specific
import { useCallback, useEffect, useState } from 'react'

// ----- internal modules ----- //

// types
import { TimingStatsPgql } from '@/common/types/pgql_types'

// components
import Sort from '@/common/components/sort'
import WeekdaysChart from './weekdaysChart'
import PurchaseTimeChart from './purchaseTimeChart'

// server actions
import { getData } from './action'

interface Props {
  statsData: TimingStatsPgql
  username: string
}

export default function TimingStatsCcp ({
  statsData,
  username
}: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('All')

  const [purchaseTimeGroups, setPurchaseTimeGroups] = useState(
    statsData.countbypurchasetime.nodes
  )

  const [weekdayGroups, setWeekdayGroups] = useState(
    statsData.countbyweekday.nodes
  )

  const fetchUpdatedData = useCallback(async () => {
    const data = await getData(username, sortOption)
    if (data.payload == null) {
      return <p> Error occured </p>
    } else {
      const updatedData: TimingStatsPgql = data.payload
      setWeekdayGroups(updatedData.countbyweekday.nodes)
      setPurchaseTimeGroups(updatedData.countbypurchasetime.nodes)
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
            Timing Insights
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
      </VStack>
      <Stack w='100%' align='center' direction={['column', 'row']}>
        <WeekdaysChart data={weekdayGroups} sortOption={sortOption} />
        <PurchaseTimeChart data={purchaseTimeGroups} />
      </Stack>
    </Stack>
  )
}
