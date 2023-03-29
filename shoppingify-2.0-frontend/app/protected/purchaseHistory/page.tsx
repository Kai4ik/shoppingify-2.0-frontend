// ----- external modules ----- //
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies/types'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import ReceiptsContainer from './receiptsContainer'

// GraphQL queries
import { getReceiptsForUser } from '@/common/queries'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

const getReceiptsData = async (cookies: RequestCookie[]) => {
  let username = ''

  cookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(cookie.value)))
    }
  })

  if (username.length > 0) {
    const getReceiptsForUserQuery = getReceiptsForUser(username)

    const receiptsDataForUser = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: getReceiptsForUserQuery
      })
    })
    return await receiptsDataForUser.json()
  }
}

export default async function PurchaseHistory (): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  const data = await getReceiptsData(allCookies)
  const receipts: ReceiptPgql[] = data.data.allReceipts.nodes

  return <ReceiptsContainer receipts={receipts} />
}
