'use client'

import { type MonthlyData } from '../services/chart-data-service'
import { type DashboardStats, type DashboardTransaction } from '../types'
import { DashboardHeader } from './dashboard-header'
import { IncomeExpenseChart } from './income-expense-chart'
import { RecentTransactions } from './recent-transactions'
import { StatCards } from './stat-cards'

interface DashboardProps {
  stats: DashboardStats[]
  recentTransactions: DashboardTransaction[]
  chartData: MonthlyData[]
}

export function Dashboard({
  stats,
  recentTransactions,
  chartData,
}: DashboardProps) {
  return (
    <div className='space-y-6'>
      <DashboardHeader />
      <StatCards stats={stats} />
      <div className='grid gap-6 md:grid-cols-2'>
        <IncomeExpenseChart data={chartData} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  )
}
