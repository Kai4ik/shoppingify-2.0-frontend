'use client'

// ----- external modules ----- //
import {
  Stack,
  VStack,
  Text,
  Tr,
  Td,
  Image,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import * as crypto from 'crypto'
import produce from 'immer'
import dynamic from 'next/dynamic'

// ----- internal modules ----- //
import { loggedIn } from '@/utils/auth'
import addReceiptToDb from '@/utils/receipt_crud/createReceipt'
import addItemToDB from '@/utils/lineItem_crud/createItem'
import { addReceiptImageToS3 } from '@/utils/receipt_s3'
import {
  parseReceiptFromFormData,
  parseLineItemsFromFormData
} from '@/utils/receipts_crud'

// components
import UploadReceipt from './uploadReceipt'
import LoadingCp from '@/app/loadingCp'
import SubmissionAlert from './submissionAlert'
import ImportLoading from './importLoading'

// types
import { ReceiptScanResponse } from '@/common/types/api_types'
import { BaseFetchResponse } from '@/common/types/base_types'

const ItemEdit = dynamic(async () => await import('./itemEdit'), {
  loading: () => (
    <Tr
      fontSize='lg'
      bg='blackAlpha.50'
      p={2}
      mb='2px'
      textAlign='center'
      borderRadius='8px'
      color='main'
    >
      <Td w='100%'>Loading item ...</Td>
    </Tr>
  )
})

const SubmitBtns = dynamic(async () => await import('./submitBtns'), {
  loading: () => <ImportLoading title='Loading buttons ...' />
})

const MerchantTitle = dynamic(
  async () => await import('@/common/components/receiptTitle'),
  {
    loading: () => <ImportLoading title='Loading merchant ...' />
  }
)

const ReceiptTopInputs = dynamic(
  async () => await import('@/common/components/topInputs'),
  {
    loading: () => <ImportLoading title='Loading receipt number ...' />
  }
)

const ReceiptBottomInputs = dynamic(
  async () => await import('@/common/components/bottomInputs'),
  {
    loading: () => <ImportLoading title='Loading receipt total ...' />
  }
)

const ItemsTable = dynamic(
  async () => await import('@/common/components/itemsTable'),
  {
    loading: () => <ImportLoading title='Loading receipt items ...' />
  }
)

export default function AddReceipt (): JSX.Element {
  const {
    register,
    unregister,
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch,
    control
  } = useForm()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [data, setData] = useState<ReceiptScanResponse | undefined>(undefined)
  const [scanError, setScanError] = useState<boolean>(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [submissionInProgress, setSubmissionInProgress] =
    useState<boolean>(false)
  const [submissionMessages, setSubmissionMessages] = useState<string[]>([])

  const onSubmit = async (): Promise<void> => {
    setSubmissionInProgress(true)

    if (data !== undefined && file !== undefined) {
      const userLoggedIn = await loggedIn()
      if (userLoggedIn.signedIn && userLoggedIn.email !== undefined) {
        const username = userLoggedIn.email
        const lineItems = data.data.lineItems
        const parsedReceipt = parseReceiptFromFormData(
          getValues,
          data,
          lineItems.length,
          username
        )

        const createdReceiptNumber: BaseFetchResponse = await addReceiptToDb(
          parsedReceipt
        )

        if (
          createdReceiptNumber.success &&
          createdReceiptNumber.payload !== undefined
        ) {
          const newReceiptNumber = createdReceiptNumber.payload
            .receiptNumber as number

          const createdS3Object = await addReceiptImageToS3(
            newReceiptNumber.toString(),
            file
          )
          if (createdS3Object) {
            const parsedLineItems = parseLineItemsFromFormData(
              getValues,
              lineItems
            )

            const createdLineItemsResult: BaseFetchResponse = await addItemToDB(
              parsedLineItems,
              newReceiptNumber
            )
            if (createdLineItemsResult.success) {
              router.push(`/protected/purchaseHistory/${newReceiptNumber}`)
            }
          }
        }
        setSubmissionInProgress(false)
        onOpen()
      }
    }
  }

  const addItem = (): void => {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(new Date().getTime() / 1000))
      .digest('hex')

    setData(
      produce(data, (draftState) => {
        draftState?.data.lineItems.push({
          id: hash,
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
      <UploadReceipt
        file={file}
        setFile={setFile}
        reset={reset}
        setLoading={setLoading}
        setData={setData}
        setScanError={setScanError}
      />
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
        {loading
          ? (
            <LoadingCp loading={loading} />
            )
          : !loading && data !== undefined
              ? (
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                  <VStack spacing={15}>
                    <MerchantTitle
                      register={register}
                      merchant={data.data.merchant}
                      currency={data.data.currency}
                    />
                    <ReceiptTopInputs
                      register={register}
                      receiptNumber={data.data.receiptNumber}
                      purchaseDate={data.data.purchaseDate.split(' ')[0]}
                      purchaseTime={data.data.purchaseDate.split(' ')[1]}
                    />
                    <ItemsTable>
                      {data.data.lineItems.map((product) => (
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
                      subtotal={data.data.subtotal}
                      tax={data.data.tax}
                      total={data.data.total}
                      setValue={setValue}
                      control={control}
                      getValues={getValues}
                    />
                    <SubmitBtns
                      data={data}
                      watch={watch}
                      getValues={getValues}
                      setValue={setValue}
                      submissionInProgress={submissionInProgress}
                    />
                  </VStack>
                </form>
                )
              : scanError
                ? (
                  <VStack spacing={12}>
                    <VStack>
                      <Text fontSize='2xl'>
                        Oops. Unexpected error occured during scan
                      </Text>
                      <Text fontSize='2xl'> Refresh the page and try again </Text>
                    </VStack>
                    <Image
                      boxSize='200px'
                      objectFit='cover'
                      src='/undraw_error.svg'
                      alt='Error during scan'
                    />
                  </VStack>
                  )
                : (
                  <VStack spacing={8}>
                    <VStack>
                      <Text fontSize='2xl'> No Data </Text>
                      <Text fontSize='2xl'> Upload receipt first </Text>
                    </VStack>
                    <Image
                      boxSize='200px'
                      objectFit='cover'
                      src='/undraw_no_data.svg'
                      alt='No Receipt'
                    />
                  </VStack>
                  )}
        <SubmissionAlert
          isOpen={isOpen}
          onClose={onClose}
          submissionMessages={submissionMessages}
          setSubmissionMessages={setSubmissionMessages}
        />
      </VStack>
    </Stack>
  )
}
