export const getMonthlyItemsCountQuery = (user: string): string => {
  return `
          query monthlyItemsCount {
             monthlyitemscount(userEmail: "${user}") {
                  nodes {
                      monthname
                      monthlyitemstotal
                  }
              }
          }
      `
}
