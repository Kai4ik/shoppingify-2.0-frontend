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

export const stringDateIntoDateFormat = (date: string): Date => {
  const dateSplit = date.split('-')
  return new Date(
    parseInt(dateSplit[0]),
    parseInt(dateSplit[1]) - 1,
    parseInt(dateSplit[2])
  )
}
