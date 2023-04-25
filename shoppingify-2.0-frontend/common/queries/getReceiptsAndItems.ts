export const getReceiptsAndLineItemsForUserQuery = (user: string): string => {
  return `
      query MyQuery {
          allReceipts(filter: {user: {equalTo: "${user}"}} orderBy: PURCHASE_DATE_ASC) {
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
              }
              aggregates {
                max {
                  total
                  numberOfItems
                }
                min {
                  total
                  numberOfItems
                }
                distinctCount {
                  merchant
                  receiptNumber
                }
                average {
                  total
                  numberOfItems
                }
                sum {
                  total
                }
              }
          }
  
          allLineItems(filter: {user: {equalTo: "${user}"}}) {
            nodes {
              id
              price
              qty
              total
              unit
              itemTitle
            }
            groupedAggregates(groupBy: ITEM_TITLE) {
              sum {
                total          
              }
              keys
            }
          }
      }
      `
}
