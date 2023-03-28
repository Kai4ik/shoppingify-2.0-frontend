'use client'

// ----- external modules ----- //
import { Input, Text } from '@chakra-ui/react'
import { UseFormRegister, FieldValues } from 'react-hook-form'

interface Props {
  merchant: string
  currency: string
  register: UseFormRegister<FieldValues>
}

export default function MerchantTitle (props: Props): JSX.Element {
  const { merchant, currency, register } = props

  return (
    <>
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
        defaultValue={merchant}
        {...register('merchant')}
      />
      <Text alignSelf='flex-start'>* all prices in {currency}</Text>
      <Text alignSelf='flex-start'>
        * pay attention to items in
        <span style={{ color: 'red' }}> red! </span> We found them suspicious
      </Text>
    </>
  )
}
