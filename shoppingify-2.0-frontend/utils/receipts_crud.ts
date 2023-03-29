// external modules
import {
  UseFormSetValue,
  UseFormGetValues,
  UseFormUnregister,
  FieldValues
} from 'react-hook-form'

// ----- internal modules ----- //

// types
import { LineItem } from '@/common/types/api_types'
import { LineItemPgql, ReceiptPgql } from '@/common/types/pgql_types'

// delete line item from receipt
// used on "Edit receipt" and "Upload new receipt" pages
export const deleteItem = (
  getValues: UseFormGetValues<FieldValues>,
  setValue: UseFormSetValue<FieldValues>,
  itemId: string,
  setFn: () => void,
  unregister: UseFormUnregister<FieldValues>
): void => {
  const subtotal = getValues('subtotal')
  const total = getValues('total')
  const productTotal = getValues(itemId.concat('_', 'total'))
  const newSubtotal = parseFloat(Number(subtotal - productTotal).toFixed(2))
  const newTotal = parseFloat(Number(total - productTotal).toFixed(2))
  setValue('subtotal', newSubtotal)
  setValue('total', newTotal)

  unregister(itemId);
  ['price', 'total', 'unit', 'qty'].forEach((name) => {
    unregister(itemId.concat('_', name))
  })
  setFn()
}

export const validateBeforeSubmission = (
  getValues: UseFormGetValues<FieldValues>,
  setValue: UseFormSetValue<FieldValues>,
  lineItems: LineItem[] | LineItemPgql[]
): string[] => {
  const notifications: string[] = []
  let calcSubtotal = 0
  const ids: string[] = lineItems.map((lineItem: LineItem | LineItemPgql) =>
    lineItem.id.toString()
  )

  ids?.forEach((id) => {
    const itemTitle: string = getValues(id)
    const itemPrice: number = parseFloat(getValues(id.concat('_', 'price')))
    const itemQty: number = parseFloat(getValues(id.concat('_', 'qty')))
    const itemTotal: number = parseFloat(getValues(id.concat('_', 'total')))
    const priceByQty = parseFloat(Number(itemPrice * itemQty).toFixed(2))
    calcSubtotal += priceByQty
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
    const newTotal: number = parseFloat(Number(calcSubtotal + tax).toFixed(2))
    const newSubtotal: number = parseFloat(Number(calcSubtotal).toFixed(2))
    notifications.push(
      `Subtotal mismatch: total & subsotal were recalculated. <br/>subtotal: $${subtotal} -> $${newSubtotal}<br/>total: $${total} -> $${newTotal}`
    )
    setValue('total', newTotal)
    setValue('subtotal', newSubtotal)
  }
  return notifications
}

export const hookFormIntoObject = (
  getValues: UseFormGetValues<FieldValues>,
  receipt: ReceiptPgql
): ReceiptPgql => {
  const updatedValues = getValues()

  const ids = receipt.lineItemsByReceiptNumberAndUser.nodes.map(
    (lineItem: LineItemPgql) => lineItem.id.toString()
  )

  const items: LineItemPgql[] = []
  ids?.forEach((id) => {
    const item: LineItemPgql = {
      id: parseInt(id),
      itemTitle: updatedValues[id],
      price: updatedValues[id.concat('_', 'price')],
      qty: updatedValues[id.concat('_', 'qty')],
      total: updatedValues[id.concat('_', 'total')],
      unit: updatedValues[id.concat('_', 'unit')]
    }
    items.push(item)
  })

  const formValuesIntoObject: ReceiptPgql = {
    id: receipt.id,
    merchant: updatedValues.merchant,
    tax: updatedValues.tax.toString(),
    subtotal: updatedValues.subtotal.toString(),
    total: updatedValues.total.toString(),
    currency: receipt.currency,
    purchaseDate: updatedValues.purchaseDate,
    purchaseTime: updatedValues.purchaseTime,
    receiptNumber: updatedValues.receiptNumber,
    lineItemsByReceiptNumberAndUser: {
      nodes: items
    },
    numberOfItems: items.length
  }

  return formValuesIntoObject
}
