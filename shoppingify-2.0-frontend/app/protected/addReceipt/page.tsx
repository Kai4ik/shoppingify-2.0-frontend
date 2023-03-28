'use client'

// ----- external modules ----- //
import axios from 'axios'
import {
  Stack,
  VStack,
  Text,
  Image,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import * as crypto from 'crypto'
import produce from 'immer'

// ----- internal modules ----- //
import { loggedIn } from '@/utils/auth'

// components
import UploadReceipt from './uploadReceipt'
import LoadingCp from '@/app/loadingCp'
import ItemEdit from './itemEdit'
import SubmitBtns from './submitBtns'
import SubmissionAlert from './submissionAlert'
import MerchantTitle from '@/common/components/receiptTitle'
import ReceiptTopInputs from '@/common/components/topInputs'
import ReceiptBottomInputs from '@/common/components/bottomInputs'
import ItemsTable from '@/common/components/itemsTable'

// types
import { ReceiptScanResponse } from '@/common/types/api_types'

export default function AddReceipt (): JSX.Element {
  // TODO: add functionality for adding new item
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
    const body = new FormData()
    setValue('currency', data?.data.currency)
    setValue('merchant_address', data?.data.merchant_address)
    setValue('payment_type', data?.data.payment_type)
    setValue('initial_line_items', data?.data.line_items)
    body.append('file', file as File, file?.name)
    body.append('data', JSON.stringify(getValues()))
    const userLoggedIn = await loggedIn()
    if (userLoggedIn.signedIn && userLoggedIn.jwt !== undefined) {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/saveReceipt',
        data: body,
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userLoggedIn.jwt}`
        }
      })
      const result = response.data
      setSubmissionInProgress(false)
      result.success === false && setSubmissionMessages(result.error_messages)
      onOpen()
      if (result.success === true) {
        setData(undefined)
        setFile(undefined)
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
        draftState?.data.line_items.push({
          id: hash,
          unit: 'ea',
          price: 0,
          total: 0,
          qty: 1,
          productTitle: 'Item Name'
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
                      receiptNumber={data.data.receipt_number}
                      purchaseDate={data.data.purchase_date.split(' ')[0]}
                      purchaseTime={data.data.purchase_date.split(' ')[1]}
                    />
                    <ItemsTable>
                      {data.data.line_items.map((product) => (
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
