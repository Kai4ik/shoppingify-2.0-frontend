'use client'

// ----- external modules ----- //
import {
  Image,
  Stack,
  WrapItem,
  VStack,
  Button,
  HStack,
  Text,
  Spinner,
  useDisclosure
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { detailedDiff } from 'deep-object-diff'

import produce from 'immer'

// ----- internal modules ----- //
import { hookFormIntoObject } from '@/utils/receipts_crud'

// line items crud fns
import addItemToDB from '@/utils/lineItem_crud/createItem'
import updateItemInDB from '@/utils/lineItem_crud/updateItem'
import deleteItemFromDB from '@/utils/lineItem_crud/deleteItem'
import updateReceiptNumber from '@/utils/receipt_crud/updateReceiptNumber'

// receipt crud fns
import updateReceiptInDB from '@/utils/receipt_crud/updateReceipt'

// types
import { ReceiptPgql, LineItemPgql } from '@/common/types/pgql_types'
import { ExtendedDetailedDiff } from '@/common/types/other_types'

// components
import MerchantTitle from '@/common/components/receiptTitle'
import ReceiptTopInputs from '@/common/components/topInputs'
import ReceiptBottomInputs from '@/common/components/bottomInputs'
import ItemsTable from '@/common/components/itemsTable'
import ItemEdit from './itemEdit'
import DeleteBtn from './deleteBtn'
import ValidateBtn from './validateBtn'
import Alert from '@/common/components/alert'

interface Props {
  imgSrc: string
  receipt: ReceiptPgql
  initialValue: ReceiptPgql
}

export default function Receipt ({
  imgSrc,
  receipt,
  initialValue
}: Props): JSX.Element {
  const { register, unregister, handleSubmit, getValues, setValue, control } =
    useForm()
  const router = useRouter()

  const [updateInProgress, setUpdateInProgress] = useState<boolean>(false)

  const [data, setData] = useState<ReceiptPgql>(receipt)
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = async (): Promise<void> => {
    setUpdateInProgress(true)
    onOpen()
    const updatedReceipt: ReceiptPgql = hookFormIntoObject(getValues, data)
    const difference: ExtendedDetailedDiff = detailedDiff(
      initialValue,
      updatedReceipt
    )

    const initialLineItems = initialValue.lineItemsByReceiptNumberAndUser.nodes
    const updatedLineItems =
      updatedReceipt.lineItemsByReceiptNumberAndUser.nodes
    let finalLineItems: LineItemPgql[] = initialLineItems

    const deletedItems = initialLineItems.filter(function (item) {
      return !updatedLineItems.some(
        (updatedItem) => item.id === updatedItem.id
      )
    })

    const newItems = updatedLineItems.filter(function (item) {
      return !initialLineItems.some(
        (updatedItem) => item.id === updatedItem.id
      )
    })

    if (deletedItems.length > 0) {
      await deleteItemFromDB(deletedItems)
      finalLineItems = finalLineItems.filter((item) => {
        return !deletedItems.some((deletedItem) => item.id === deletedItem.id)
      })
    }

    if (difference.updated.lineItemsByReceiptNumberAndUser != null) {
      const updatedItemsIndexes: string[] = Object.keys(
        difference.updated.lineItemsByReceiptNumberAndUser.nodes
      )

      const updatedItems =
        difference.updated.lineItemsByReceiptNumberAndUser.nodes
      updatedItemsIndexes.forEach((index) => {
        const finalItem = finalLineItems[parseInt(index)]
        const updatedItem = updatedItems[parseInt(index)]
        if (updatedItem.itemTitle !== undefined) {
          finalItem.itemTitle = updatedItem.itemTitle
        }
        if (updatedItem.price !== undefined) {
          finalItem.price = updatedItem.price
        }
        if (updatedItem.qty !== undefined) finalItem.qty = updatedItem.qty
        if (updatedItem.unit !== undefined) finalItem.unit = updatedItem.unit
        if (updatedItem.total !== undefined) {
          finalItem.total = updatedItem.total
        }
      })

      await updateItemInDB(
        difference.updated.lineItemsByReceiptNumberAndUser.nodes,
        updatedReceipt
      )
    }

    if (Object.keys(difference.updated).length > 0) {
      await updateReceiptInDB(
        parseInt(initialValue.receiptNumber),
        difference.updated
      )
    }

    if (difference.updated.receiptNumber !== undefined) {
      await updateReceiptNumber(
        parseInt(initialValue.receiptNumber),
        parseInt(updatedReceipt.receiptNumber),
        finalLineItems
      )
    }

    if (newItems.length > 0) {
      await addItemToDB(newItems, parseInt(updatedReceipt.receiptNumber))
    }

    if (difference.updated.receiptNumber !== undefined) {
      router.push(`/protected/purchaseHistory/${updatedReceipt.receiptNumber}`)
    }

    setUpdateInProgress(false)
  }

  const addItem = (): void => {
    const lineItemsLenght = data.lineItemsByReceiptNumberAndUser.nodes.length
    const lastItemID =
      data.lineItemsByReceiptNumberAndUser.nodes[lineItemsLenght - 1].id
    const newItemId =
      Math.floor(Math.random() * (100000 - lastItemID + 1)) + lastItemID

    setData(
      produce(data, (draftState) => {
        draftState?.lineItemsByReceiptNumberAndUser.nodes.push({
          id: newItemId,
          unit: 'ea',
          price: 0,
          total: 0,
          qty: 1,
          itemTitle: 'Item Name'
        })
      })
    )
  }

  return (
    <Stack
      w='100%'
      p={['5% ', '3% 2% 3% 6%']}
      justify='space-evenly'
      align='center'
      overflow={['scroll', 'hidden']}
      maxHeight={['auto', '100vh']}
      direction={['column', 'row']}
      spacing={[8, 0]}
    >
      <WrapItem
        overflowY='scroll'
        alignItems='flex-start'
        justifyContent='center'
        borderRadius={12}
        css={{
          '&::-webkit-scrollbar': {
            width: '0px'
          }
        }}
      >
        <Image alt='Receipt Image' src={imgSrc} borderRadius={12} />
      </WrapItem>
      <VStack
        w={['100%', '55%']}
        padding='1%'
        h='100%'
        overflowY='scroll'
        spacing={5}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb ': {
            backgroundColor: 'rgba(155,155,155,0.6)',
            borderRadius: '20px',
            border: 'transparent'
          }
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <VStack spacing={15}>
            <MerchantTitle
              register={register}
              merchant={receipt.merchant}
              currency={receipt.currency}
            />
            <ReceiptTopInputs
              register={register}
              receiptNumber={receipt.receiptNumber}
              purchaseDate={receipt.purchaseDate}
              purchaseTime={receipt.purchaseTime}
            />
            <ItemsTable>
              {data.lineItemsByReceiptNumberAndUser.nodes.map((product) => (
                <ItemEdit
                  key={product.id}
                  {...product}
                  data={data}
                  register={register}
                  unregister={unregister}
                  setData={setData}
                  setValue={setValue}
                  control={control}
                  getValues={getValues}
                />
              ))}
            </ItemsTable>
            <Button
              type='button'
              colorScheme='green'
              size='lg'
              w='100%'
              onClick={() => addItem()}
            >
              Add item
            </Button>
            <ReceiptBottomInputs
              subtotal={parseFloat(receipt.subtotal)}
              tax={parseFloat(receipt.tax)}
              total={parseFloat(receipt.total)}
              setValue={setValue}
              control={control}
              getValues={getValues}
            />
            <HStack w='100%'>
              <Button
                type='button'
                colorScheme='purple'
                size='lg'
                w='100%'
                onClick={() => router.push('/protected/purchaseHistory')}
              >
                Cancel
              </Button>
              <DeleteBtn receipt={receipt} />
            </HStack>
            <ValidateBtn
              data={data}
              getValues={getValues}
              setValue={setValue}
              setReadyToSubmit={setReadyToSubmit}
            />
            <Button
              loadingText='Submitting'
              type='submit'
              colorScheme='green'
              size='lg'
              w='100%'
              isDisabled={!readyToSubmit}
            >
              Save changes
            </Button>
          </VStack>
        </form>
        <Alert isOpen={isOpen} onClose={onClose}>
          {updateInProgress
            ? (
              <>
                <Text fontSize='lg'>Update in progress</Text>
                <Spinner />
              </>
              )
            : (
              <>
                <Text fontSize='lg'>Receipt was updated! </Text>
                <CheckCircleIcon boxSize={8} color='green.500' />
              </>
              )}
        </Alert>
      </VStack>
    </Stack>
  )
}
