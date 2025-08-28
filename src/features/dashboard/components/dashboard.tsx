import { DashboardHeader } from './dashboard-header'
import { StatCards } from './stat-cards'
import { RecentTransactions } from './recent-transactions'
import { type DashboardStats, type DashboardTransaction } from '../types'

interface DashboardProps {
  stats: DashboardStats[]
  recentTransactions: DashboardTransaction[]
}

export function Dashboard({ stats, recentTransactions }: DashboardProps) {
  return (
    <div className='space-y-6'>
      <DashboardHeader />
      <StatCards stats={stats} />
      <RecentTransactions transactions={recentTransactions} />
    </div>
  )
}
