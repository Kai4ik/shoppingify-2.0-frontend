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
import calcGroupedPurchaseTimeCount from '@/utils/stats/groupedByPurchaseTime'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  receipts: ReceiptPgql[]
}

export default function PurchaseTimeChart ({ receipts }: Props): JSX.Element {
  const chartData = calcGroupedPurchaseTimeCount(receipts)
  const options: ChartOptions<'pie'> = {
    responsive: true,
    normalized: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Number of items'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `You made groceries at this time ${context.formattedValue} time(s)`
          }
        }
      }
    }
  }

  const data = {
    labels: chartData.map((elem) => elem.time),
    datasets: [
      {
        label: 'Purchase time',
        data: chartData.map((elem) => elem.number),
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
    <Box w='25%' h='350px'>
      <Pie data={data} options={options} />
    </Box>
  )
}
