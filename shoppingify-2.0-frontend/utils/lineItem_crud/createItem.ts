// ----- internal modules ----- //
import { getUsernameFromCookies } from '../auth'

// types
import { LineItemPgql } from '@/common/types/pgql_types'
import { createLineItemInput } from '@/common/types/pgql_input_types'

// GraphQL queries
import { createLineItems } from '@/common/queries'

const addItemToDB = async (
  newNodes: LineItemPgql[],
  receiptNumber: number
): Promise<void> => {
  const username = getUsernameFromCookies()

  const variables: createLineItemInput = {}
  newNodes.forEach((newLineItem: LineItemPgql, index: number) => {
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

  const createdItems = await fetch('http://localhost:5000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: createLineItems(newNodes),
      variables
    })
  })
  // const response = await createdItems.json();
  console.log(await createdItems.json())
}

export default addItemToDB
