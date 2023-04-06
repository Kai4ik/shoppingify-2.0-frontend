'use client'

// ----- external modules ----- //
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Box } from '@chakra-ui/react'

import { Pie } from 'react-chartjs-2'

// ----- internal modules ----- //
import getMostPurchasedItems from '@/utils/stats/mostPurchasedItems'

// types
import { LineItemPgql } from '@/common/types/pgql_types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  lineItems: LineItemPgql[]
}

export default function TopItemsChart ({ lineItems }: Props): JSX.Element {
  const chartData = getMostPurchasedItems(lineItems, 5)
  const options: ChartOptions<'pie'> = {
    responsive: true,
    normalized: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Top 5 purchased items'
      }
    }
  }

  const data = {
    labels: chartData.map((elem) => elem.title),
    datasets: [
      {
        label: 'Number of Times you bought this product',
        data: chartData.map((elem) => elem.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ]
      }
    ]
  }

  return (
    <Box w='50%' h='450px'>
      <Pie data={data} options={options} />
    </Box>
  )
}
