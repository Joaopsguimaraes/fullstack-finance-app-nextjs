export interface CurrentMonthPeriod {
  startDate: string
  endDate: string
  year: number
  month: number
  monthName: string
}

export function getCurrentMonthPeriod(): CurrentMonthPeriod {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  const startDateISO = startDate.toISOString()
  const endDateISO = endDate.toISOString()
  const monthName = startDate.toLocaleString('pt-BR', { month: 'long' })

  return {
    startDate: startDateISO,
    endDate: endDateISO,
    year,
    month: month + 1,
    monthName,
  }
}

export function getMonthPeriod(
  year: number,
  month: number
): CurrentMonthPeriod {
  const adjustedMonth = month - 1
  const startDate = new Date(year, adjustedMonth, 1)
  const endDate = new Date(year, adjustedMonth + 1, 0)
  const startDateISO = startDate.toISOString()
  const endDateISO = endDate.toISOString()
  const monthName = startDate.toLocaleString('pt-BR', { month: 'long' })

  return {
    startDate: startDateISO,
    endDate: endDateISO,
    year,
    month,
    monthName,
  }
}

export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getCurrentMonthForAPI(): {
  startDate: string
  endDate: string
} {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  }
}
