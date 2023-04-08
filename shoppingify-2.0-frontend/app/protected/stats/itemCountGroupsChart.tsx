'use client'

// ----- external modules ----- //
import { Box } from '@chakra-ui/react'
import { ChartOptions, ChartData } from 'chart.js/auto'
import { Pie } from 'react-chartjs-2'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'

// ----- internal modules ----- //
import calcGroupedItemsCount from '@/utils/stats/groupedByItemsCount'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

interface Props {
  receipts: ReceiptPgql[]
}

export default function ItemCountGroupsChart ({ receipts }: Props): JSX.Element {
  const chartData = calcGroupedItemsCount(receipts)

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
            return `You bought ${context.label} items ${context.formattedValue} time(s)`
          }
        }
      }
    }
  }

  const data: ChartData<'pie'> = {
    labels: chartData.map((elem) => elem.range),
    datasets: [
      {
        label: 'Number of Items Bought',
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
          color: '#80485B'
        }
      }
    ]
  }

  return (
    <Box w={['80%', '50%']} h='450px'>
      <Pie data={data} options={options} plugins={[ChartDataLabels]} />
    </Box>
  )
}
