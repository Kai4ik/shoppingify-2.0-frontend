'use server'

// ----- internal modules ----- //

// types
import { GetLineItemsGeneralStatsResponse } from '@/common/types/pgql_response_types'

// GraphQL queries
import { getLineItemsGeneralStatsQuery } from '@/common/queries/stats/getItemsAggregates'

// types
import { LineItemsGeneralStatsPgql } from '@/common/types/pgql_types'

export async function getData (
  username: string,
  sortOption: string
): Promise<{
    payload?: LineItemsGeneralStatsPgql
    errors?: Array<{ message: string }>
  }> {
  const lineItemssGeneralStatsData = await fetch(process.env.PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: getLineItemsGeneralStatsQuery(username, sortOption)
    }),
    next: {
      revalidate: 15
    }
  })
  const result: GetLineItemsGeneralStatsResponse =
    await lineItemssGeneralStatsData.json()

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
