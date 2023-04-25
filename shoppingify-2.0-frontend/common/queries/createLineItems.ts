import { CreateLineItemPgql } from '../types/pgql_types'

export const createLineItemsMutation = (
  lineItems: CreateLineItemPgql[]
): string => {
  let mutation = 'mutation ('
  lineItems.forEach((id, index) => {
    mutation += `$input_${index}: CreateLineItemInput!,`
    if (index === lineItems.length - 1) mutation = mutation.slice(0, -1)
  })

  mutation += ') {'
  lineItems.forEach((id, index) => {
    mutation += `createLineItem_${index}: createLineItem(input: $input_${index})`
    mutation += '{ lineItem { id } }'
  })

  mutation += '}'
  return mutation
}
