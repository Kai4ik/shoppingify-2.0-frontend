// ----- external modules ----- //
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import ItemsContainer from './itemsContainer'

// GraphQL queries
import { getItemsForUserQuery } from '@/common/queries/getAllLineItems'

// types
import { LineItemPgql } from '@/common/types/pgql_types'
import { GetLineItemsResponse } from '@/common/types/pgql_response_types'

const getLineItemsData = async (
  cookies: RequestCookie[]
): Promise<{
  payload?: LineItemPgql[]
  errors?: Array<{ message: string }>
}> => {
  let username = ''

  cookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(cookie.value)))
    }
  })

  if (username.length > 0) {
    const receiptsDataForUser = await fetch(process.env.PGQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: getItemsForUserQuery(username)
      }),
      next: {
        revalidate: 15
      }
    })

    const result: GetLineItemsResponse = await receiptsDataForUser.json()

    if (result.data !== undefined) {
      return {
        payload: result.data.allLineItems.nodes
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
  return {
    errors: [
      {
        message:
          'You are not logged in. Please refresh the page and try again!'
      }
    ]
  }
}

export default async function ProductList (): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  const data = await getLineItemsData(allCookies)

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const lineItems: LineItemPgql[] = data.payload
    const uniqueLineItems = Array.from(
      new Map(
        lineItems.map((item) => [item.itemTitle.toLowerCase(), item])
      ).values()
    )
    return <ItemsContainer lineItems={uniqueLineItems} />
  }
}
