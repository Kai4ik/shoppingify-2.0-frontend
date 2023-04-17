'use client'

// ----- external modules ----- //
import { useRef, RefObject, PropsWithChildren } from 'react'
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  VStack
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'

interface Props {
  isOpen: boolean

  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  onClose: () => void
  runOnClose?: () => void
}

export default function SubmissionAlert (
  props: PropsWithChildren<Props>
): JSX.Element {
  const {
    isOpen,
    onClose,
    children,
    runOnClose,
    closeOnOverlayClick,
    closeOnEsc
  } = props
  const cancelRef = useRef() as RefObject<FocusableElement>
  const closeAlertWindow = (): void => {
    onClose()
    if (runOnClose !== undefined) {
      runOnClose()
    }
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={closeAlertWindow}
      closeOnOverlayClick={
        closeOnOverlayClick === undefined ? true : closeOnOverlayClick
      }
      closeOnEsc={closeOnEsc === undefined ? true : closeOnEsc}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogBody color='main'>
            <VStack p='5%'>{children}</VStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
