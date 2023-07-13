// ----- internal modules ----- //

// components
import GeneralLineItemsStatsCcp from './ccp'

// types
import { LineItemsGeneralStatsPgql } from '@/common/types/pgql_types'

// server actions
import { getData } from './action'

interface Props {
  username: string
}

export default async function GeneralLineItemsStatsScp (
  props: Props
): Promise<JSX.Element> {
  const data = await getData(props.username, 'All')

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const lineItemsGeneralStatsData: LineItemsGeneralStatsPgql = data.payload

    return (
      <GeneralLineItemsStatsCcp
        statsData={lineItemsGeneralStatsData}
        username={props.username}
      />
    )
  }
}
