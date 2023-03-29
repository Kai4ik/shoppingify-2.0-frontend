'use client'

// ----- external modules ----- //
import { useState, Fragment, Dispatch, SetStateAction } from 'react'
import { Button, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import Parser from 'html-react-parser'
import {
  UseFormSetValue,
  UseFormGetValues,
  FieldValues
} from 'react-hook-form'

// ----- internal modules ----- //
import {
  validateBeforeSubmission,
  hookFormIntoObject
} from '@/utils/receipts_crud'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

// components
import Alert from '@/common/components/alert'

interface Props {
  data: ReceiptPgql
  getValues: UseFormGetValues<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  setReadyToSubmit: Dispatch<SetStateAction<boolean>>
}

export default function ValidateBtn (props: Props): JSX.Element {
  const { getValues, setValue, data, setReadyToSubmit } = props

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [validationMessage, setValidationMessage] = useState<string[]>([])
  const [validationInProgress, setValidationInProgress] =
    useState<boolean>(false)

  const handleValidation = (): void => {
    setValidationInProgress(true)
    onOpen()
    const updatedReceipt: ReceiptPgql = hookFormIntoObject(getValues, data)

    const notifications = validateBeforeSubmission(
      getValues,
      setValue,
      updatedReceipt.lineItemsByReceiptNumberAndUser.nodes
    )
    notifications.length > 0 && setValidationMessage(notifications)
    setValidationInProgress(false)
    setReadyToSubmit(true)
  }

  return (
    <>
      <Button
        type='button'
        colorScheme='yellow'
        size='lg'
        w='100%'
        onClick={handleValidation}
      >
        Validate
      </Button>
      <Alert
        isOpen={isOpen}
        onClose={onClose}
        runOnClose={() => setValidationMessage([])}
      >
        {validationInProgress
          ? (
            <>
              <Text fontSize='lg'>Validation in progress</Text>
              <Spinner />
            </>
            )
          : validationMessage.length === 0
            ? (
              <>
                <Text fontSize='lg'>Successful validation. </Text>
                <CheckCircleIcon boxSize={8} color='green.500' />
              </>
              )
            : (
                validationMessage.map((message, index) => (
                  <Fragment key={index}>
                    <Text fontSize='lg'>{Parser(message)}</Text>
                  </Fragment>
                ))
              )}
      </Alert>
    </>
  )
}
