'use client'

// external modules
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { UseFormRegister, FieldValues } from 'react-hook-form'

// internal modules
import { ReceiptScanResponse } from '@/common/types'

interface Props {
  data: ReceiptScanResponse
  register: UseFormRegister<FieldValues>
}

export default function TopInputs (props: Props): JSX.Element {
  const { data, register } = props
  const topInputs = [
    {
      label: 'Receipt Number',
      type: 'text',
      placeholder: 'Receipt Number',
      defaultValue: data.data.receipt_number,
      name: 'receiptNumber'
    },
    {
      label: 'Purchase Date',
      type: 'date',
      placeholder: 'Purchase Date',
      defaultValue: data.data.purchase_date.split(' ')[0],
      name: 'purchaseDate'
    },
    {
      label: 'Purchase Time',
      type: 'time',
      placeholder: 'Purchase Time',
      defaultValue: format(parseISO(data.data.purchase_date), 'HH:mm'),
      name: 'purchaseTime'
    }
  ]

  return (
    <>
      {topInputs.map((input, index) => (
        <InputGroup colorScheme='purple' key={index}>
          <InputLeftAddon>{input.label}</InputLeftAddon>
          <Input
            type={input.type}
            placeholder={input.placeholder}
            defaultValue={input.defaultValue}
            {...register(input.name, {
              required: true
            })}
          />
        </InputGroup>
      ))}
    </>
  )
}
