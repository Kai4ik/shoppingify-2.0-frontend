// external modules
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies/types'

// ----- internal modules ----- //

// components
import InfoContainer from './infoContainer'
import Fallback from '@/app/protected/fallback'

const getUserInfo = async (
  cookies: RequestCookie[]
): Promise<jose.JWTPayload> => {
  let userInfo: jose.JWTPayload = {}

  cookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      userInfo = jose.decodeJwt(cookie.value)
    }
  })

  return userInfo
}

export default async function page (): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  const data = await getUserInfo(allCookies)
  return (
    <Suspense fallback={<Fallback />}>
      <InfoContainer userinfo={data} />
    </Suspense>
  )
}
