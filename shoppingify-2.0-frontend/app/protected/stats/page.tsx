// ----- external modules ----- //
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies/types'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import InsightsContainer from './insightsContainer'

// GraphQL queries
import { getAllDataForSpecificUSer } from '@/common/queries'

// types
import {
  LineItemPgql,
  ReceiptPgql,
  StatsPgql,
  LineItemGroupStatsPgql
} from '@/common/types/pgql_types'

const getLineItemsData = async (cookies: RequestCookie[]) => {
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
    return await allDataForUser.json()
  }
}

export default async function Stats (): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  const data = await getLineItemsData(allCookies)
  const lineItems: LineItemPgql[] = data.data.allLineItems.nodes
  const receipts: ReceiptPgql[] = data.data.allReceipts.nodes
  const statsData: StatsPgql = data.data.allReceipts.aggregates
  const lineItemsStatsData: [LineItemGroupStatsPgql] =
    data.data.allLineItems.groupedAggregates
  return (
    <InsightsContainer
      lineItems={lineItems}
      receipts={receipts}
      statsData={statsData}
      lineItemsStatsData={lineItemsStatsData}
    />
  )
}
