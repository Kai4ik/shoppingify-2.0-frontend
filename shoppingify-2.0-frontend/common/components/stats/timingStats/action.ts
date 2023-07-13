'use server'

// ----- internal modules ----- //

// types
import { GetTimingStatsResponse } from '@/common/types/pgql_response_types'

// GraphQL queries
import { getTimingStatsQuery } from '@/common/queries/stats/getTimingStats'

// types
import { TimingStatsPgql } from '@/common/types/pgql_types'

export async function getData (
  username: string,
  sortOption: string
): Promise<{
    payload?: TimingStatsPgql
    errors?: Array<{ message: string }>
  }> {
  const timingStatsData = await fetch(process.env.PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: getTimingStatsQuery(username, sortOption)
    }),
    next: {
      revalidate: 15
    }
  })
  const result: GetTimingStatsResponse = await timingStatsData.json()

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
