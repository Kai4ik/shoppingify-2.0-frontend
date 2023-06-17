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

  const offset = new Date().getTimezoneOffset()
  const todayDate = new Date(new Date().getTime() - offset * 60 * 1000)

  let formattedDate = purchaseDate
  if (purchaseDate.split('/')[0].length < 3) {
    formattedDate = '20' + formattedDate
  }

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
      defaultValue: new Date(formattedDate).toISOString().slice(0, 10),
      name: 'purchaseDate',
      valueAsNumber: false,
      isInvalid: todayDate.toISOString().split('T')[0] === purchaseDate
    },
    {
      label: 'Purchase Time',
      type: 'time',
      placeholder: 'Purchase Time',
      defaultValue: purchaseTime,
      name: 'purchaseTime',
      valueAsNumber: false,
      isInvalid: todayDate.toISOString().split('T')[0] === purchaseDate
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
