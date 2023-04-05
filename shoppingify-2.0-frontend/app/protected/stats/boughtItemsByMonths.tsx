'use client'

// ----- external modules ----- //
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useState } from 'react'
import { VStack, Text, HStack } from '@chakra-ui/react'

// ----- internal modules ----- //
import { boughtItemsByMonths } from '@/utils/itemStats'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

// components
import Sort from '@/common/components/sort'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  receipts: ReceiptPgql[]
}

export default function BoughtItemsByMonthChart ({
  receipts
}: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('6')
  const chartData = boughtItemsByMonths(receipts, parseInt(sortOption))
  const options: ChartOptions<'bar'> = {
    responsive: true,
    normalized: true,
    layout: {
      padding: 30
    }
  }

  const data = {
    labels: chartData.map((elem) => elem.month),
    datasets: [
      {
        label: `Items Bought in last ${sortOption} months`,
        data: chartData.map((elem) => elem.items),
        borderColor: '#F9A109',
        backgroundColor: '#80485B'
      }
    ]
  }

  return (
    <VStack w='100%' align='flex-start'>
      <HStack w='100%' justify='space-between' align='center'>
        <Text fontSize={22} color='main' fontWeight={600}>
          Items Bought in last {sortOption} months
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
      </HStack>
      <Bar data={data} options={options} />
    </VStack>
  )
}
