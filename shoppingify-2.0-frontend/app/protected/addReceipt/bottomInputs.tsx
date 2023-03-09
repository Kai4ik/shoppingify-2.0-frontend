'use client'

// external modules
import { FormControl, FormLabel, HStack } from '@chakra-ui/react'
import {
  UseFormGetValues,
  UseFormSetValue,
  FieldValues,
  Control
} from 'react-hook-form'

// internal modules
import { ReceiptScanResponse } from '@/common/types'
import NumberInputCp from './numberInput'

interface Props {
  data: ReceiptScanResponse
  control?: Control<FieldValues, number>
  getValues: UseFormGetValues<FieldValues>
  setValue: UseFormSetValue<FieldValues>
}

export default function BottomInputs (props: Props): JSX.Element {
  const { data, control, getValues, setValue } = props
  const bottomInputs = [
    {
      label: 'Subtotal:',
      defaultValue: data.data.subtotal,
      name: 'subtotal'
    },
    {
      label: 'Tax:',
      defaultValue: data.data.tax,
      name: 'tax'
    },
    {
      label: 'Total:',
      defaultValue: data.data.total,
      name: 'total'
    }
  ]

  return (
    <>
      {bottomInputs.map((input, index) => (
        <FormControl key={index}>
          <HStack justify='flex-end' spacing={6}>
            <FormLabel m={0} fontSize='lg'>
              {input.label}
            </FormLabel>
            <NumberInputCp
              default={input.defaultValue}
              name={input.name}
              control={control}
              setValue={setValue}
              getValues={getValues}
            />
          </HStack>
        </FormControl>
      ))}
    </>
  )
}
