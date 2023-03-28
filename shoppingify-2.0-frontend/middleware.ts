import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyUser } from './utils/auth'
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies'

export default async function middleware (
  req: NextRequest
): Promise<NextResponse> {
  const cookies = req.cookies.getAll()
  let idToken = ''
  cookies.forEach((cookie: RequestCookie) => {
    const ifIdTokenCookie: boolean = cookie.name.includes('idToken')
    if (ifIdTokenCookie) idToken = cookie.value
  })

  if (idToken.length === 0) {
    req.nextUrl.pathname = '/login'
    return NextResponse.redirect(req.nextUrl)
  }

  const ifLoggedIn = await verifyUser(idToken)
  if (ifLoggedIn.succcess) {
    return NextResponse.next()
  }

  req.nextUrl.pathname = '/login'
  return NextResponse.redirect(req.nextUrl)
}

export const config = {
  matcher: '/protected/:path*'
}
