// external modules
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// ----- internal modules ----- //

// components
import InfoContainer from './infoContainer'

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
  return <InfoContainer userinfo={data} />
}
