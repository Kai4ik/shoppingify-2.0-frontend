// ----- external modules ----- //
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies/types'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import InsightsContainer from './insightsContainer'
import Fallback from '@/app/protected/fallback'

// GraphQL queries
import { getAllDataForSpecificUSer } from '@/common/queries'
import { FetchAllDataForSpecificUserResponse } from '@/common/types/fetch_json_types'

// types
import {
  LineItemPgql,
  ReceiptPgql,
  StatsPgql,
  LineItemGroupStatsPgql
} from '@/common/types/pgql_types'

const getLineItemsData = async (
  cookies: RequestCookie[]
): Promise<{
  payload?: {
    allLineItems: {
      nodes: LineItemPgql[]
      groupedAggregates: [LineItemGroupStatsPgql]
    }
    allReceipts: {
      nodes: ReceiptPgql[]
      aggregates: {
        max: {
          total: string
          numberOfItems: number
        }
        min: {
          total: string
          numberOfItems: number
        }
        distinctCount: {
          merchant: string
          receiptNumber: string
        }
        average: {
          total: string
          numberOfItems: string
        }
        sum: {
          total: string
        }
      }
    }
  }
  errors?: Array<{ message: string }>
}> => {
  let username = ''

  cookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(cookie.value)))
    }
  })

  if (username.length > 0) {
    const getItemsForUserQuery = getAllDataForSpecificUSer(username)

    const allDataForUser = await fetch(process.env.PGQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: getItemsForUserQuery
      })
    })
    const { data }: FetchAllDataForSpecificUserResponse =
      await allDataForUser.json()

    return data !== undefined
      ? {
          payload: data
        }
      : {
          errors: [
            {
              message: 'Error occured during fetch'
            }
          ]
        }
  }
  return {
    errors: [
      {
        message:
          'You are not logged in. Please refresh the page and try again!'
      }
    ]
  }
}

export default async function Stats (): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  const data = await getLineItemsData(allCookies)

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const lineItems: LineItemPgql[] = data.payload.allLineItems.nodes
    const lineItemsStatsData: [LineItemGroupStatsPgql] =
      data.payload.allLineItems.groupedAggregates
    const receipts: ReceiptPgql[] = data.payload.allReceipts.nodes
    const receiptsStatsData: StatsPgql = data.payload.allReceipts.aggregates

    return (
      <Suspense fallback={<Fallback />}>
        <InsightsContainer
          lineItems={lineItems}
          receipts={receipts}
          statsData={receiptsStatsData}
          lineItemsStatsData={lineItemsStatsData}
        />
      </Suspense>
    )
  }
}
