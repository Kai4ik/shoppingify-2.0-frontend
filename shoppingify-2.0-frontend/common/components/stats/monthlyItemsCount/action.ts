'use server'

// ----- internal modules ----- //

// types
import { GetMonthlyItemsCountResponse } from '@/common/types/pgql_response_types'

// GraphQL queries
import { getMonthlyItemsCountQuery } from '@/common/queries/stats/monthlyItemsCount'

export async function getData (username: string) {
  const monthlyExpenditures = await fetch(process.env.PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: getMonthlyItemsCountQuery(username)
    }),
    next: {
      revalidate: 15
    }
  })
  const result: GetMonthlyItemsCountResponse = await monthlyExpenditures.json()

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
