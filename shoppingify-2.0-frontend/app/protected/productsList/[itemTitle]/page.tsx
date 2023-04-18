// ----- external modules ----- //
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies/types'
import urlencode from 'urlencode'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import ItemContainer from './itemContainer'
import Fallback from '@/app/protected/fallback'

// GraphQL queries
import { getSpecificItemInfo } from '@/common/queries'

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'
import { FetchLineItemsResponse } from '@/common/types/fetch_json_types'

const getLineItemStats = async (
  cookies: RequestCookie[],
  itemTitle: string
): Promise<{
  payload?: LineItemStatsPgql[]
  errors?: Array<{ message: string }>
}> => {
  let username = ''

  cookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(cookie.value)))
    }
  })

  const decodedTitle = urlencode.decode(itemTitle)

  if (username.length > 0) {
    const getItemStatsQuery = getSpecificItemInfo(
      decodedTitle.replace('"', '\\"'),
      username
    )

    const lineItemData = await fetch(process.env.PGQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: getItemStatsQuery
      })
    })
    const { data }: FetchLineItemsResponse = await lineItemData.json()

    return data !== undefined
      ? {
          payload: data.allLineItems.nodes
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

interface Props {
  params: {
    itemTitle: string
  }
}

export default async function ItemStats ({
  params
}: Props): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  const data = await getLineItemStats(allCookies, params.itemTitle)

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const lineItemStats: LineItemStatsPgql[] = data.payload
    return (
      <Suspense fallback={<Fallback />}>
        <ItemContainer lineItemStats={lineItemStats} />
      </Suspense>
    )
  }
}
