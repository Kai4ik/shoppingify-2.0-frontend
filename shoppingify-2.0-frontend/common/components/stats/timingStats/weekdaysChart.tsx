'use client'

// ----- external modules ----- //
// Chakra UI
import { Box, VStack } from '@chakra-ui/react'

// Chart.js
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartOptions,
  ChartData
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  ChartDataLabels
)

interface Props {
  sortOption: string
  data: Array<{
    weekday: string
    numberoftimescount: string
  }>
}

export default function WeekdaysChart ({
  data,
  sortOption
}: Props): JSX.Element {
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

  const chartData: ChartData<'bar'> = {
    labels: data.map((elem) => elem.weekday),
    datasets: [
      {
        label: 'Weekdays',
        data: data.map((elem) => parseInt(elem.numberoftimescount)),
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
        <Bar data={chartData} options={options} />
      </Box>
    </VStack>
  )
}
