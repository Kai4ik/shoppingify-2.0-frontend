'use client'

// external modules
import { Flex, Text } from '@chakra-ui/react'
import { CubeSpinner } from 'react-spinners-kit'

export default function Loading (): JSX.Element {
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
      <CubeSpinner
        size={30}
        frontColor='#80485B'
        backColor='#F9A109'
        loading
      />
    </Flex>
  )
}
