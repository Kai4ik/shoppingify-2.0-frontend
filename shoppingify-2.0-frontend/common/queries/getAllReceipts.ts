export const getReceiptsForUserQuery = (user: string): string => {
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
