'use client'

// external modules
import { useRef, RefObject, Dispatch, SetStateAction } from 'react'
import Parser from 'html-react-parser'
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  VStack,
  Text,
  Icon
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'

import { CheckCircleIcon } from '@chakra-ui/icons'
import { AiFillCloseCircle } from 'react-icons/ai'

interface Props {
  isOpen: boolean
  submissionMessages: string[]
  setSubmissionMessages: Dispatch<SetStateAction<string[]>>
  onClose: () => void
}

export default function SubmissionAlert (props: Props): JSX.Element {
  const { isOpen, submissionMessages, setSubmissionMessages, onClose } = props
  const cancelRef = useRef() as RefObject<FocusableElement>
  const closeAlerWindow = (): void => {
    onClose()
    setSubmissionMessages([])
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={closeAlerWindow}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogBody color='main'>
            <VStack p='5%'>
              {submissionMessages.length === 0
                ? (
                  <VStack align='center' spacing={6}>
                    <CheckCircleIcon boxSize={8} color='green.500' />
                    <Text fontSize='lg' textAlign='center'>
                      Receipt was successfully uploaded!
                    </Text>
                  </VStack>
                  )
                : (
                    submissionMessages.map((message, index) => (
                      <VStack key={index} align='center' spacing={6}>
                        <Icon as={AiFillCloseCircle} color='red.500' boxSize={8} />
                        <Text fontSize='lg' textAlign='center'>
                          {Parser(message)}
                        </Text>
                      </VStack>
                    ))
                  )}
            </VStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
