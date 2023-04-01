'use client'

// ----- external modules ----- //
import {
  Text,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  VStack,
  HStack,
  Stack,
  Box
} from '@chakra-ui/react'
import { useState, useEffect, memo, Dispatch, SetStateAction } from 'react'

// ----- internal modules ----- //
import { getMinValue, getMaxValue } from '@/utils/filters'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

// components
import ReceiptFilter from './individualReceiptFilter'
import ReceiptDetails from './receiptDetails'
import Sort from '@/common/components/sort'

interface Props {
  receipts: { month: string, receipts: ReceiptPgql[] }
  globalSortOption: string
  initialReceipts: ReceiptPgql[]
  setInitialReceipts: Dispatch<SetStateAction<ReceiptPgql[]>>
}

const getMerchants = (receipts: ReceiptPgql[]): string[] => {
  const merchants: string[] = []
  receipts.forEach((receipt) => {
    if (!merchants.includes(receipt.merchant)) {
      merchants.push(receipt.merchant)
    }
  })
  return merchants
}

function Receipt ({
  receipts,
  globalSortOption,
  initialReceipts,
  setInitialReceipts
}: Props): JSX.Element {
  const [sortOption, setSortOption] = useState(globalSortOption)
  const compareFn = (a: ReceiptPgql, b: ReceiptPgql): number => {
    const totalA = parseFloat(a.total)
    const totalB = parseFloat(b.total)
    const dateA = a.purchaseDate
    const dateB = b.purchaseDate
    const timeA = a.purchaseTime
    const timeB = b.purchaseTime
    if (sortOption === 'oldest') {
      return dateA < dateB
        ? -1
        : dateA > dateB
          ? 1
          : timeA < timeB
            ? -1
            : timeA > timeB
              ? 1
              : 0
    } else if (sortOption === 'newest') {
      return dateA < dateB
        ? 1
        : dateA > dateB
          ? -1
          : timeA < timeB
            ? 1
            : timeA > timeB
              ? -1
              : 0
    } else if (sortOption === 'cheap') {
      return totalA < totalB ? -1 : totalA > totalB ? 1 : 0
    } else {
      return totalA < totalB ? 1 : totalA > totalB ? -1 : 0
    }
  }

  const [minFilter, setMinFilter] = useState(getMinValue(receipts.receipts))
  const [maxFilter, setMaxFilter] = useState(getMaxValue(receipts.receipts))
  const [merchantsFilter, setMerchantsFilter] = useState(
    getMerchants(receipts.receipts)
  )

  const filteredReceipts = receipts.receipts.filter((receipt) => {
    const total = Math.floor(parseFloat(receipt.total))
    return (
      total <= maxFilter &&
      total >= minFilter &&
      merchantsFilter.includes(receipt.merchant)
    )
  })

  useEffect(() => {
    setSortOption(globalSortOption)
  }, [globalSortOption])

  return (
    <Box mb='40px'>
      <HStack justify='space-between' mb={2} align='center'>
        <Text
          pl={2}
          fontSize={18}
          color='secondary'
          fontWeight={600}
          alignSelf='flex-end'
        >
          {receipts.month}
        </Text>
        <Sort
          sortOption={sortOption}
          setSortOption={setSortOption}
          options={[
            { value: 'oldest', label: 'Oldest to Newest' },
            { value: 'newest', label: 'Newest to Oldest' },
            { value: 'cheap', label: 'Price - Low to High' },
            { value: 'expensive', label: 'Price - High to Low' }
          ]}
        />
      </HStack>
      <ReceiptFilter
        receipts={receipts.receipts}
        minFilter={minFilter}
        maxFilter={maxFilter}
        setMaxFilter={setMaxFilter}
        setMinFilter={setMinFilter}
        setMerchantsFilter={setMerchantsFilter}
      />
      {filteredReceipts.sort(compareFn).map((receipt) => (
        <AccordionItem
          border='1px'
          borderColor='gray.300'
          borderRadius={8}
          mb='20px'
          key={receipt.receiptNumber}
        >
          <AccordionButton
            alignItems='center'
            justifyContent='space-between'
            flexDirection='row'
          >
            <Stack
              direction={['column', 'row']}
              justify='space-between'
              w='95%'
            >
              <VStack align='flex-start'>
                <HStack>
                  <Text fontWeight={600} color='main'>
                    Receipt:
                  </Text>
                  <Text>{receipt.receiptNumber}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight={600} color='main'>
                    Merchant:
                  </Text>
                  <Text>{receipt.merchant}</Text>
                </HStack>
              </VStack>
              <HStack spacing={20}>
                <HStack>
                  <Text fontWeight={600} color='main'>
                    Total:
                  </Text>
                  <Text>${receipt.total}</Text>
                </HStack>
              </HStack>
            </Stack>

            <AccordionIcon />
          </AccordionButton>
          <ReceiptDetails
            receipt={receipt}
            initialReceipts={initialReceipts}
            setInitialReceipts={setInitialReceipts}
          />
        </AccordionItem>
      ))}
    </Box>
  )
}

export default memo(Receipt)
