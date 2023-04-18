'use client'

// external modules
import { Flex, Text } from '@chakra-ui/react'
import { PushSpinner } from 'react-spinners-kit'

export default function Fallback (): JSX.Element {
  return (
    <Flex
      align='center'
      justify='center'
      h='100vh'
      direction='column'
      w='100vw'
    >
      <Text fontSize='2xl' mb={5}>
        Loading ...
      </Text>
      <PushSpinner size={30} color='#80485B' loading />
    </Flex>
  )
}
