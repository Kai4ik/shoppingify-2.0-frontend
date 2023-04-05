// ----- internal modules ----- //
import { getUsernameFromCookies } from '../auth'

// types

import { UpdateReceiptPgql } from '@/common/types/pgql_types'

// GraphQL queries
import { updateReceipt } from '@/common/queries'
import { updateReceiptInput } from '@/common/types/pgql_input_types'

const updateReceiptInDB = async (
  receiptNumber: number,
  newValues: UpdateReceiptPgql
): Promise<void> => {
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
      query: updateReceipt(),
      variables
    })
  })
  console.log(await updatedReceipt.json())
}

export default updateReceiptInDB
