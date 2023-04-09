'use client'

// ----- external modules ----- //
import {
  VStack,
  Text,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { useState } from 'react'

// ----- internal modules ----- //
// components
import Item from './item'

// types
import { LineItemPgql } from '@/common/types/pgql_types'

interface Props {
  lineItems: LineItemPgql[]
}

export default function ItemsContainer ({ lineItems }: Props): JSX.Element {
  const [searchInput, setSearchInput] = useState('')

  const filteredItems = lineItems.filter((item) => {
    return item.itemTitle.toLowerCase().includes(searchInput.toLowerCase())
  })

  return (
    <VStack
      w='95%'
      p={['4% 0 5% 5%', '4% 0 4% 10%']}
      spacing={8}
      align='flex-start'
    >
      <VStack align='flex-start'>
        <HStack color='main' fontWeight={600}>
          <Text fontSize={20}>All purchased items</Text>
          <Text fontSize={16}>({lineItems.length})</Text>
        </HStack>
      </VStack>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <Search2Icon color='gray.300' mt='10px' />
        </InputLeftElement>
        <Input
          w='90%'
          type='text'
          placeholder='Search by name'
          size='lg'
          variant='flushed'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </InputGroup>

      <Flex wrap='wrap' gap={['15px', '20px']}>
        {filteredItems.map((item) => (
          <Item item={item} key={item.id} />
        ))}
      </Flex>
    </VStack>
  )
}
