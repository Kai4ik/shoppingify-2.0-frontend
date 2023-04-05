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
import { spendByMonths } from '@/utils/itemStats'

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

export default function SpendByMonthsChart ({ receipts }: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('6')
  const chartData = spendByMonths(receipts, parseInt(sortOption))
  const options: ChartOptions<'bar'> = {
    responsive: true,
    normalized: true,
    layout: {
      padding: 30
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return `$${value}`
          }
        }
      }
    }
  }

  const data = {
    labels: chartData.map((elem) => elem.month),
    datasets: [
      {
        label: `Expenditures in last ${sortOption} months`,
        data: chartData.map((elem) => elem.total),
        borderColor: '#F9A109',
        backgroundColor: '#80485B'
      }
    ]
  }

  return (
    <VStack w='100%' align='flex-start'>
      <HStack w='100%' justify='space-between' align='center'>
        <Text fontSize={22} color='main' fontWeight={600}>
          Expenditures in last {sortOption} months
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
