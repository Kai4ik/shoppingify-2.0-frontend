'use client'

// external modules
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper
} from '@chakra-ui/react'
import {
  FieldValues,
  UseFormSetValue,
  UseFormGetValues,
  Controller,
  Control
} from 'react-hook-form'

interface Props {
  step?: number
  precision?: number
  min?: number
  default: string | number
  name: string
  payAttention?: boolean
  getValues: UseFormGetValues<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  control?: Control<FieldValues, number>
}

export default function NumberInputCp (props: Props): JSX.Element {
  const {
    step,
    precision,
    name,
    min,
    payAttention,
    setValue,
    getValues,
    control
  } = props

  const setTotal = (name: string, newTotal: number): void => {
    if (payAttention === undefined) {
      const oldTotal = parseFloat(getValues(name.concat('_', 'total')))
      const totalDifference = newTotal - oldTotal
      const receiptTotal = parseFloat(getValues('total'))
      setValue(
        'total',
        parseFloat(Number(receiptTotal + totalDifference).toFixed(2))
      )
      const tax = parseFloat(getValues('tax'))
      setValue(
        'subtotal',
        parseFloat(Number(receiptTotal + totalDifference - tax).toFixed(2))
      )
    }
  }

  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={props.default}
        rules={{ required: true }}
        render={({ field }) => (
          <NumberInput
            {...field}
            borderColor={payAttention !== undefined ? 'red.400' : 'inherit'}
            precision={precision ?? 2}
            step={step ?? 0.01}
            min={min ?? 0.0}
            onChange={(e) => {
              const name = field.name.split('_')[0]
              if (field.name.includes('price')) {
                const qty = getValues(name.concat('_', 'qty'))
                const newTotal = parseFloat(e) * qty
                setTotal(name, newTotal)
                setValue(
                  name.concat('_', 'total'),
                  parseFloat(Number(newTotal).toFixed(2))
                )
              }
              if (field.name.includes('qty')) {
                const price = getValues(name.concat('_', 'price'))
                const newTotal = parseFloat(e) * price
                setTotal(name, newTotal)
                setValue(
                  name.concat('_', 'total'),
                  parseFloat(Number(newTotal).toFixed(2))
                )
              }
              if (field.name.includes('total') && field.name !== 'total') {
                const qty = getValues(name.concat('_', 'qty'))
                setTotal(name, parseFloat(e))
                setValue(
                  name.concat('_', 'price'),
                  parseFloat(Number(parseFloat(e) / qty).toFixed(2))
                )
              }
              if (field.name === 'subtotal') {
                const tax: number = getValues('tax')
                const total: number = parseFloat(e) + tax
                setValue('total', parseFloat(Number(total).toFixed(2)))
              }
              if (field.name === 'tax') {
                const subtotal: number = getValues('subtotal')
                const total: number = parseFloat(e) + subtotal
                setValue('total', parseFloat(Number(total).toFixed(2)))
              }
              if (field.name === 'total') {
                const tax = getValues('tax')
                const subtotal = parseFloat(e) - tax
                setValue('subtotal', parseFloat(Number(subtotal).toFixed(2)))
              }
              field.onChange(parseFloat(e))
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        )}
      />
    </>
  )
}
