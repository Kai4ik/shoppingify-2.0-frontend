// ----- external modules ----- //
import {
  Text,
  AccordionPanel,
  VStack,
  HStack,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'

// ----- internal modules ----- //
import deleteReceipt from '@/utils/receipt_crud/deleteReceipt'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

interface Props {
  receipt: ReceiptPgql
  initialReceipts: ReceiptPgql[]
  setInitialReceipts: Dispatch<SetStateAction<ReceiptPgql[]>>
}

export default function ReceiptDetails ({
  receipt,
  initialReceipts,
  setInitialReceipts
}: Props): JSX.Element {
  const router = useRouter()
  const [deletionInProgress, setDeletionInProgress] = useState<boolean>(false)

  const handleDelete = (): void => {
    setDeletionInProgress(true);

    (async () => {
      const result: boolean = await deleteReceipt(receipt)
      if (result) {
        const filteredArray = initialReceipts.filter(
          (elem) => elem.receiptNumber !== receipt.receiptNumber
        ) as [ReceiptPgql]
        setInitialReceipts(filteredArray)
      }
    })().catch((err) => console.error(err))

    setDeletionInProgress(false)
  }

  return (
    <AccordionPanel pb={4}>
      <VStack spacing={8} w='100%'>
        <Stack direction={['column', 'row']} w='100%'>
          <FormControl colorScheme='purple'>
            <FormLabel fontWeight={600} color='main'>
              Purchase Date
            </FormLabel>
            <Input
              type='date'
              placeholder='Purchase Date'
              defaultValue={receipt.purchaseDate}
              isReadOnly
            />
          </FormControl>
          <FormControl colorScheme='purple'>
            <FormLabel fontWeight={600} color='main'>
              Purchase Time
            </FormLabel>
            <Input
              type='time'
              placeholder='Purchase Time'
              defaultValue={receipt.purchaseTime}
              isReadOnly
            />
          </FormControl>
        </Stack>
        <TableContainer w='100%'>
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th color='main'>Product Title</Th>
                <Th isNumeric color='main'>
                  Price
                </Th>
                <Th isNumeric color='main'>
                  Qty
                </Th>
                <Th color='main'>Unit</Th>
                <Th isNumeric color='main'>
                  Total
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {receipt.lineItemsByReceiptNumberAndUser.nodes.map((lineItem) => (
                <Tr key={lineItem.id}>
                  <Td>{lineItem.itemTitle}</Td>
                  <Td isNumeric>{lineItem.price}</Td>
                  <Td isNumeric>{lineItem.qty}</Td>
                  <Td>{lineItem.unit}</Td>
                  <Td isNumeric>{lineItem.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <VStack spacing={4} w='100%' align='flex-end'>
          <VStack spacing={1} w='100%' align='flex-end' fontSize={[18, 20]}>
            <HStack justify='space-between' w={['60%', '30%']} p='0 1%'>
              <Text fontWeight={600} color='main'>
                Subtotal:
              </Text>
              <Text> ${receipt.subtotal}</Text>
            </HStack>
            <HStack justify='space-between' w={['60%', '30%']} p='0 1%'>
              <Text fontWeight={600} color='main'>
                Tax:
              </Text>
              <Text> ${receipt.tax}</Text>
            </HStack>
            <HStack justify='space-between' w={['60%', '30%']} p='0 1%'>
              <Text fontWeight={600} color='main'>
                Total:
              </Text>
              <Text> ${receipt.total}</Text>
            </HStack>
          </VStack>
          <HStack justify='space-between' w={['60%', '30%']} p='0 1%'>
            <Button
              colorScheme='yellow'
              w='48%'
              leftIcon={<EditIcon />}
              onClick={() =>
                router.push(
                  `/protected/purchaseHistory/${receipt.receiptNumber}`
                )}
            >
              Edit
            </Button>
            <Button
              colorScheme='red'
              w='48%'
              leftIcon={<DeleteIcon />}
              onClick={handleDelete}
              isLoading={deletionInProgress}
              loadingText='Deleting ...'
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </AccordionPanel>
  )
}
