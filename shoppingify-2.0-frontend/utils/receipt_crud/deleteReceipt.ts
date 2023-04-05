// ----- internal modules ----- //
import { loggedIn } from '../auth'
import { deleteReceiptImageFromS3 } from '../receipt_s3'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

const deleteReceipt = async (receipt: ReceiptPgql): Promise<boolean> => {
  const lineItemsIds = receipt.lineItemsByReceiptNumberAndUser.nodes.map(
    (item) => item.id
  )

  const userLoggedIn = await loggedIn()
  if (userLoggedIn.signedIn && userLoggedIn.jwt !== undefined) {
    const response = await fetch('http://127.0.0.1:8000/deleteReceipt', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userLoggedIn.jwt}`
      },
      body: JSON.stringify({
        receipt_number: parseInt(receipt.receiptNumber),
        line_items_ids: lineItemsIds
      })
    })
    const result = await response.json()
    const deletionFromDbSucceeded: boolean = result.success

    if (deletionFromDbSucceeded) {
      return await deleteReceiptImageFromS3(receipt.receiptNumber)
    }
  }
  return false
}

export default deleteReceipt
