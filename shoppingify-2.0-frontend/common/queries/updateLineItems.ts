export const updateLineItemsMutation = (
  lineItemsIds: string[] | number[]
): string => {
  let mutation = 'mutation ('
  lineItemsIds.forEach((id, index) => {
    mutation += `$input_${index}: UpdateLineItemByIdInput!,`
    if (index === lineItemsIds.length - 1) mutation = mutation.slice(0, -1)
  })

  mutation += ') {'
  lineItemsIds.forEach((id, index) => {
    mutation += `updateLineItemById_${index}: updateLineItemById(input: $input_${index})`
    mutation += '{ lineItem { id }  }'
  })

  mutation += '}'
  return mutation
}
