export const getItemsForUserQuery = (user: string): string => {
  return `
      query MyQuery {
        allLineItems(filter: {user: {equalTo: "${user}"}}) {
            nodes {
              id
              price
              qty
              total
              unit
              itemTitle
            }
          }
      }
      `
}
