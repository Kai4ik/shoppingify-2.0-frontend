'use client'

// external modules
import axios from 'axios'
import {
  Stack,
  VStack,
  Text,
  Image,
  Input,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

// internal modules
import UploadReceipt from './uploadReceipt'
import LoadingCp from '@/app/loadingCp'
import TopInputs from './topInputs'
import BottomInputs from './bottomInputs'
import ItemEdit from './itemEdit'
import SubmitBtns from './submitBtns'
import SubmissionAlert from './submissionAlert'
import { loggedIn } from '@/utils/auth'
import { ReceiptScanResponse } from '@/common/types'

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
    if (userLoggedIn.signedIn) {
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

  return (
    <Stack
      w={['100%', '95%']}
      p={['5% ', '3% 5%']}
      justify='space-between'
      align='center'
      overflow={['scroll', 'hidden']}
      h='100%'
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
                    <Input
                      maxW='50%'
                      type='text'
                      variant='flushed'
                      placeholder='Merchant'
                      size='lg'
                      fontWeight='600'
                      fontSize='2rem'
                      textAlign='center'
                      color='main'
                      focusBorderColor='secondary'
                      defaultValue={data.data.merchant}
                      {...register('merchant')}
                    />
                    <Text alignSelf='flex-start'>
                      * all prices in {data.data.currency}
                    </Text>
                    <Text alignSelf='flex-start'>
                      * pay attention to items in
                      <span style={{ color: 'red' }}> red! </span> We found them
                      suspicious
                    </Text>
                    <TopInputs register={register} data={data} />
                    <TableContainer w='auto'>
                      <Table
                        variant='unstyled'
                        layout={['fixed', 'auto']}
                        w={['200%', '100%']}
                        overflowX='scroll'
                      >
                        <Thead>
                          <Tr color='main'>
                            <Th px={0} w={['8%', 'auto']} />
                            <Th px={2} w={['40%', '30%']}>
                              <Text fontSize='xl'>Title</Text>
                            </Th>
                            <Th px={2} w={['20%', 'auto']}>
                              <Text fontSize='xl'>Price</Text>
                            </Th>
                            <Th px={2} w={['20%', 'auto']}>
                              <Text fontSize='xl'>Qty</Text>
                            </Th>
                            <Th px={2} w={['20%', 'auto']}>
                              <Text fontSize='xl'>Unit</Text>
                            </Th>
                            <Th px={2} w={['20%', 'auto']}>
                              <Text fontSize='xl'>Total</Text>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
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
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <BottomInputs
                      data={data}
                      control={control}
                      getValues={getValues}
                      setValue={setValue}
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
