'use client'

// ----- external modules ----- //
import { ChartOptions, ChartData } from 'chart.js'
import { Context } from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'
import { Box, VStack } from '@chakra-ui/react'

// ----- internal modules ----- //
import calcWeekdaysCount from '@/utils/stats/weekdaysCount'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

// components

interface Props {
  receipts: ReceiptPgql[]
  sortOption: string
}

export default function WeekdaysChart ({
  receipts,
  sortOption
}: Props): JSX.Element {
  const chartData = calcWeekdaysCount(receipts, parseInt(sortOption))

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
        backgroundColor: '#80485B',
        datalabels: {
          display: function (context: Context) {
            const value = context?.dataset?.data[context.dataIndex]
            return value !== null ? value > 0 : false
          },
          color: '#F9A109',
          font: function (context: Context) {
            const width = context?.chart.width
            const size =
              width > 600
                ? sortOption === '3'
                  ? 18
                  : sortOption === '6'
                    ? 15
                    : 10
                : sortOption === '3'
                  ? 12
                  : sortOption === '6'
                    ? 8
                    : 5
            return { size }
          },
          rotation: -45,
          formatter: function (value: number) {
            return `${value} time(s)`
          }
        }
      }
    ]
  }

  return (
    <VStack w='100%' align='flex-start' overflowX={['scroll', 'hidden']}>
      <Box w={['160%', '100%']} h={['350px', '600px']}>
        <Bar data={data} options={options} />
      </Box>
    </VStack>
  )
}
