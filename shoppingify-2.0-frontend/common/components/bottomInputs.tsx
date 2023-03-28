'use client'

// ----- external modules ----- //
import { FormControl, FormLabel, HStack } from '@chakra-ui/react'
import {
  UseFormGetValues,
  UseFormSetValue,
  FieldValues,
  Control
} from 'react-hook-form'

// ----- internal modules ----- //
// components
import NumberInputCp from './numberInput'

interface Props {
  subtotal: number
  tax: number
  total: number
  control: Control<FieldValues, number>
  getValues: UseFormGetValues<FieldValues>
  setValue: UseFormSetValue<FieldValues>
}

export default function ReceiptBottomInputs (props: Props): JSX.Element {
  const { subtotal, tax, total, control, getValues, setValue } = props
  const bottomInputs = [
    {
      label: 'Subtotal:',
      defaultValue: subtotal,
      name: 'subtotal'
    },
    {
      label: 'Tax:',
      defaultValue: tax,
      name: 'tax'
    },
    {
      label: 'Total:',
      defaultValue: total,
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
