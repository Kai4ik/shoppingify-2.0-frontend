export const createreceiptMutation = (): string => {
  return `mutation($input: CreateReceiptInput!) {
      createReceipt(input: $input) {
        receipt {
          receiptNumber
        }
      }
    }`
}
