// ----- internal modules ----- //
import { loggedIn } from '../auth'
import { deleteReceiptImageFromS3 } from '../receipt_s3'
import deleteItemFromDB from '@/utils/lineItem_crud/deleteItem'

// GraphQL queries
import { deleteReceiptMutation } from '@/common/queries'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'
import { deleteReceiptInput } from '@/common/types/pgql_input_types'
import { deleteReceiptResponse } from '@/common/types/pgql_response_types'
import { BaseFetchResponse } from '@/common/types/base_types'

const deleteReceipt = async (
  receipt: ReceiptPgql
): Promise<BaseFetchResponse> => {
  const userLoggedIn = await loggedIn()
  if (userLoggedIn.signedIn && userLoggedIn.email !== undefined) {
    const variables: deleteReceiptInput = {
      input: {
        receiptNumber: parseInt(receipt.receiptNumber),
        user: userLoggedIn.email
      }
    }

    const deleteLineItemsResult = await deleteItemFromDB(
      receipt.lineItemsByReceiptNumberAndUser.nodes
    )

    if (deleteLineItemsResult.success) {
      const deletedReceipt = await fetch(process.env.NEXT_PUBLIC_PGQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: deleteReceiptMutation(),
          variables
        })
      })

      const deleteReceiptResult: deleteReceiptResponse =
        await deletedReceipt.json()

      if (deleteReceiptResult.data !== undefined) {
        const deleteReceiptImageResult = await deleteReceiptImageFromS3(
          receipt.receiptNumber
        )
        if (deleteReceiptImageResult) {
          return {
            success: true
          }
        }
        return {
          success: false,
          errors: [
            {
              message: 'Deletion of receipt image failed'
            }
          ]
        }
      } else {
        if (deleteReceiptResult.errors !== undefined) {
          return {
            success: false,
            errors: deleteReceiptResult.errors
          }
        }
        return { success: false, errors: [] }
      }
    }
    return {
      success: false,
      errors: deleteLineItemsResult.errors
    }
  }
  return {
    success: false,
    errors: [
      {
        message: 'You are not logged in. Please refresh the page and try again'
      }
    ]
  }
}

export default deleteReceipt
