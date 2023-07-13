// ----- internal modules ----- //

// components

// server actions
import { getData } from './action'

// components
import MonthlyExpendituresChart from './monthlyItemCountChart'

interface Props {
  username: string
}

export default async function MonthlyItemsTotalScp (
  props: Props
): Promise<JSX.Element> {
  const data = await getData(props.username)

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const monthlyExpendituresData = data.payload.monthlyitemscount.nodes

    return <MonthlyExpendituresChart data={monthlyExpendituresData} />
  }
}
