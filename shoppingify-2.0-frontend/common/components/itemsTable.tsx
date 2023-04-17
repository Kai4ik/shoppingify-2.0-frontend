'use client'

// ----- external modules ----- //
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Text
} from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export default function ItemsTable ({
  children
}: PropsWithChildren): JSX.Element {
  return (
    <TableContainer w='auto'>
      <Table
        variant='unstyled'
        layout={['fixed', 'auto']}
        w={['200%', '100%']}
        overflowX='scroll'
      >
        <Thead>
          <Tr color='main'>
            <Th px={0} w={['8%', 'auto']} />
            <Th px={2} w={['40%', '30%']}>
              <Text fontSize='xl'>Title</Text>
            </Th>
            <Th px={2} w={['20%', 'auto']}>
              <Text fontSize='xl'>Price</Text>
            </Th>
            <Th px={2} w={['20%', 'auto']}>
              <Text fontSize='xl'>Qty</Text>
            </Th>
            <Th px={2} w={['20%', 'auto']}>
              <Text fontSize='xl'>Unit</Text>
            </Th>
            <Th px={2} w={['20%', 'auto']}>
              <Text fontSize='xl'>Total</Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>{children}</Tbody>
      </Table>
    </TableContainer>
  )
}
