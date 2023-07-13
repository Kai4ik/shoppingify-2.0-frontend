export const getMonthlyExpendituresQuery = (user: string): string => {
  return `
        query monthlyExpenditures {
            monthlyexpenditures(userEmail: "${user}") {
                nodes {
                    monthname
                    monthlytotal
                }
            }
        }
    `
}
