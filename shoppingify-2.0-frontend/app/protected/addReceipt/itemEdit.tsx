'use client'

// ----- external modules ----- //
import {
  Input,
  FormControl,
  Td,
  Tr,
  IconButton,
  Select
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

// ----- internal modules ----- //
import { deleteItem } from '@/utils/receipts_crud'

// components
import NumberInputCp from '@/common/components/numberInput'

// types
import { LineItemScan, ReceiptScanResponse } from '@/common/types/api_types'

interface Index {
  data: ReceiptScanResponse
  control: Control<FieldValues, any>
  getValues: UseFormGetValues<FieldValues>
  register: UseFormRegister<FieldValues>
  unregister: UseFormUnregister<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  setData: Dispatch<SetStateAction<ReceiptScanResponse | undefined>>
}

export default function ItemEdit (props: LineItemScan & Index): JSX.Element {
  const {
    itemTitle,
    id,
    price,
    total,
    qty,
    unit,
    payAttention,
    data,
    register,
    unregister,
    setData,
    setValue,
    getValues,
    control
  } = props

  const [qtyStep, setQtyStep] = useState(unit === 'kg' ? 0.001 : 1)
  const [qtyMin, setQtyMin] = useState(unit === 'kg' ? 0.0 : 1)
  const setFn = (): void => {
    setData(
      produce(data, (draftState) => {
        draftState.data.lineItems = draftState.data.lineItems.filter(
          (item) => item.id !== id
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
          onClick={() => deleteItem(getValues, setValue, id, setFn, unregister)}
        />
      </Td>
      <Td px={2}>
        <FormControl>
          <Input
            type='text'
            variant='outline'
            placeholder='Item name'
            size='md'
            borderColor={payAttention !== undefined ? 'red.400' : 'inherit'}
            focusBorderColor='secondary'
            defaultValue={itemTitle}
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
            {...register(id.concat('_', 'unit'), { required: true })}
            onChange={(e) => {
              setQtyStep(e.target.value === 'kg' ? 0.001 : 1)
              setQtyMin(e.target.value === 'kg' ? 0.0 : 1)
              setValue(
                id.concat('_', 'qty'),
                e.target.value === 'kg' ? 0.0 : 1
              )
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
