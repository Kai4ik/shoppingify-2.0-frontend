// ----- internal modules ----- //
// types
import { LineItemPgql } from '@/common/types/pgql_types'
import { deleteLineItemInput } from '@/common/types/pgql_input_types'
import { deleteLineItemsResponse } from '@/common/types/pgql_response_types'
import { BaseFetchResponse } from '@/common/types/base_types'

// GraphQL queries
import { deleteLineItems } from '@/common/queries'

const deleteItemFromDB = async (
  deletedNodes: LineItemPgql[]
): Promise<BaseFetchResponse> => {
  const variables: deleteLineItemInput = {}
  deletedNodes.forEach((item: LineItemPgql, index) => {
    variables[`input_${index}`] = {
      id: item.id
    }
  })

  const deletedItems = await fetch(process.env.NEXT_PUBLIC_PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: deleteLineItems(deletedNodes.length),
      variables
    })
  })

  const response: deleteLineItemsResponse = await deletedItems.json()

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

export default deleteItemFromDB
