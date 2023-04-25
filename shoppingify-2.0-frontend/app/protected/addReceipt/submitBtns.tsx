'use client'

// ----- external modules ----- //
import { useState, useEffect } from 'react'
import { Button, useDisclosure } from '@chakra-ui/react'
import {
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  FieldValues
} from 'react-hook-form'

// ----- internal modules ----- //
import { validateBeforeSubmission } from '@/utils/receipts_crud'

// components
import ValidationAlert from './validationAlert'

// types
import { ReceiptScanResponse } from '@/common/types/api_types'

interface Props {
  data: ReceiptScanResponse
  submissionInProgress: boolean
  watch: UseFormWatch<FieldValues>
  getValues: UseFormGetValues<FieldValues>
  setValue: UseFormSetValue<FieldValues>
}

export default function SubmitBtns (props: Props): JSX.Element {
  const { data, submissionInProgress, watch, getValues, setValue } = props

  const [validationMessage, setValidationMessage] = useState<string[]>([])
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleValidation = (): void => {
    const notifications = validateBeforeSubmission(
      getValues,
      setValue,
      data.data.lineItems
    )

    notifications.length > 0 && setValidationMessage(notifications)
    onOpen()
    setReadyToSubmit(true)
  }

  useEffect(() => {
    const subscription = watch(() => setReadyToSubmit(false))
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <>
      <Button
        type='button'
        colorScheme='yellow'
        size='lg'
        w='100%'
        onClick={handleValidation}
      >
        Validate before submission
      </Button>
      <Button
        isLoading={submissionInProgress}
        loadingText='Submitting'
        type='submit'
        colorScheme='purple'
        size='lg'
        w='100%'
        isDisabled={!readyToSubmit}
      >
        Submit
      </Button>
      <ValidationAlert
        isOpen={isOpen}
        onClose={onClose}
        validationMessage={validationMessage}
        setValidationMessage={setValidationMessage}
      />
    </>
  )
}
