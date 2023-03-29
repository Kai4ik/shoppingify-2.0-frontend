// ----- internal modules ----- //
import { updateReceiptTitle } from '../receipt_s3'
import addItemToDB from '../lineItem_crud/createItem'
import updateReceiptInDB from '../receipt_crud/updateReceipt'
import deleteItemFromDB from '../lineItem_crud/deleteItem'

// types
import { LineItemPgql } from '@/common/types/pgql_types'

const updateReceiptNumber = async (
  oldReceiptNumber: number,
  newReceiptNumber: number,
  lineItems: LineItemPgql[]
): Promise<void> => {
  await updateReceiptTitle(oldReceiptNumber, newReceiptNumber)

  // first step: delete old items
  await deleteItemFromDB(lineItems)

  // second step: update receipt (receiptNumber)
  await updateReceiptInDB(oldReceiptNumber, {
    receiptNumber: newReceiptNumber
  })

  // create duplicate items
  await addItemToDB(lineItems, newReceiptNumber)
}

export default updateReceiptNumber
