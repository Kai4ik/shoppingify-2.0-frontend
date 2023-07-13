export const getReceiptsGeneralStatsQuery = (
  user: string,
  timerange: string
): string => {
  const today = new Date().toISOString().split('T')[0]
  const nMonthsAgo = new Date()

  if (timerange !== 'All') {
    nMonthsAgo.setMonth(nMonthsAgo.getMonth() - parseInt(timerange))
  }

  const timerangeFilter =
    timerange === 'All'
      ? `purchaseDate: {lessThanOrEqualTo: "${today}"}`
      : `purchaseDate: {lessThanOrEqualTo: "${today}", greaterThanOrEqualTo: "${
          nMonthsAgo.toISOString().split('T')[0]
        }"}`

  return `
        query receiptsGeneralStats {
            getmaxtotalreceipt(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
              nodes {
                receiptnumber
                total
                purchasedate
              }
            }
            getmintotalreceipt(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
              nodes {
                receiptnumber
                total
                purchasedate
              }
            }
            getmaxnumberofitems(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
              nodes {
                receiptnumber
                numberofitems
                purchasedate
              }
            }
            getminnumberofitems(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
              nodes {
                receiptnumber
                numberofitems
                purchasedate
              }
            }
            allReceipts(
              first: 1
              orderBy: PURCHASE_DATE_ASC
              filter: {user: {equalTo: "${user}"}, ${timerangeFilter}}) {
                nodes {
                  receiptNumber
                  purchaseDate
                }
                aggregates {
                  distinctCount {
                    receiptNumber
                    merchant
                  }
                  average {
                    total
                    numberOfItems
                  }
                  sum {
                    tax
                    total
                  }
                }
            }      
        }
        `
}
