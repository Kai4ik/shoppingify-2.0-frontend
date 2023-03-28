import { LineItemPgql } from './types/pgql_types'

export const getReceiptsForUser = (user: string): string => {
  return `
    query MyQuery {
        allReceipts(filter: {user: {equalTo: "${user}"}} orderBy: PURCHASE_DATE_DESC) {
            nodes {
                currency
                id
                merchant
                numberOfItems
                purchaseDate
                purchaseTime
                receiptNumber
                subtotal
                total
                tax
                lineItemsByReceiptNumberAndUser {
                    nodes {
                      id
                      itemTitle
                      price
                      qty
                      total
                      unit
                    }
                }
            }
        }
    }
    `
}

export const getReceiptByNumberAndUser = (
  user: string,
  receiptNumber: number
): string => {
  return `
      query MyQuery {
        receiptByReceiptNumberAndUser(receiptNumber: ${receiptNumber}, user: "${user}") {
            currency
            merchant
            purchaseDate
            purchaseTime
            receiptNumber
            subtotal
            tax
            total
            id
            numberOfItems
            lineItemsByReceiptNumberAndUser {
                nodes {
                  itemTitle
                  price
                  qty
                  total
                  unit
                  id
                }
              }
          }
      }
      `
}

export const deleteLineItems = (lineItemsTotal: number): string => {
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

export const createLineItems = (lineItems: LineItemPgql[]): string => {
  let mutation = 'mutation ('
  lineItems.forEach((id, index) => {
    mutation += `$input_${index}: CreateLineItemInput!,`
    if (index === lineItems.length - 1) mutation = mutation.slice(0, -1)
  })

  mutation += ') {'
  lineItems.forEach((id, index) => {
    mutation += `createLineItem_${index}: createLineItem(input: $input_${index})`
    mutation += '{ clientMutationId }'
  })

  mutation += '}'
  return mutation
}

export const updateLineItems = (lineItemsIds: string[] | number[]): string => {
  let mutation = 'mutation ('
  lineItemsIds.forEach((id, index) => {
    mutation += `$input_${index}: UpdateLineItemByIdInput!,`
    if (index === lineItemsIds.length - 1) mutation = mutation.slice(0, -1)
  })

  mutation += ') {'
  lineItemsIds.forEach((id, index) => {
    mutation += `updateLineItemById_${index}: updateLineItemById(input: $input_${index})`
    mutation += '{ clientMutationId }'
  })

  mutation += '}'
  return mutation
}

export const updateReceipt = (): string => {
  let mutation =
    'mutation ($input: UpdateReceiptByReceiptNumberAndUserInput!) {'
  mutation +=
    'updateReceiptByReceiptNumberAndUser(input: $input) {clientMutationId}}'
  return mutation
}
