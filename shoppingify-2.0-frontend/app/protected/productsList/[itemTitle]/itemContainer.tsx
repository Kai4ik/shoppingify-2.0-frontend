'use client'

// ----- external modules ----- //
import {
  VStack,
  Text,
  HStack,
  Stack,
  Box,
  WrapItem,
  Link,
  Tooltip as TooltipCn
} from '@chakra-ui/react'
import { useState } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'

// ----- internal modules ----- //
// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

// components
import StatsContainer from './statsContainer'
import PriceChart from './priceChart'
import Sort from '@/common/components/sort'

interface Props {
  lineItemStats: LineItemStatsPgql[]
}

export default function ItemContainer ({ lineItemStats }: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('6')
  const title = lineItemStats[0].itemTitle

  return (
    <VStack
      w='95%'
      p={['4% 0 4% 5%', '4% 0 4% 10%']}
      spacing={16}
      align='flex-start'
    >
      <VStack w='100%' align='flex-start' spacing={5}>
        <Text fontSize={22} color='main' fontWeight={600}>
          {title}
        </Text>
        <StatsContainer lineItemStats={lineItemStats} />
      </VStack>
      <VStack w='100%' spacing={4}>
        <Text
          fontSize={18}
          color='main'
          fontWeight={600}
          alignSelf='flex-start'
        >
          Receipts
        </Text>
        {lineItemStats.map((lineItem) => (
          <Stack
            direction={['column', 'row']}
            justify='space-between'
            w='100%'
            key={lineItem.id}
            border='2px'
            borderColor='gray.300'
            borderRadius={8}
            p={6}
          >
            <VStack align='flex-start'>
              <HStack>
                <Text fontWeight={600} color='main'>
                  Receipt:
                </Text>
                <Text>
                  {lineItem.receiptByReceiptNumberAndUser.receiptNumber}
                </Text>
              </HStack>
              <HStack>
                <Text fontWeight={600} color='main'>
                  Purchase Date:
                </Text>
                <Text>
                  {lineItem.receiptByReceiptNumberAndUser.purchaseDate}
                </Text>
              </HStack>
            </VStack>
            <HStack spacing={10} align='center'>
              <HStack>
                <Text fontWeight={600} color='main'>
                  % of receipt:
                </Text>
                <Text>
                  {(
                    (lineItem.total /
                      lineItem.receiptByReceiptNumberAndUser.total) *
                    100
                  ).toFixed(2)}
                  %
                </Text>
              </HStack>
              <Box pt={1}>
                <TooltipCn
                  label={`Open ${lineItem.receiptByReceiptNumberAndUser.receiptNumber}`}
                  aria-label={`Open ${lineItem.receiptByReceiptNumberAndUser.receiptNumber}`}
                  placement='top'
                  gutter={18}
                  hasArrow
                  bg='main'
                  color='secondary'
                >
                  <WrapItem>
                    <Link
                      href={`/protected/purchaseHistory/${lineItem.receiptByReceiptNumberAndUser.receiptNumber}`}
                    >
                      <ChevronRightIcon
                        boxSize={6}
                        color='main'
                        _hover={{ boxSize: 8 }}
                      />
                    </Link>
                  </WrapItem>
                </TooltipCn>
              </Box>
            </HStack>
          </Stack>
        ))}
      </VStack>

      <VStack w='100%' align='flex-start'>
        <Stack
          direction={['column', 'row']}
          w='100%'
          justify='space-between'
          align={['flex-start', 'center']}
        >
          <Text fontSize={16} color='main' fontWeight={600}>
            {title} price in last {sortOption} months
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
        <PriceChart sortOption={sortOption} lineItemStats={lineItemStats} />
      </VStack>
    </VStack>
  )
}
