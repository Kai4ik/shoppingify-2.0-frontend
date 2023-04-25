export const getReceiptByNumberAndUserQuery = (
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
