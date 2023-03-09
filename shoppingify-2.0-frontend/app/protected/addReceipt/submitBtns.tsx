'use client'

// external modules
import { useState, useEffect } from 'react'

import { Button, useDisclosure } from '@chakra-ui/react'
import {
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  FieldValues
} from 'react-hook-form'

// internal modules
import { ReceiptScanResponse } from '@/common/types'
import ValidationAlert from './validationAlert'

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

  const validateBeforeSubmission = (): void => {
    const notifications: string[] = []
    let calcSubtotal = 0
    const ids = data.data.line_items.map((lineItem) => lineItem.id)
    ids?.forEach((id) => {
      const itemTitle: string = getValues(id)
      const itemPrice: number = getValues(id.concat('_', 'price'))
      const itemQty: number = getValues(id.concat('_', 'qty'))
      const itemTotal: number = getValues(id.concat('_', 'total'))
      calcSubtotal += itemTotal
      const priceByQty = parseFloat(Number(itemPrice * itemQty).toFixed(2))
      if (priceByQty !== itemTotal) {
        setValue(id.concat('_', 'total'), priceByQty)
        const message = `${itemTitle.trim()}:<br/>total was changed from $${itemTotal} to $${priceByQty}`
        notifications.push(message)
      }
    })
    const subtotal: number = getValues('subtotal')
    const total: number = getValues('total')
    if (subtotal !== parseFloat(Number(calcSubtotal).toFixed(2))) {
      const tax: number = getValues('tax')
      const newTotal: number = parseFloat(
        Number(calcSubtotal + tax).toFixed(2)
      )
      const newSubtotal: number = parseFloat(Number(calcSubtotal).toFixed(2))
      notifications.push(
        `Subtotal mismatch: total & subsotal were recalculated. <br/>subtotal: $${subtotal} -> $${newSubtotal}<br/>total: $${total} -> $${newTotal}`
      )
      setValue('total', newTotal)
      setValue('subtotal', newSubtotal)
    }

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
        onClick={validateBeforeSubmission}
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
