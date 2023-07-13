'use server'

// ----- internal modules ----- //

// types
import { ReceiptsGeneralStatsPgql } from '@/common/types/pgql_types'
import { GetReceiptsGeneralStatsResponse } from '@/common/types/pgql_response_types'

// GraphQL queries
import { getReceiptsGeneralStatsQuery } from '@/common/queries/stats/getReceiptsAggregates'

export async function getData (
  username: string,
  sortOption: string
): Promise<{
    payload?: ReceiptsGeneralStatsPgql
    errors?: Array<{ message: string }>
  }> {
  const receiptsGeneralStatsData = await fetch(process.env.PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: getReceiptsGeneralStatsQuery(username, sortOption)
    }),
    next: {
      revalidate: 15
    }
  })
  const result: GetReceiptsGeneralStatsResponse =
    await receiptsGeneralStatsData.json()

  if (result.data !== undefined) {
    return {
      payload: result.data
    }
  } else {
    if (result.errors !== undefined) {
      return { errors: result.errors }
    }
    return {
      errors: [
        {
          message: 'Unknown error occured during fetch'
        }
      ]
    }
  }
}
