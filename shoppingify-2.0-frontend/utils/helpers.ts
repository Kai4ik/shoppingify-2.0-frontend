// ----- internal modules ----- //

// types
import { ReceiptPgql } from '@/common/types/pgql_types'

export const getMonthsNames = (total: number): string[] => {
  const today = new Date()
  const months: string[] = []

  for (let i = 0; i < total; i++) {
    const month = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    ).toLocaleString('default', { month: 'long', year: 'numeric' })
    months.push(month)
  }
  return months
}

export const dateIntoMonthYearString = (date: string): string => {
  const purchaseDate = new Date(date)
  purchaseDate.setDate(purchaseDate.getDate() + 1)

  return `${purchaseDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  })}`
}

export const stringDateIntoDateFormat = (date: string): Date => {
  const dateSplit = date.split('-')
  return new Date(
    parseInt(dateSplit[0]),
    parseInt(dateSplit[1]) - 1,
    parseInt(dateSplit[2])
  )
}

export const getReceiptByTotal = (
  total: string,
  receipts: ReceiptPgql[]
): ReceiptPgql => {
  const index = receipts.findIndex(
    (receipt: ReceiptPgql) => receipt.total === total
  )
  return receipts[index]
}
