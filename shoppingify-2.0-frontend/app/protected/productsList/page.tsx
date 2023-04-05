// ----- external modules ----- //
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies/types'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import ItemsContainer from './itemsContainer'

// GraphQL queries
import { getItemsForUser } from '@/common/queries'

// types
import { LineItemPgql } from '@/common/types/pgql_types'

const getLineItemsData = async (cookies: RequestCookie[]) => {
  let username = ''

  cookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(cookie.value)))
    }
  })

  if (username.length > 0) {
    const getItemsForUserQuery = getItemsForUser(username)

    const receiptsDataForUser = await fetch(process.env.PGQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: getItemsForUserQuery
      })
    })
    return await receiptsDataForUser.json()
  }
}

export default async function ProductList (): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  const data = await getLineItemsData(allCookies)
  const lineItems: LineItemPgql[] = data.data.allLineItems.nodes
  const uniqueLineItems = Array.from(
    new Map(lineItems.map((item) => [item.itemTitle, item])).values()
  )

  return <ItemsContainer lineItems={uniqueLineItems} />
}
