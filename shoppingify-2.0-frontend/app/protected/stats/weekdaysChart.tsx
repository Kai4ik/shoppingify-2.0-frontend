'use client'

// ----- external modules ----- //
import { ChartOptions, ChartData } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Box } from '@chakra-ui/react'

// ----- internal modules ----- //
import calcWeekdaysCount from '@/utils/stats/weekdaysCount'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

interface Props {
  receipts: ReceiptPgql[]
}

export default function WeekdaysChart ({ receipts }: Props): JSX.Element {
  const chartData = calcWeekdaysCount(receipts)
  const options: ChartOptions<'bar'> = {
    responsive: true,
    normalized: true,
    maintainAspectRatio: false,
    layout: {
      padding: 30
    },
    plugins: {
      title: {
        display: true,
        text: 'Number of purchases by weekdays'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `You made ${context.formattedValue} purchase(s) on ${context.label}`
          }
        }
      }
    }
  }

  const data: ChartData<'bar'> = {
    labels: chartData.map((elem) => elem.weekday),
    datasets: [
      {
        label: 'Weekdays',
        data: chartData.map((elem) => elem.number),
        borderColor: '#F9A109',
        backgroundColor: '#80485B'
      }
    ]
  }

  return (
    <Box w={['100%', '70%']} h={['350px', '600px']}>
      <Bar data={data} options={options} />
    </Box>
  )
}
