import type { IconName } from '../constants/icons'

export interface DashboardTransaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  iconName: IconName
}

export interface DashboardStats {
  title: string
  value: string
  iconName: IconName
}

export interface StatCardProps {
  title: string
  value: string
  iconName: IconName
}
