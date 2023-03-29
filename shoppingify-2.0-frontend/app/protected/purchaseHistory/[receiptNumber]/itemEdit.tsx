'use client'

// external modules
import {
  Select,
  Input,
  FormControl,
  Td,
  Tr,
  IconButton
} from '@chakra-ui/react'
import {
  UseFormRegister,
  UseFormUnregister,
  UseFormSetValue,
  UseFormGetValues,
  FieldValues,
  Control
} from 'react-hook-form'
import { DeleteIcon } from '@chakra-ui/icons'
import { Dispatch, SetStateAction, useState } from 'react'
import produce from 'immer'

// internal modules
import NumberInputCp from '@/common/components/numberInput'
import { ReceiptPgql, LineItemPgql } from '@/common/types/pgql_types'
import { deleteItem } from '@/utils/receipts_crud'

interface Index {
  control: Control<FieldValues, any>
  data: ReceiptPgql
  getValues: UseFormGetValues<FieldValues>
  register: UseFormRegister<FieldValues>
  unregister: UseFormUnregister<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  setData: Dispatch<SetStateAction<ReceiptPgql>>
}

export default function ItemEdit (props: LineItemPgql & Index): JSX.Element {
  const {
    id,
    itemTitle,
    price,
    total,
    qty,
    unit,
    register,
    unregister,
    setData,
    setValue,
    data,
    getValues,
    control
  } = props

  const [qtyStep, setQtyStep] = useState(unit === 'kg' ? 0.001 : 1)
  const [qtyMin, setQtyMin] = useState(unit === 'kg' ? 0.0 : 1)
  const setFn = (): void => {
    setData(
      produce(data, (draftState: ReceiptPgql) => {
        draftState.lineItemsByReceiptNumberAndUser.nodes =
          draftState.lineItemsByReceiptNumberAndUser.nodes.filter(
            (item: { id: number }) => item.id !== id
          )
      })
    )
  }

  return (
    <Tr>
      <Td px={0}>
        <IconButton
          aria-label='Delete Item'
          icon={<DeleteIcon />}
          onClick={() =>
            deleteItem(getValues, setValue, id.toString(), setFn, unregister)}
        />
      </Td>
      <Td px={2}>
        <FormControl>
          <Input
            type='text'
            variant='outline'
            placeholder='Item name'
            size='md'
            focusBorderColor='secondary'
            defaultValue={itemTitle}
            {...register(id.toString(), { required: true })}
          />
        </FormControl>
      </Td>
      <Td px={2}>
        <FormControl>
          <NumberInputCp
            default={price}
            name={id.toString().concat('_', 'price')}
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
            name={id.toString().concat('_', 'qty')}
            precision={3}
            step={qtyStep}
            min={qtyMin}
            control={control}
            setValue={setValue}
            getValues={getValues}
          />
        </FormControl>
      </Td>
      <Td px={2} w='12%'>
        <FormControl>
          <Select
            variant='filled'
            size='md'
            color='main'
            _hover={{
              borderColor: 'gray.200'
            }}
            _focus={{
              borderColor: 'gray.200'
            }}
            {...register(id.toString().concat('_', 'unit'), { required: true })}
            onChange={(e) => {
              setQtyStep(e.target.value === 'kg' ? 0.001 : 1)
              setQtyMin(e.target.value === 'kg' ? 0.001 : 1)
              setValue(
                id.toString().concat('_', 'qty'),
                e.target.value === 'kg' ? 0.001 : 1
              )
              const price = getValues(id.toString().concat('_', 'price'))
              const qty = getValues(id.toString().concat('_', 'qty'))
              const newTotal = qty * price
              setValue(id.toString().concat('_', 'total'), newTotal)
            }}
          >
            <option value='ea' selected={unit === 'ea'}>
              ea
            </option>
            <option value='kg' selected={unit === 'kg'}>
              kg
            </option>
          </Select>
        </FormControl>
      </Td>
      <Td px={2}>
        <FormControl>
          <NumberInputCp
            default={total}
            name={id.toString().concat('_', 'total')}
            setValue={setValue}
            control={control}
            getValues={getValues}
          />
        </FormControl>
      </Td>
    </Tr>
  )
}
