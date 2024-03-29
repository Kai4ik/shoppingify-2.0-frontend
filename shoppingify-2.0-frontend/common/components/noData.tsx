'use client'

// ----- external modules ----- //
import { Text, VStack, Image } from '@chakra-ui/react'
import NextLink from 'next/link'

interface Props {
  heading: string
  subheading?: string
  link?: string
}

export default function NoDataCp ({
  heading,
  subheading,
  link
}: Props): JSX.Element {
  return (
    <VStack spacing={8} alignSelf='center'>
      <VStack fontWeight={600}>
        <Text fontSize='3xl' color='main'>
          {heading}
        </Text>
        {subheading !== undefined && (
          <Text fontSize='xl' color='secondary'>
            {subheading}
          </Text>
        )}
        {link !== undefined && (
          <NextLink href='/protected/addReceipt' color='purple.300'>
            <Text fontSize='xl' color='secondary'>
              {link}
            </Text>
          </NextLink>
        )}
      </VStack>
      <Image
        boxSize='200px'
        objectFit='cover'
        src='/undraw_no_data.svg'
        alt='No Receipt'
      />
    </VStack>
  )
}
