// ----- internal modules ----- //
// types
import { LineItemPgql } from '@/common/types/pgql_types'
import { deleteLineItemInput } from '@/common/types/pgql_input_types'

// GraphQL queries
import { deleteLineItems } from '@/common/queries'

const deleteItemFromDB = async (
  deletedNodes: LineItemPgql[]
): Promise<void> => {
  const variables: deleteLineItemInput = {}
  deletedNodes.forEach((item: LineItemPgql, index) => {
    variables[`input_${index}`] = {
      id: item.id
    }
  })

  const deletedItems = await fetch('http://localhost:5000/graphql', {
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
  // const response = await deletedItems.json();
  console.log(await deletedItems.json())
}

export default deleteItemFromDB
