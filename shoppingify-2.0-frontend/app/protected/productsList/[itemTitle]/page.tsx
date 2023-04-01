// ----- external modules ----- //
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies/types'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import ItemContainer from './itemContainer'

// GraphQL queries
import { getSpecificItemInfo } from '@/common/queries'

// types
import { LineItemStatsPgql } from '@/common/types/pgql_types'

const getLineItemStats = async (
  cookies: RequestCookie[],
  itemTitle: string
) => {
  let username = ''

  cookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(cookie.value)))
    }
  })

  if (username.length > 0) {
    const getItemStatsQuery = getSpecificItemInfo(
      itemTitle.replaceAll('%20', ' ')
    )

    const receiptsDataForUser = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: getItemStatsQuery
      })
    })
    return await receiptsDataForUser.json()
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
  const lineItemStats: LineItemStatsPgql[] = data.data.allLineItems.nodes
  console.log(lineItemStats)

  return <ItemContainer lineItemStats={lineItemStats} />
}
