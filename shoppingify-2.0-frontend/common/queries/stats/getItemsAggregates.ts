export const getLineItemsGeneralStatsQuery = (
  user: string,
  timerange: string
): string => {
  return `
          query lineItemsGeneralStats {
            getcheapestitem(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
              nodes {
                itemtitle
                price
              }
            }
            getmostexpensiveitem(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
              nodes {
                itemtitle
                price
              }
            }
            getmostspendonitem(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
              nodes {
                itemtitle
                totalsum
              }
            }
            getmostpurchaseditem(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
              nodes {
                itemtitle
                totalcount
              }
            }      

          countbynumberofitems(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
            nodes {
              countcategory
              numberofitemscount
            }
          }
        }
          `
}
