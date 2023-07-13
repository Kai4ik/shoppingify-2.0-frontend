// ----- internal modules ----- //

// components
import GeneralReceiptsStatsCcp from './ccp'

// types
import { ReceiptsGeneralStatsPgql } from '@/common/types/pgql_types'

// server actions
import { getData } from './action'

interface Props {
  username: string
}

export default async function GeneralReceiptsStatsScp (
  props: Props
): Promise<JSX.Element> {
  const data = await getData(props.username, 'All')

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const receiptsGeneralStatsData: ReceiptsGeneralStatsPgql = data.payload

    return (
      <GeneralReceiptsStatsCcp
        statsData={receiptsGeneralStatsData}
        username={props.username}
      />
    )
  }
}
