// ----- external modules ----- //
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies/types'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import ReceiptsContainer from './receiptsContainer'
import Fallback from '@/app/protected/fallback'

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

    const receiptsDataForUser = await fetch(process.env.PGQL_URL, {
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

  return (
    <Suspense fallback={<Fallback />}>
      <ReceiptsContainer receipts={receipts} />
    </Suspense>
  )
}
