import {
  DashboardService,
  transformApiTransactionData,
} from '@/features/dashboard'
import { RecentTransactions } from './recent-transactions'

export async function RecentTransactionsAsync() {
  const dashboardData = await DashboardService.getDashboardData()
  const recentTransactions = transformApiTransactionData(
    dashboardData.recentTransactions
  )

  return <RecentTransactions transactions={recentTransactions} />
}
