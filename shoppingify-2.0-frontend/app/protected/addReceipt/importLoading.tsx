'use client'

// external modules
import { Text } from '@chakra-ui/react'

export default function ImportLoading ({
  title
}: {
  title: string
}): JSX.Element {
  return (
    <Text
      fontSize='2xl'
      bg='blackAlpha.50'
      p={2}
      w='100%'
      textAlign='center'
      borderRadius='8px'
      color='main'
    >
      {title}
    </Text>
  )
}
