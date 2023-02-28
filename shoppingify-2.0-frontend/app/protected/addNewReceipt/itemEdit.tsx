'use client'

// external modules
import { Input, FormControl, Td, Tr, IconButton } from '@chakra-ui/react'
import {
  UseFormRegister,
  UseFormUnregister,
  UseFormSetValue,
  UseFormGetValues,
  FieldValues,
  Control
} from 'react-hook-form'
import { DeleteIcon } from '@chakra-ui/icons'
import { Dispatch, SetStateAction } from 'react'

// internal modules
import NumberInputCp from './numberInput'
import { LineItem, ReceiptScanResponse } from '@/common/types'

interface Index {
  data: ReceiptScanResponse
  control: Control<FieldValues, any>
  getValues: UseFormGetValues<FieldValues>
  register: UseFormRegister<FieldValues>
  unregister: UseFormUnregister<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  setData: Dispatch<SetStateAction<ReceiptScanResponse | undefined>>
}

export default function ItemEdit (props: LineItem & Index): JSX.Element {
  const {
    productTitle,
    id,
    price,
    total,
    qty,
    unit,
    payAttention,
    register,
    unregister,
    setData,
    setValue,
    getValues,
    control
  } = props

  const deleteItem = (): void => {
    const subtotal = getValues('subtotal')
    const total = getValues('total')
    const productTotal = getValues(id.concat('_', 'total'))
    const newSubtotal = parseFloat(Number(subtotal - productTotal).toFixed(2))
    const newTotal = parseFloat(Number(total - productTotal).toFixed(2))
    setValue('subtotal', newSubtotal)
    setValue('total', newTotal)

    unregister(id);
    ['price', 'total', 'unit', 'qty'].forEach((name) => {
      unregister(id.concat('_', name))
    })

    setData((prevData) => {
      if (prevData !== undefined) {
        prevData.data.line_items = prevData?.data.line_items.filter(
          (item) => item.id !== id
        )
        return {
          ...prevData
        }
      }
    })
  }

  return (
    <Tr>
      <Td px={0}>
        <IconButton
          aria-label='Delete Item'
          icon={<DeleteIcon />}
          onClick={deleteItem}
        />
      </Td>
      <Td w='30%' px={2}>
        <FormControl>
          <Input
            type='text'
            variant='outline'
            placeholder='Item name'
            size='md'
            borderColor={payAttention !== undefined ? 'red.400' : 'inherit'}
            focusBorderColor='secondary'
            defaultValue={productTitle}
            {...register(id, { required: true })}
          />
        </FormControl>
      </Td>
      <Td px={2}>
        <FormControl>
          <NumberInputCp
            default={price}
            name={id.concat('_', 'price')}
            payAttention={payAttention}
            setValue={setValue}
            control={control}
            getValues={getValues}
          />
        </FormControl>
      </Td>
      <Td px={2}>
        <FormControl>
          <NumberInputCp
            default={qty}
            payAttention={payAttention}
            name={id.concat('_', 'qty')}
            precision={3}
            step={unit === 'kg' ? 0.001 : 1}
            min={unit === 'kg' ? 0.0 : 1}
            control={control}
            setValue={setValue}
            getValues={getValues}
          />
        </FormControl>
      </Td>
      <Td px={2} w='12%'>
        <FormControl>
          <Input
            type='text'
            variant='outline'
            placeholder='unit'
            size='md'
            focusBorderColor='secondary'
            defaultValue={unit}
            borderColor={payAttention !== undefined ? 'red.400' : 'inherit'}
            {...register(id.concat('_', 'unit'), { required: true })}
          />
        </FormControl>
      </Td>
      <Td px={2}>
        <FormControl>
          <NumberInputCp
            default={total}
            name={id.concat('_', 'total')}
            payAttention={payAttention}
            setValue={setValue}
            control={control}
            getValues={getValues}
          />
        </FormControl>
      </Td>
    </Tr>
  )
}
