'use client'

// ----- external modules ----- //
// Chart.js specific
import { ChartOptions, ChartData } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import { Context } from 'chartjs-plugin-datalabels'

// React specific
import { useState } from 'react'

// Chakra UI
import { VStack, Text, Stack, Box } from '@chakra-ui/react'

// components
import Sort from '@/common/components/sort'

interface Props {
  data: Array<{
    monthname: string
    monthlytotal: string
  }>
}

export default function MonthlyExpendituresChart ({ data }: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('6')

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

  const chartData: ChartData<'bar'> = {
    labels: data
      .reverse()
      .slice(0, parseInt(sortOption))
      .reverse()
      .map(
        (elem) =>
          `${elem.monthname.split(' ')[0]} ${
            elem.monthname.split(' ')[elem.monthname.split(' ').length - 1]
          }`
      ),
    datasets: [
      {
        label: `Expenditures in last ${sortOption} months`,
        data: data
          .reverse()
          .slice(0, parseInt(sortOption))
          .reverse()
          .map((elem) => parseFloat(elem.monthlytotal)),
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
            return `$${value.toFixed(2)}`
          }
        }
      }
    ]
  }

  return (
    <Stack p={['0 0 0 5%', '0 0 0 10%']} w='95%'>
      <VStack w='100%' align='flex-start' overflowX={['scroll', 'hidden']}>
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
              { value: '12', label: 'Last 12 months' }
            ]}
          />
        </Stack>
        <Box w={['160%', '100%']} h={['350px', '600px']}>
          <Bar data={chartData} options={options} />
        </Box>
      </VStack>
    </Stack>
  )
}
