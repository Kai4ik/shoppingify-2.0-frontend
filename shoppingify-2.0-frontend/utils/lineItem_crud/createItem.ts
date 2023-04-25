// ----- internal modules ----- //
import { getUsernameFromCookies } from '../auth'

// types
import { CreateLineItemPgql } from '@/common/types/pgql_types'
import { createLineItemInput } from '@/common/types/pgql_input_types'
import { createLineItemsResponse } from '@/common/types/pgql_response_types'
import { BaseFetchResponse } from '@/common/types/base_types'

// GraphQL queries
import { createLineItemsMutation } from '@/common/queries/createLineItems'

const addItemToDB = async (
  newNodes: CreateLineItemPgql[],
  receiptNumber: number
): Promise<BaseFetchResponse> => {
  const username = getUsernameFromCookies()

  const variables: createLineItemInput = {}
  newNodes.forEach((newLineItem: CreateLineItemPgql, index: number) => {
    variables[`input_${index}`] = {
      lineItem: {
        itemTitle: newLineItem.itemTitle,
        price: newLineItem.price,
        qty: newLineItem.qty,
        unit: newLineItem.unit,
        total: newLineItem.total,
        receiptNumber,
        user: username
      }
    }
  })

  const createdItems = await fetch(process.env.NEXT_PUBLIC_PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: createLineItemsMutation(newNodes),
      variables
    })
  })

  const response: createLineItemsResponse = await createdItems.json()

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

export default addItemToDB
