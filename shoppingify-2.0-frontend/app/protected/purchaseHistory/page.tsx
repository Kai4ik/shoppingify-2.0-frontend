// ----- external modules ----- //
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import ReceiptsContainer from './receiptsContainer'
import Fallback from '@/app/protected/fallback'

// GraphQL queries
import { getReceiptsForUserQuery } from '@/common/queries/getAllReceipts'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'
import { GetReceiptsResponse } from '@/common/types/pgql_response_types'

const getReceiptsData = async (
  cookies: RequestCookie[]
): Promise<{
  payload?: ReceiptPgql[]
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
        query: getReceiptsForUserQuery(username)
      }),
      next: {
        revalidate: 15
      }
    })

    const result: GetReceiptsResponse = await receiptsDataForUser.json()

    if (result.data !== undefined) {
      return {
        payload: result.data.allReceipts.nodes
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

export default async function PurchaseHistory (): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  const data = await getReceiptsData(allCookies)

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const receipts: ReceiptPgql[] = data.payload
    return (
      <Suspense fallback={<Fallback />}>
        <ReceiptsContainer receipts={receipts} />
      </Suspense>
    )
  }
}
