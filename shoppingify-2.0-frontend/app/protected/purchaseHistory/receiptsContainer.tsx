'use client'

// ----- external modules ----- //
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  Text,
  Select,
  Stack,
  InputGroup,
  InputLeftAddon,
  Input
} from '@chakra-ui/react'
import { useState } from 'react'

// ----- internal modules ----- //
// components
import Receipt from './receipt'
import NoDataCp from '@/common/components/noData'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

interface Props {
  receipts: ReceiptPgql[]
}

const getNewestReceipt = (receipts: ReceiptPgql[]): string => {
  if (receipts.length > 0) {
    let newestReceipt = receipts[0].purchaseDate
    receipts.forEach((receipt) => {
      if (receipt.purchaseDate > newestReceipt) {
        newestReceipt = receipt.purchaseDate
      }
    })
    return newestReceipt
  }
  return ''
}

const getOldestReceipt = (receipts: ReceiptPgql[]): string => {
  if (receipts.length > 0) {
    let oldestReceipt = receipts[0].purchaseDate
    receipts.forEach((receipt) => {
      if (receipt.purchaseDate < oldestReceipt) {
        oldestReceipt = receipt.purchaseDate
      }
    })
    return oldestReceipt
  }
  return ''
}

export default function ReceiptsContainer ({ receipts }: Props): JSX.Element {
  const [sortOption, setSortOption] = useState('newest')
  const [initialReceipts, setInitialReceipts] = useState(receipts)

  const receiptsByMonth: Array<{ month: string, receipts: [ReceiptPgql] }> = []

  const [fromDate, setFromDate] = useState(getOldestReceipt(initialReceipts))
  const [toDate, setToDate] = useState(getNewestReceipt(initialReceipts))

  const filteredReceipts = initialReceipts.filter((receipt) => {
    return receipt.purchaseDate >= fromDate && receipt.purchaseDate <= toDate
  })

  filteredReceipts.forEach((receipt: ReceiptPgql) => {
    const purchaseDate = new Date(receipt.purchaseDate)
    purchaseDate.setDate(purchaseDate.getDate() + 1)

    const monthYearString = `${purchaseDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    })}`
    const index = receiptsByMonth.findIndex(
      (elem) => elem.month === monthYearString
    )
    if (index === -1) {
      receiptsByMonth.push({ month: monthYearString, receipts: [receipt] })
    } else {
      receiptsByMonth[index].receipts.push(receipt)
    }
  })

  return (
    <VStack w='95%' p={['4% 0 4% 5%', '4% 0 4% 10%']} align='center'>
      {receipts.length > 0
        ? (
          <>
            <Accordion w='100%' allowMultiple mb={10}>
              <AccordionItem borderTop='none' borderColor='gray.300'>
                <AccordionButton pl={2}>
                  <Stack
                    direction='row'
                    align='center'
                    justify='space-between'
                    w='100%'
                  >
                    <Text fontSize={20} fontWeight={600} color='main'>
                      Purchase History
                    </Text>
                    <AccordionIcon />
                  </Stack>
                </AccordionButton>

                <AccordionPanel pl={2}>
                  <Stack
                    align='flex-start'
                    direction={['column', 'row']}
                    w='100%'
                    spacing={4}
                  >
                    <Select
                      w={['100%', '20%']}
                      variant='filled'
                      size='sm'
                      color='main'
                      _hover={{
                        borderColor: 'gray.200'
                      }}
                      _focus={{
                        borderColor: 'gray.200'
                      }}
                      onChange={(e) => setSortOption(e.target.value)}
                      value={sortOption}
                    >
                      <option value='oldest'>Oldest to Newest</option>
                      <option value='newest'>Newest to Oldest</option>
                      <option value='cheap'>Price - Low to High</option>
                      <option value='expensive'>Price - High to Low</option>
                    </Select>
                    <InputGroup
                      colorScheme='purple'
                      size='sm'
                      w={['100%', '20%']}
                      ml='2%'
                    >
                      <InputLeftAddon>From</InputLeftAddon>
                      <Input
                        type='date'
                        placeholder='From date'
                        defaultValue={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </InputGroup>
                    <InputGroup
                      colorScheme='purple'
                      size='sm'
                      w={['100%', '20%']}
                      ml='2%'
                    >
                      <InputLeftAddon>To</InputLeftAddon>
                      <Input
                        type='date'
                        placeholder='To date'
                        defaultValue={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </InputGroup>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion w='100%' allowMultiple>
              {receiptsByMonth.map((receipts) => (
                <Receipt
                  key={receipts.month}
                  receipts={receipts}
                  globalSortOption={sortOption}
                  initialReceipts={initialReceipts}
                  setInitialReceipts={setInitialReceipts}
                />
              ))}
            </Accordion>
          </>
          )
        : (
          <NoDataCp
            heading='Purchase History'
            subheading='No Purchases yet'
            link='Add new receipt?'
          />
          )}
    </VStack>
  )
}
