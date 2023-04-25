// ----- internal modules ----- //
// types
import { UpdateLineItemPgql, ReceiptPgql } from '@/common/types/pgql_types'
import { updateLineItemInput } from '@/common/types/pgql_input_types'
import { updateLineItemsResponse } from '@/common/types/pgql_response_types'
import { BaseFetchResponse } from '@/common/types/base_types'

// GraphQL queries
import { updateLineItemsMutation } from '@/common/queries/updateLineItems'

const updateItemInDB = async (
  updatedNodes: {
    [key: number]: UpdateLineItemPgql
  },
  receipt: ReceiptPgql
): Promise<BaseFetchResponse> => {
  const updatedItemsIndexes: string[] = Object.keys(updatedNodes)

  updatedItemsIndexes.forEach((index) => {
    updatedNodes[parseInt(index)].id =
      receipt.lineItemsByReceiptNumberAndUser.nodes[parseInt(index)].id
  })

  const variables: updateLineItemInput = {}
  updatedItemsIndexes.forEach((index, k) => {
    const updatedItem = updatedNodes[parseInt(index)]
    const valuesToUpdate: UpdateLineItemPgql = Object.assign({}, updatedItem)
    variables[`input_${k}`] = {
      id: updatedItem.id as number,
      lineItemPatch: valuesToUpdate
    }
  })

  const updatedItems = await fetch(process.env.NEXT_PUBLIC_PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: updateLineItemsMutation(updatedItemsIndexes),
      variables
    })
  })

  const response: updateLineItemsResponse = await updatedItems.json()

  if (response.data !== undefined) {
    return {
      success: true
    }
  } else {
    if (response.errors !== undefined) {
      return { success: false, errors: response.errors }
    }
    return { success: false, errors: [] }
  }
}

export default updateItemInDB
