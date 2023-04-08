'use client'

// ----- external modules ----- //
import { ChartOptions, ChartData } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'

import { useState } from 'react'
import { VStack, Text, Stack, Box } from '@chakra-ui/react'

// ----- internal modules ----- //
import calcExpendituresByMonths from '@/utils/stats/monthlyExpenditures'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

// components
import Sort from '@/common/components/sort'

interface Props {
  receipts: ReceiptPgql[]
}

export default function MonthlyExpendituresChart ({
  receipts
}: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('6')
  const chartData = calcExpendituresByMonths(receipts, parseInt(sortOption))
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
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `You spend $${context.formattedValue}`
          }
        }
      }
    }
  }

  const data: ChartData<'bar'> = {
    labels: chartData.map((elem) => elem.month),
    datasets: [
      {
        label: `Expenditures in last ${sortOption} months`,
        data: chartData.map((elem) => elem.total),
        borderColor: '#F9A109',
        backgroundColor: '#80485B',
        datalabels: {
          display: function (context: Context) {
            const value = context?.dataset?.data[context.dataIndex]
            return value !== null ? value > 0 : false
          },
          color: '#F9A109',
          formatter: function (value: number) {
            return `$${value.toFixed(2)}`
          }
        }
      }
    ]
  }

  return (
    <VStack w='100%' align='flex-start'>
      <Stack
        direction={['column', 'row']}
        w='100%'
        justify='space-between'
        align={['flex-start', 'center']}
      >
        <Text fontSize={22} color='main' fontWeight={600}>
          Expenditures in last {sortOption} months
        </Text>
        <Sort
          sortOption={sortOption}
          setSortOption={setSortOption}
          options={[
            { value: '3', label: 'Last 3 months' },
            { value: '6', label: 'Last 6 months' },
            { value: '12', label: 'Last year' }
          ]}
        />
      </Stack>
      <Box w='100%' h={['350px', '600px']}>
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </Box>
    </VStack>
  )
}
