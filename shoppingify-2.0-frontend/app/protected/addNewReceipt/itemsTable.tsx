'use client'

// external modules
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Text
} from '@chakra-ui/react'
import {
  UseFormRegister,
  FieldValues,
  UseFormUnregister,
  Control,
  UseFormSetValue,
  UseFormGetValues
} from 'react-hook-form'
import { Dispatch, SetStateAction } from 'react'

// internal modules
import { ReceiptScanResponse } from '@/common/types'
import ItemEdit from './itemEdit'

interface Props {
  data: ReceiptScanResponse
  control: Control<FieldValues, any>
  getValues: UseFormGetValues<FieldValues>
  register: UseFormRegister<FieldValues>
  unregister: UseFormUnregister<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  setData: Dispatch<SetStateAction<ReceiptScanResponse | undefined>>
}

export default function ItemsTable (props: Props): JSX.Element {
  return (
    <TableContainer>
      <Table variant='unstyled'>
        <Thead>
          <Tr color='main'>
            <Th px={0} />
            <Th px={2}>
              <Text fontSize='xl'>Title</Text>
            </Th>
            <Th px={2}>
              <Text fontSize='xl'>Price</Text>
            </Th>
            <Th px={2}>
              <Text fontSize='xl'>Qty</Text>
            </Th>
            <Th px={2}>
              <Text fontSize='xl'>Unit</Text>
            </Th>
            <Th px={2}>
              <Text fontSize='xl'>Total</Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.data?.data.line_items.map((product) => (
            <ItemEdit
              {...product}
              key={product.id}
              data={props.data}
              register={props.register}
              unregister={props.unregister}
              setData={props.setData}
              setValue={props.setValue}
              control={props.control}
              getValues={props.getValues}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
