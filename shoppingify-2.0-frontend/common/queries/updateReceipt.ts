export const updateReceiptMutation = (): string => {
  let mutation =
    'mutation ($input: UpdateReceiptByReceiptNumberAndUserInput!) {'
  mutation +=
    'updateReceiptByReceiptNumberAndUser(input: $input) {receipt { receiptNumber }}}'
  return mutation
}
