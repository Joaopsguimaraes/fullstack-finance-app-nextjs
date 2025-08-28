export interface DashboardTransaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  icon: React.ReactNode
}

export interface DashboardStats {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}

export interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}
