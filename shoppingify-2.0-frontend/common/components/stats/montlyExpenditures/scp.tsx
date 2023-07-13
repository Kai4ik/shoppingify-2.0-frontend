// ----- internal modules ----- //

// components

// server actions
import { getData } from './action'

// components
import MonthlyExpendituresChart from './monthlyExpendituresChart'

interface Props {
  username: string
}

export default async function MonthlyExpendituresScp (
  props: Props
): Promise<JSX.Element> {
  const data = await getData(props.username)

  if (data.payload == null) {
    return <p> Error occured </p>
  } else {
    const monthlyExpendituresData = data.payload.monthlyexpenditures.nodes

    return <MonthlyExpendituresChart data={monthlyExpendituresData} />
  }
}
