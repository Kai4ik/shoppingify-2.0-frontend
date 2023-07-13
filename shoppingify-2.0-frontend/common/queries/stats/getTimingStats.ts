export const getTimingStatsQuery = (
  user: string,
  timerange: string
): string => {
  return `
          query timingStats {
            countbyweekday(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
                nodes {
                  weekday
                  numberoftimescount
                }
              }
              countbypurchasetime(userEmail: "${user}" timerange: { months: ${
    timerange === 'All' ? 0 : timerange
  } }) {
                nodes {
                  timeframe
                  numberoftimescount
                }
              }
          }
          `
}
