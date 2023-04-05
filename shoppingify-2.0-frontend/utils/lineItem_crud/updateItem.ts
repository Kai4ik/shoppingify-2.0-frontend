// ----- internal modules ----- //
// types
import { UpdateLineItemPgql, ReceiptPgql } from '@/common/types/pgql_types'
import { updateLineItemInput } from '@/common/types/pgql_input_types'

// GraphQL queries
import { updateLineItems } from '@/common/queries'

const updateItemInDB = async (
  updatedNodes: {
    [key: number]: UpdateLineItemPgql
  },
  receipt: ReceiptPgql
): Promise<void> => {
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

  await fetch(process.env.NEXT_PUBLIC_PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: updateLineItems(updatedItemsIndexes),
      variables
    })
  })
}

export default updateItemInDB
