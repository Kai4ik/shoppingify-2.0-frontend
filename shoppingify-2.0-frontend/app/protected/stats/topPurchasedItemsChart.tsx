'use client'

// ----- external modules ----- //
import { ChartOptions, ChartData } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { Context } from 'chartjs-plugin-datalabels'
import { Box } from '@chakra-ui/react'

// ----- internal modules ----- //
import getMostPurchasedItems from '@/utils/stats/mostPurchasedItems'

// types
import { LineItemPgql } from '@/common/types/pgql_types'

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
      title: {
        display: true,
        text: 'Top 5 purchased items'
      }
    }
  }

  const data: ChartData<'pie'> = {
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
    <Box w={['80%', '50%']} h='450px'>
      <Pie data={data} options={options} />
    </Box>
  )
}
