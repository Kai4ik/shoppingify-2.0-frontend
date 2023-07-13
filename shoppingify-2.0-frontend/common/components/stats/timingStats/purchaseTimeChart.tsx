'use client'

// ----- external modules ----- //
// Chakra UI
import { Box } from '@chakra-ui/react'

// Chart.js
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { Pie } from 'react-chartjs-2'
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
  data: Array<{
    timeframe: string
    numberoftimescount: string
  }>
}

export default function PurchaseTimeChart ({ data }: Props): JSX.Element {
  const options: ChartOptions<'pie'> = {
    responsive: true,
    normalized: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Purchase Time'
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

  const chartData: ChartData<'pie'> = {
    labels: data.map((elem) => elem.timeframe),
    datasets: [
      {
        label: 'Purchase time',
        data: data.map((elem) => parseInt(elem.numberoftimescount)),
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
        ],
        datalabels: {
          display: function (context: Context) {
            const value = context?.dataset?.data[context.dataIndex]
            return value !== null ? value > 0 : false
          },
          color: '#80485B',
          formatter: function (value: number) {
            return `${value} time(s)`
          }
        }
      }
    ]
  }

  return (
    <Box w={['80%', '25%']} h='450px'>
      <Pie data={chartData} options={options} />
    </Box>
  )
}
