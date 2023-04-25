export const getLineItemQuery = (itemTitle: string, user: string): string => {
  return `
      query MyQuery {
        allLineItems(filter: {itemTitle: {equalToInsensitive: "${itemTitle}"}, user: {equalTo: "${user}"} }) {
            nodes {
              id
              price
              qty
              total
              unit
              itemTitle
              receiptByReceiptNumberAndUser {
                numberOfItems
                receiptNumber
                total
                purchaseDate
              }
            }
          }
      }
      `
}
