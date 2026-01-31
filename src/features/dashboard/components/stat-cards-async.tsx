import { DashboardService, transformApiStatsData } from '@/features/dashboard'
import { StatCards } from './stat-cards'

export async function StatCardsAsync() {
  const dashboardData = await DashboardService.getDashboardData()
  const stats = transformApiStatsData(dashboardData.stats)

  return <StatCards stats={stats} />
}
