/* eslint-disable sort-imports */
import type { TransactionCategory } from '@/lib/schemas'

import { getIcon, type IconName } from '../constants/icons'
import { type DashboardStats, type DashboardTransaction } from '../types'

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

function getCategoryIcon(category: TransactionCategory | string): IconName {
  const categoryIconMap: Record<string, IconName> = {
    FOOD: 'ShoppingCart',
    TRANSPORT: 'Car',
    ENTERTAINMENT: 'MoreHorizontal',
    UTILITIES: 'Zap',
    HEALTH: 'Heart',
    EDUCATION: 'BookOpen',
    DEBTS: 'CreditCard',
    SALARY: 'DollarSign',
    FREELANCE: 'Receipt',
    INVESTMENTS: 'TrendingUp',
    OTHER: 'MoreHorizontal',
  }

  return categoryIconMap[category] || 'MoreHorizontal'
}

function getStatIcon(title: string): IconName {
  const statIconMap: Record<string, IconName> = {
    'Total Balance': 'DollarSign',
    'Monthly Income': 'TrendingUp',
    'Monthly Expenses': 'TrendingDown',
    'Savings Rate': 'CreditCard',
  }

  return statIconMap[title] || 'DollarSign'
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

export function transformApiStatsData(
  statsData: Omit<DashboardStats, 'icon'>[]
): DashboardStats[] {
  return statsData.map(stat => ({
    ...stat,
    icon: getIcon(getStatIcon(stat.title)),
  }))
}

export function transformApiTransactionData(
  transactionsData: Omit<DashboardTransaction, 'icon'>[]
): DashboardTransaction[] {
  return transactionsData.map(transaction => ({
    ...transaction,
    icon: getIcon(getCategoryIcon(transaction.category)),
  }))
}
