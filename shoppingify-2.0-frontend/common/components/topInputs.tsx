'use client'

// ----- external modules ----- //
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { UseFormRegister, FieldValues } from 'react-hook-form'

interface Props {
  receiptNumber: string
  purchaseDate: string
  purchaseTime: string
  register: UseFormRegister<FieldValues>
}

export default function ReceiptTopInputs (props: Props): JSX.Element {
  const { receiptNumber, purchaseDate, purchaseTime, register } = props
  const topInputs = [
    {
      label: 'Receipt (slip) Number',
      type: 'number',
      placeholder: 'Receipt Number',
      defaultValue: receiptNumber,
      name: 'receiptNumber',
      valueAsNumber: true,
      isInvalid: false
    },
    {
      label: 'Purchase Date',
      type: 'date',
      placeholder: 'Purchase Date',
      defaultValue: purchaseDate,
      name: 'purchaseDate',
      valueAsNumber: false,
      isInvalid: new Date().toISOString().split('T')[0] === purchaseDate
    },
    {
      label: 'Purchase Time',
      type: 'time',
      placeholder: 'Purchase Time',
      defaultValue: purchaseTime,
      name: 'purchaseTime',
      valueAsNumber: false,
      isInvalid: new Date().toISOString().split('T')[0] === purchaseDate
    }
  ]

  return (
    <>
      {topInputs.map((input, index) => (
        <InputGroup key={index}>
          <InputLeftAddon>{input.label}</InputLeftAddon>
          <Input
            type={input.type}
            placeholder={input.placeholder}
            defaultValue={input.defaultValue}
            isInvalid={input.isInvalid}
            {...register(input.name, {
              required: true,
              valueAsNumber: input.valueAsNumber
            })}
          />
        </InputGroup>
      ))}
    </>
  )
}
