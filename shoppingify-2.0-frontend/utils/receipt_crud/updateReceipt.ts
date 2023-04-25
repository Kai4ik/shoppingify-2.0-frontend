// ----- internal modules ----- //
import { getUsernameFromCookies } from '../auth'

// types
import { BaseFetchResponse } from '@/common/types/base_types'
import { UpdateReceiptPgql } from '@/common/types/pgql_types'
import { updateReceiptInput } from '@/common/types/pgql_input_types'
import { updateReceiptResponse } from '@/common/types/pgql_response_types'

// GraphQL queries
import { updateReceiptMutation } from '@/common/queries/updateReceipt'

const updateReceiptInDB = async (
  receiptNumber: number,
  newValues: UpdateReceiptPgql
): Promise<BaseFetchResponse> => {
  const username = getUsernameFromCookies()
  const variables: updateReceiptInput = {}
  const valuesToUpdate: UpdateReceiptPgql = Object.assign({}, newValues)
  delete valuesToUpdate.lineItemsByReceiptNumberAndUser
  variables.input = {
    receiptNumber,
    user: username,
    receiptPatch: valuesToUpdate
  }

  const updatedReceipt = await fetch(process.env.NEXT_PUBLIC_PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: updateReceiptMutation(),
      variables
    })
  })

  const response: updateReceiptResponse = await updatedReceipt.json()
  if (response.data !== undefined) {
    return {
      success: true,
      payload: {
        receiptNumber:
          response.data.updateReceiptByReceiptNumberAndUser.receipt
            .receiptNumber
      }
    }
  } else {
    if (response.errors !== undefined) {
      return { success: false, errors: response.errors }
    }
    return { success: false, errors: [] }
  }
}

export default updateReceiptInDB
