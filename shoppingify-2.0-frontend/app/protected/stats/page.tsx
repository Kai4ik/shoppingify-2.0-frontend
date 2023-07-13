// ----- external modules ----- //
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { Suspense } from 'react'

// ----- internal modules ----- //
import { getUsername } from '@/utils/auth'

// components
import GeneralReceiptsStatsScp from '@/common/components/stats/receiptsGeneralStats/scp'
import GeneralLineItemsStatsScp from '@/common/components/stats/itemsGeneralStats/scp'
import MonthlyExpendituresScp from '@/common/components/stats/montlyExpenditures/scp'
import MonthlyItemsTotalScp from '@/common/components/stats/monthlyItemsCount/scp'
import TimingStatsScp from '@/common/components/stats/timingStats/scp'
import Fallback from '@/app/protected/fallback'

export default async function Stats (): Promise<JSX.Element> {
  const cookieStore = cookies()

  const allCookies = cookieStore.getAll()
  let username = ''

  allCookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(cookie.value)))
    }
  })

  /*
   <NoDataCp
          heading="Your Stats"
          subheading="No Purchases yet"
          link="Add new receipt?"
    />
  */

  if (username.length > 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingTop: '5%',
          rowGap: '60px'
        }}
      >
        <Suspense fallback={<Fallback />}>
          {/* @ts-expect-error Async Server Component */}
          <GeneralReceiptsStatsScp username={username} />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          {/* @ts-expect-error Async Server Component */}
          <GeneralLineItemsStatsScp username={username} />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          {/* @ts-expect-error Async Server Component */}
          <MonthlyExpendituresScp username={username} />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          {/* @ts-expect-error Async Server Component */}
          <MonthlyItemsTotalScp username={username} />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          {/* @ts-expect-error Async Server Component */}
          <TimingStatsScp username={username} />
        </Suspense>
      </div>
    )
  } else {
    return (
      <p> You are not logged in. Please refresh the page and try again! </p>
    )
  }
}
