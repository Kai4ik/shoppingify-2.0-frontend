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
import { Box, VStack } from '@chakra-ui/react'
import { Bar } from 'react-chartjs-2'

// ----- internal modules ----- //
import getMonthlyItemPrice from '@/utils/stats/monthlyItemPrice'

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  sortOption: string
  lineItemStats: LineItemStatsPgql[]
}

export default function PriceChart ({
  lineItemStats,
  sortOption
}: Props): JSX.Element {
  const title = lineItemStats[0].itemTitle

  const chartData = getMonthlyItemPrice(lineItemStats, parseInt(sortOption))
  const options: ChartOptions<'bar'> = {
    responsive: true,
    normalized: true,
    maintainAspectRatio: false,
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
        label: `${title} `,
        data: chartData.map((elem) => elem.price),
        borderColor: '#F9A109',
        backgroundColor: '#80485B'
      }
    ]
  }

  return (
    <VStack w='100%' overflowX={['scroll', 'hidden']}>
      <Box w={['160%', '100%']} h={['300px', '600px']}>
        <Bar data={data} options={options} />
      </Box>
    </VStack>
  )
}
