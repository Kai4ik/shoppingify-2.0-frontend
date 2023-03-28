'use client'

// ----- external modules ----- //
import { Dispatch, SetStateAction } from 'react'
import Parser from 'html-react-parser'
import { VStack, Text, Icon } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { AiFillCloseCircle } from 'react-icons/ai'

// ----- internal modules ----- //
// components
import Alert from '@/common/components/alert'

interface Props {
  isOpen: boolean
  submissionMessages: string[]
  setSubmissionMessages: Dispatch<SetStateAction<string[]>>
  onClose: () => void
}

export default function SubmissionAlert (props: Props): JSX.Element {
  const { isOpen, submissionMessages, setSubmissionMessages, onClose } = props

  return (
    <Alert
      isOpen={isOpen}
      onClose={onClose}
      runOnClose={() => setSubmissionMessages([])}
    >
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
    </Alert>
  )
}
