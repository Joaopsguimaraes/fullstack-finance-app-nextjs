import {
  DashboardService,
  transformApiStatsData,
  transformApiTransactionData,
} from '@/features/dashboard'
import dynamic from 'next/dynamic'

const Dashboard = dynamic(() =>
  import('@/features/dashboard').then(mod => ({
    default: mod.Dashboard,
  }))
)

export default async function DashboardPage() {
  const dashboardData = await DashboardService.getDashboardData()

  const stats = transformApiStatsData(dashboardData.stats)
  const recentTransactions = transformApiTransactionData(
    dashboardData.recentTransactions
  )

  return (
    <Dashboard
      stats={stats}
      recentTransactions={recentTransactions}
      chartData={dashboardData.chartData}
    />
  )
}
