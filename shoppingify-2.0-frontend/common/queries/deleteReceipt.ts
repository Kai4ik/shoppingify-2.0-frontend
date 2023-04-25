export const deleteReceiptMutation = (): string => {
  return `mutation($input: DeleteReceiptByReceiptNumberAndUserInput!) {
      deleteReceiptByReceiptNumberAndUser(input: $input) {
        receipt {
          receiptNumber
        }
      }
    }`
}
