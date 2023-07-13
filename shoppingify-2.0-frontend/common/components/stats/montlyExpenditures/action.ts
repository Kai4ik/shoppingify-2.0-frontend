'use server'

// ----- internal modules ----- //

// types
import { MonthlyExpendituresPgql } from '@/common/types/pgql_types'
import { GetMonthlyExpendituresResponse } from '@/common/types/pgql_response_types'

// GraphQL queries
import { getMonthlyExpendituresQuery } from '@/common/queries/stats/monthlyExpenditures'

export async function getData (username: string): Promise<{
  payload?: MonthlyExpendituresPgql
  errors?: Array<{ message: string }>
}> {
  const monthlyExpenditures = await fetch(process.env.PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: getMonthlyExpendituresQuery(username)
    }),
    next: {
      revalidate: 15
    }
  })
  const result: GetMonthlyExpendituresResponse =
    await monthlyExpenditures.json()

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
