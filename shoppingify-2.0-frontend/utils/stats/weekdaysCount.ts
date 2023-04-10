// ----- internal modules ----- //
import { getMonthsNames, dateIntoMonthYearString } from '../helpers'

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

const calcWeekdaysCount = (
  receipts: ReceiptPgql[],
  months: number
): Array<{ weekday: string, number: number }> => {
  const labels: string[] = getMonthsNames(months)

  let monday = 0
  let tuesday = 0
  let wednesday = 0
  let thursday = 0
  let friday = 0
  let saturday = 0
  let sunday = 0

  receipts.forEach((receipt: ReceiptPgql) => {
    const monthYearString = dateIntoMonthYearString(receipt.purchaseDate)
    if (labels.some((label: string) => monthYearString === label)) {
      const purchaseDate = new Date(receipt.purchaseDate)
      purchaseDate.setDate(purchaseDate.getDate() + 1)
      const weekday = purchaseDate.getDay()
      switch (weekday) {
        case 0:
          sunday++
          break
        case 1:
          monday++
          break
        case 2:
          tuesday++
          break
        case 3:
          wednesday++
          break
        case 4:
          thursday++
          break
        case 5:
          friday++
          break
        case 6:
          saturday++
      }
    }
  })

  return [
    { weekday: 'Monday', number: monday },
    { weekday: 'Tuesday', number: tuesday },
    { weekday: 'Wednesday', number: wednesday },
    { weekday: 'Thursday', number: thursday },
    { weekday: 'Friday', number: friday },
    { weekday: 'Saturday', number: saturday },
    { weekday: 'Sunday', number: sunday }
  ]
}

export default calcWeekdaysCount
