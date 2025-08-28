import { DASHBOARD_CONFIG } from '../constants'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(DASHBOARD_CONFIG.LOCALE, {
    style: 'currency',
    currency: DASHBOARD_CONFIG.CURRENCY,
  }).format(Math.abs(amount))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(DASHBOARD_CONFIG.LOCALE, {
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateLong(dateString: string): string {
  return new Date(dateString).toLocaleDateString(DASHBOARD_CONFIG.LOCALE, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
