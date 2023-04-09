'use client'

// ----- external modules ----- //
import { HStack, Text } from '@chakra-ui/react'
import Link from 'next/link'

// ----- internal modules ----- //
// types
import { LineItemPgql } from '@/common/types/pgql_types'

interface Props {
  item: LineItemPgql
}

export default function Item ({ item }: Props): JSX.Element {
  return (
    <HStack>
      <Link href={`/protected/productsList/${item.itemTitle}`}>
        <Text
          fontSize={[14, 18]}
          fontWeight={500}
          color='main'
          borderRadius={8}
          backgroundColor='blackAlpha.50'
          mr={['0px', '5px']}
          p='10px 15px'
          cursor='pointer'
          transitionDuration='0.3s'
          _hover={{
            backgroundColor: 'secondary'
          }}
        >
          {item.itemTitle}
        </Text>
      </Link>
    </HStack>
  )
}
