'use client'

// external modules
import { useRef, Fragment, RefObject, Dispatch, SetStateAction } from 'react'
import Parser from 'html-react-parser'
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  VStack,
  Text
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'

interface Props {
  isOpen: boolean
  validationMessage: string[]
  setValidationMessage: Dispatch<SetStateAction<string[]>>
  onClose: () => void
}

export default function ValidationAlert (props: Props): JSX.Element {
  const { isOpen, validationMessage, setValidationMessage, onClose } = props
  const cancelRef = useRef() as RefObject<FocusableElement>
  const closeAlerWindow = (): void => {
    onClose()
    setValidationMessage([])
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
            <VStack p='5%' align='flex-start'>
              {validationMessage.length === 0
                ? (
                  <Text fontSize='lg' alignSelf='center'>
                    Successful validation. <br /> You can submit now
                  </Text>
                  )
                : (
                    validationMessage.map((message, index) => (
                      <Fragment key={index}>
                        <Text fontSize='lg'>{Parser(message)}</Text>
                      </Fragment>
                    ))
                  )}
            </VStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
