export const deleteLineItemsMutation = (lineItemsTotal: number): string => {
  let mutation = 'mutation ('
  for (let k = 0; k < lineItemsTotal; k++) {
    mutation += `$input_${k}: DeleteLineItemByIdInput!,`
    if (k === lineItemsTotal) mutation = mutation.slice(0, -1)
  }

  mutation += ') {'
  for (let k = 0; k < lineItemsTotal; k++) {
    mutation += `deleteLineItemById_${k}: deleteLineItemById(input: $input_${k})`
    mutation += '{ deletedLineItemId }'
  }

  mutation += '}'
  return mutation
}
