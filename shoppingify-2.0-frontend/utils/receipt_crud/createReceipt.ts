// ----- internal modules ----- //

// types
import {
  createReceiptInput,
  ReceiptInput
} from '@/common/types/pgql_input_types'
import { createReceiptResponse } from '@/common/types/pgql_response_types'
import { BaseFetchResponse } from '@/common/types/base_types'

// GraphQL queries
import { createreceipt } from '@/common/queries'

const addReceiptToDb = async (
  receipt: ReceiptInput
): Promise<BaseFetchResponse> => {
  const variables: createReceiptInput = {
    input: {
      receipt
    }
  }

  const createdReceipt = await fetch(process.env.NEXT_PUBLIC_PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: createreceipt(),
      variables
    })
  })
  const response: createReceiptResponse = await createdReceipt.json()

  if (response.data !== undefined) {
    return {
      success: true,
      payload: {
        receiptNumber: response.data.createReceipt.receipt.receiptNumber
      }
    }
  } else {
    if (response.errors !== undefined) {
      return { success: false, errors: response.errors }
    }
    return { success: false, errors: [] }
  }
}

export default addReceiptToDb
