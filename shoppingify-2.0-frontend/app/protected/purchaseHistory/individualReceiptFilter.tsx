// ----- external modules ----- //
import {
  Text,
  AccordionPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  VStack,
  HStack,
  Stack,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'

// ----- internal modules ----- //
import { getMinValue, getMaxValue } from '@/utils/filters'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

interface Props {
  receipts: ReceiptPgql[]
  minFilter: number
  maxFilter: number
  setMinFilter: Dispatch<SetStateAction<number>>
  setMaxFilter: Dispatch<SetStateAction<number>>
  setMerchantsFilter: Dispatch<SetStateAction<string[]>>
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

export default function ReceiptFilter ({
  receipts,
  minFilter,
  maxFilter,
  setMaxFilter,
  setMinFilter,
  setMerchantsFilter
}: Props): JSX.Element {
  const merchants = getMerchants(receipts)
  const min = getMinValue(receipts)
  const max = getMaxValue(receipts)

  return (
    <Accordion w='100%' allowMultiple mb={5}>
      <AccordionItem borderTop='none' borderColor='gray.300'>
        <AccordionButton pl={2}>
          <Stack
            direction='row'
            align='center'
            justify='space-between'
            w='100%'
          >
            <Text fontSize={20} fontWeight={600} color='main'>
              Filters
            </Text>
            <AccordionIcon />
          </Stack>
        </AccordionButton>
        <AccordionPanel pl={2} mt={1}>
          <VStack spacing={4} align='flex-start'>
            <Stack w='100%' direction={['column', 'row']} spacing={6}>
              <HStack w={['100%', '30%']} justify='flex-start' spacing={4}>
                <Text color='main' fontWeight={600}>
                  Price:
                </Text>
                <InputGroup size='sm' w='auto'>
                  <InputLeftAddon>Min</InputLeftAddon>

                  <NumberInput value={minFilter} isReadOnly>
                    <NumberInputField />
                  </NumberInput>
                </InputGroup>
                <InputGroup size='sm' w='auto'>
                  <InputLeftAddon>Max</InputLeftAddon>
                  <NumberInput value={maxFilter} isReadOnly>
                    <NumberInputField />
                  </NumberInput>
                </InputGroup>
              </HStack>
              <RangeSlider
                w={['100%', '20%']}
                aria-label={['min', 'max']}
                defaultValue={[minFilter, maxFilter]}
                value={[minFilter, maxFilter]}
                min={min}
                max={max}
                onChange={(e) => {
                  setMinFilter(e[0])
                  setMaxFilter(e[1])
                }}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Stack>
            <HStack w='50%' justify='flex-start' spacing={4}>
              <Text color='main' fontWeight={600}>
                Merchants:
              </Text>
              <CheckboxGroup
                colorScheme='purple'
                defaultValue={merchants}
                onChange={(values: string[]) => setMerchantsFilter(values)}
              >
                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                  {merchants.map((merchant, index) => (
                    <Checkbox key={index} value={merchant}>
                      {merchant}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
