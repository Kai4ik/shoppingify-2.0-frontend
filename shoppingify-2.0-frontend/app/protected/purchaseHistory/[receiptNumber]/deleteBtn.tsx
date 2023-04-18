'use client'

// external modules
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

// internal modules
import { ReceiptPgql } from '@/common/types/pgql_types'
import Alert from '@/common/components/alert'
import deleteReceipt from '@/utils/receipt_crud/deleteReceipt'

interface Props {
  receipt: ReceiptPgql
}

export default function DeleteBtn (props: Props): JSX.Element {
  const { receipt } = props
  const router = useRouter()

  const [deletionInProgress, setDeletionInProgress] = useState<boolean>(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDelete = (): void => {
    setDeletionInProgress(true)
    onOpen();
    (async () => {
      await deleteReceipt(receipt)
    })().catch((err) => console.error(err))
    setDeletionInProgress(false)
    router.push('/protected/purchaseHistory')
  }

  return (
    <>
      <Button
        loadingText='Submitting'
        type='button'
        colorScheme='red'
        size='lg'
        w='100%'
        onClick={handleDelete}
      >
        Delete
      </Button>

      <Alert
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        {deletionInProgress
          ? (
            <>
              <Text fontSize='lg'>Deletion in progress</Text>
              <Spinner />
            </>
            )
          : (
            <>
              <Text fontSize='lg'>Receipt was deleted !</Text>
              <CheckCircleIcon boxSize={8} color='green.500' />
            </>
            )}
      </Alert>
    </>
  )
}
