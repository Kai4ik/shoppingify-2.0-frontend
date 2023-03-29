'use client'

// external modules
import { Fragment, Dispatch, SetStateAction } from 'react'
import Parser from 'html-react-parser'
import { Text } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

// internal modules
import Alert from '@/common/components/alert'

interface Props {
  isOpen: boolean
  validationMessage: string[]
  setValidationMessage: Dispatch<SetStateAction<string[]>>
  onClose: () => void
}

export default function ValidationAlert (props: Props): JSX.Element {
  const { isOpen, validationMessage, setValidationMessage, onClose } = props

  return (
    <Alert
      isOpen={isOpen}
      onClose={onClose}
      runOnClose={() => setValidationMessage([])}
    >
      {validationMessage.length === 0
        ? (
          <>
            <Text fontSize='lg' alignSelf='center'>
              Successful validation. <br /> You can submit now
            </Text>
            <CheckCircleIcon boxSize={8} color='green.500' />
          </>
          )
        : (
            validationMessage.map((message, index) => (
              <Fragment key={index}>
                <Text fontSize='lg' alignSelf='flex-start'>
                  {Parser(message)}
                </Text>
              </Fragment>
            ))
          )}
    </Alert>
  )
}
