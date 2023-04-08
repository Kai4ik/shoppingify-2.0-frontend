'use client'

// ----- external modules ----- //
import { ChartOptions, ChartData } from 'chart.js'
import { Box } from '@chakra-ui/react'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'
import { Pie } from 'react-chartjs-2'

// ----- internal modules ----- //
import calcGroupedPurchaseTimeCount from '@/utils/stats/groupedByPurchaseTime'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

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

  const data: ChartData<'pie'> = {
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
      <Pie data={data} options={options} plugins={[ChartDataLabels]} />
    </Box>
  )
}
