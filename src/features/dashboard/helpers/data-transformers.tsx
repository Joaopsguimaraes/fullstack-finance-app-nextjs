import { type DashboardStats, type DashboardTransaction } from '../types'
import { type IconName, getIcon } from '../constants/icons'
import {
  MOCK_DASHBOARD_STATS_DATA,
  MOCK_RECENT_TRANSACTIONS_DATA,
} from '../constants'

interface RawStatsData {
  title: string
  value: string
  change: number
  iconName: IconName
}

interface RawTransactionData {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  iconName: IconName
}

export function transformStatsData(rawData: RawStatsData[]): DashboardStats[] {
  return rawData.map(item => ({
    title: item.title,
    value: item.value,
    change: item.change,
    icon: getIcon(item.iconName),
  }))
}

export function transformTransactionData(
  rawData: RawTransactionData[]
): DashboardTransaction[] {
  return rawData.map(item => ({
    id: item.id,
    description: item.description,
    amount: item.amount,
    type: item.type,
    category: item.category,
    date: item.date,
    icon: getIcon(item.iconName),
  }))
}

// Pre-transformed data exports for convenience
export const MOCK_DASHBOARD_STATS = transformStatsData(
  MOCK_DASHBOARD_STATS_DATA
)
export const MOCK_RECENT_TRANSACTIONS = transformTransactionData(
  MOCK_RECENT_TRANSACTIONS_DATA
)
