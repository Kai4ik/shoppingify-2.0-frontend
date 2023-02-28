'use client'

// external modules
import axios from 'axios'
import FormData from 'form-data'
import {
  Input,
  Flex,
  InputGroup,
  InputLeftAddon,
  WrapItem,
  Image,
  Button
} from '@chakra-ui/react'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { UseFormReset, FieldValues } from 'react-hook-form'

// internal modules
import { ReceiptScanResponse } from '@/common/types'

interface Props {
  file: File | undefined
  receipt: string
  setReceipt: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setFile: Dispatch<SetStateAction<File | undefined>>
  setData: Dispatch<SetStateAction<ReceiptScanResponse | undefined>>
  reset: UseFormReset<FieldValues>
}

export default function UploadReceipt (props: Props): JSX.Element {
  const { file, receipt, setReceipt, setLoading, setFile, setData, reset } =
    props
  const handleImageUplaod = (e: ChangeEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement
    if (target.files != null) {
      const file = target.files[0]
      const src = URL.createObjectURL(file)
      setReceipt(src)
      setFile(file)
    }
  }

  const handleSubmitScan = () => {
    setLoading(true);
    (async () => {
      const data = new FormData()
      data.append('file', file, file?.name)
      const response = await axios.post(
        'http://127.0.0.1:8000/scanReceipt',
        data,
        {
          headers: {
            accept: 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const result: ReceiptScanResponse = response.data
      if (result.success) {
        reset(data)
        setData({ ...result })
        setLoading(false)
      }
    })()
  }

  return (
    <Flex
      w='40%'
      h='100%'
      p='1% 0'
      justify={receipt === 'no-image' ? 'flex-start' : 'space-between'}
      align='center'
      direction='column'
    >
      <InputGroup colorScheme='purple'>
        <InputLeftAddon> Upload Receipt </InputLeftAddon>
        <Input
          w='100%'
          type='file'
          accept='image/*'
          onChange={handleImageUplaod}
          css={{
            '&::-webkit-file-upload-button': {
              display: 'none'
            },
            '&::file-selector-button': {
              display: 'none'
            }
          }}
          lineHeight='35px'
        />
      </InputGroup>
      <WrapItem
        overflowY='scroll'
        alignItems='flex-start'
        justifyContent='center'
        borderRadius={12}
        h='80%'
        css={{
          '&::-webkit-scrollbar': {
            width: '0px'
          }
        }}
      >
        {receipt === 'no-image'
          ? (
            <Image
              boxSize='70%'
              objectFit='contain'
              src='/undraw_no_photo.svg'
              alt='Receipt image'
              borderRadius={12}
            />
            )
          : (
            <Image src={receipt} alt='No receipt image' borderRadius={12} />
            )}
      </WrapItem>
      {receipt !== 'no-image' && (
        <Button
          colorScheme='purple'
          onClick={handleSubmitScan}
          size='lg'
          w='100%'
        >
          Scan Receipt
        </Button>
      )}
    </Flex>
  )
}
