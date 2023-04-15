import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyUser } from '@/utils/auth'

export default async function Home () {
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  let idToken = ''

  allCookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      idToken = cookie.value
    }
  })

  if (idToken.length === 0) {
    redirect('/login')
  }

  const ifLoggedIn = await verifyUser(idToken)

  const succcess: boolean = ifLoggedIn.succcess
  if (succcess) {
    redirect('/protected/dashboard')
  } else {
    redirect('/login')
  }
}
