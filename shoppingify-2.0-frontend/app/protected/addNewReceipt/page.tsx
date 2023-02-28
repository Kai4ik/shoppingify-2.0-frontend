'use client'

// external modules
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import { useState, useEffect, useRef, RefObject, Fragment } from 'react'
import { useForm } from 'react-hook-form'
import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  Flex,
  VStack,
  Image,
  Button,
  Text,
  HStack,
  FormLabel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { CubeSpinner } from 'react-spinners-kit'
import Parser from 'html-react-parser'

// internal modules
import ItemsTable from './itemsTable'
import NumberInputCp from './numberInput'
import UploadReceipt from './uploadReceipt'
import { ReceiptScanResponse } from '@/common/types'

export default function AddNewReceipt (): JSX.Element {
  // TODO: add functionality for adding new item
  // TODO: code refactor
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    unregister,
    setValue,
    control,
    watch
  } = useForm()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef() as RefObject<FocusableElement>

  const [validationMessage, setValidationMessage] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false)
  const [receipt, setReceipt] = useState('no-image')
  const [file, setFile] = useState<File>()
  const [data, setData] = useState<ReceiptScanResponse>()

  const topInputs = [
    {
      label: 'Receipt Number',
      type: 'text',
      placeholder: 'Receipt Number',
      defaultValue: data?.data.receipt_number,
      name: 'receiptNumber'
    },
    {
      label: 'Purchase Date',
      type: 'date',
      placeholder: 'Purchase Date',
      defaultValue: data?.data.purchase_date.split(' ')[0],
      name: 'purchaseDate'
    },
    {
      label: 'Purchase Time',
      type: 'time',
      placeholder: 'Purchase Time',
      defaultValue: format(
        parseISO(
          data != null ? data.data.purchase_date : new Date().toISOString()
        ),
        'HH:mm'
      ),
      name: 'purchaseTime'
    }
  ]

  const bottomInputs = [
    {
      label: 'Subtotal:',
      defaultValue: data != null ? data.data.subtotal : 0,
      name: 'subtotal'
    },
    {
      label: 'Tax:',
      defaultValue: data != null ? data.data.tax : 0,
      name: 'tax'
    },
    {
      label: 'Total:',
      defaultValue: data != null ? data.data.total : 0,
      name: 'total'
    }
  ]

  const onSubmit = async (): Promise<void> => {
    const body = new FormData()
    body.append('file', file as File, file?.name)
    body.append('data', JSON.stringify(getValues()))
    const response = await axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/saveReceipt',
      data: body,
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  const validateBeforeSubmission = (): void => {
    const notifications: string[] = []
    let calcSubtotal = 0
    const ids = data?.data.line_items.map((lineItem) => lineItem.id)
    ids?.forEach((id) => {
      const itemTitle: string = getValues(id)
      const itemPrice: number = getValues(id.concat('_', 'price'))
      const itemQty: number = getValues(id.concat('_', 'qty'))
      const itemTotal: number = getValues(id.concat('_', 'total'))
      calcSubtotal += itemTotal
      const priceByQty = parseFloat(Number(itemPrice * itemQty).toFixed(2))
      if (priceByQty !== itemTotal) {
        setValue(id.concat('_', 'total'), priceByQty)
        const message = `${itemTitle.trim()}:<br/>total was changed from $${itemTotal} to $${priceByQty}`
        notifications.push(message)
      }
    })
    const subtotal: number = getValues('subtotal')
    const total: number = getValues('total')
    if (subtotal !== parseFloat(Number(calcSubtotal).toFixed(2))) {
      const tax: number = getValues('tax')
      const newTotal: number = parseFloat(
        Number(calcSubtotal + tax).toFixed(2)
      )
      const newSubtotal: number = parseFloat(Number(calcSubtotal).toFixed(2))
      notifications.push(
        `Subtotal mismatch: total & subsotal were recalculated. <br/>total: $${total} -> $${newTotal}<br/>subtotal: $${subtotal} -> $${newSubtotal}`
      )
      setValue('total', newTotal)
      setValue('subtotal', newSubtotal)
    }

    notifications.length > 0 && setValidationMessage(notifications)
    onOpen()
    setReadyToSubmit(true)
  }

  const closeAlerWindow = (): void => {
    onClose()
    setValidationMessage([])
  }

  useEffect(() => {
    const subscription = watch(() => setReadyToSubmit(false))
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <Flex
      w='95%'
      p='3% 5%'
      justify='space-between'
      align='center'
      overflow='hidden'
      h='100%'
    >
      <UploadReceipt
        file={file}
        receipt={receipt}
        reset={reset}
        setReceipt={setReceipt}
        setLoading={setLoading}
        setFile={setFile}
        setData={setData}
      />
      <VStack
        w='55%'
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
            <Flex align='center' justify='center' h='100%' direction='column'>
              <Text fontSize='2xl' mb={5}>
                Loading ...
              </Text>
              <CubeSpinner
                size={30}
                frontColor='#80485B'
                backColor='#F9A109'
                loading={loading}
              />
            </Flex>
            )
          : !loading && data != null
              ? (
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    {topInputs.map((input, index) => (
                      <InputGroup colorScheme='purple' key={index}>
                        <InputLeftAddon>{input.label}</InputLeftAddon>
                        <Input
                          type={input.type}
                          placeholder={input.placeholder}
                          defaultValue={input.defaultValue}
                          {...register(input.name, {
                            required: true
                          })}
                        />
                      </InputGroup>
                    ))}

                    <ItemsTable
                      register={register}
                      data={data}
                      setData={setData}
                      setValue={setValue}
                      unregister={unregister}
                      control={control}
                      getValues={getValues}
                    />
                    {bottomInputs.map((input, index) => (
                      <FormControl key={index}>
                        <HStack justify='flex-end' spacing={6}>
                          <FormLabel m={0} fontSize='lg'>
                            {input.label}
                          </FormLabel>
                          <NumberInputCp
                            default={input.defaultValue}
                            name={input.name}
                            control={control}
                            setValue={setValue}
                            getValues={getValues}
                          />
                        </HStack>
                      </FormControl>
                    ))}
                    <Button
                      type='button'
                      colorScheme='yellow'
                      size='lg'
                      w='100%'
                      onClick={validateBeforeSubmission}
                    >
                      Validate before submission
                    </Button>
                    <Button
                      type='submit'
                      colorScheme='purple'
                      size='lg'
                      w='100%'
                      isDisabled={!readyToSubmit}
                    >
                      Submit
                    </Button>
                    <Text />
                  </VStack>
                </form>
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
      </VStack>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlerWindow}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody color='main'>
              <VStack p='5%' align='flex-start'>
                {validationMessage.length === 0
                  ? (
                    <Text fontSize='lg' alignSelf='center'>
                      Successful validation. <br /> You can submit now
                    </Text>
                    )
                  : (
                      validationMessage.map((message, index) => (
                        <Fragment key={index}>
                          <Text fontSize='lg'>{Parser(message)}</Text>
                        </Fragment>
                      ))
                    )}
              </VStack>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  )
}
