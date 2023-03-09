'use client'

// external modules
import { Flex, Text } from '@chakra-ui/react'
import { CubeSpinner } from 'react-spinners-kit'

interface Props {
  loading: boolean
}

export default function LoadingCp (props: Props): JSX.Element {
  return (
    <Flex align='center' justify='center' h='100%' direction='column' w='100%'>
      <Text fontSize='2xl' mb={5}>
        Loading ...
      </Text>
      <CubeSpinner
        size={30}
        frontColor='#80485B'
        backColor='#F9A109'
        loading={props.loading}
      />
    </Flex>
  )
}
