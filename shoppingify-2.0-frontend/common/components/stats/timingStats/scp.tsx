// ----- internal modules ----- //

// components
import TimingStatsCcp from './ccp'

// types
import { TimingStatsPgql } from '@/common/types/pgql_types'

// server actions
import { getData } from './action'

interface Props {
  username: string
}

export default async function TimingStatsScp (
  props: Props
): Promise<JSX.Element> {
  const data = await getData(props.username, 'All')

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const timingStatsData: TimingStatsPgql = data.payload

    return (
      <TimingStatsCcp statsData={timingStatsData} username={props.username} />
    )
  }
}
