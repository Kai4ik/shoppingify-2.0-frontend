'use client'

// external modules
import axios from 'axios'
import FormData from 'form-data'
import {
  Input,
  Stack,
  InputGroup,
  InputLeftAddon,
  WrapItem,
  Image,
  Button
} from '@chakra-ui/react'
import { ChangeEvent, Dispatch, SetStateAction, useState, memo } from 'react'
import { UseFormReset, FieldValues } from 'react-hook-form'

// internal modules
import { ReceiptScanResponse } from '@/common/types/api_types'
import { loggedIn } from '@/utils/auth'

interface Props {
  file: File | undefined
  setLoading: Dispatch<SetStateAction<boolean>>
  setFile: Dispatch<SetStateAction<File | undefined>>
  setData: Dispatch<SetStateAction<ReceiptScanResponse | undefined>>
  reset: UseFormReset<FieldValues>
  setScanError: Dispatch<SetStateAction<boolean>>
}

function UploadReceipt (props: Props): JSX.Element {
  const { file, setLoading, setFile, setData, setScanError, reset } = props
  const [receipt, setReceipt] = useState<string | undefined>(undefined)

  const handleImageUplaod = (e: ChangeEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement
    if (target.files != null) {
      const file = target.files[0]
      const src = URL.createObjectURL(file)
      setReceipt(src)
      setFile(file)
    }
  }

  const handleSubmitScan = (): void => {
    setLoading(true);
    (async () => {
      const userLoggedIn = await loggedIn()
      if (userLoggedIn.signedIn && userLoggedIn.jwt !== undefined) {
        const data = new FormData()
        data.append('file', file, file?.name)
        try {
          const response = await axios.post(
            'https://w13eimazx5.execute-api.us-east-1.amazonaws.com/prod/scanReceipt',
            data,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userLoggedIn.jwt}`
              }
            }
          )
          reset(data)

          const result: ReceiptScanResponse = response.data
          result.success && setData({ ...result })
        } catch (error: unknown) {
          setScanError(true)
          setData(undefined)
        }
        setLoading(false)
      }
    })().catch((err) => console.error(err))
  }

  return (
    <Stack
      w={['100%', '40%']}
      h={['auto', '100%']}
      p='1% 0'
      align='center'
      spacing={6}
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
        h='100%'
        css={{
          '&::-webkit-scrollbar': {
            width: '0px'
          }
        }}
      >
        {receipt !== undefined
          ? (
            <Image src={receipt} alt='Receipt image' borderRadius={12} />
            )
          : (
            <Image
              boxSize='70%'
              objectFit='contain'
              src='/undraw_no_photo.svg'
              alt='No receipt image'
              borderRadius={12}
            />
            )}
      </WrapItem>
      {receipt !== undefined && (
        <Button
          colorScheme='purple'
          onClick={handleSubmitScan}
          size='lg'
          w='100%'
        >
          Scan Receipt
        </Button>
      )}
    </Stack>
  )
}

export default memo(UploadReceipt)
