import { Dashboard } from '@/features/dashboard'
import {
  MOCK_DASHBOARD_STATS,
  MOCK_RECENT_TRANSACTIONS,
} from '@/features/dashboard/helpers/data-transformers'

export default async function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS
  const recentTransactions = MOCK_RECENT_TRANSACTIONS

  return <Dashboard stats={stats} recentTransactions={recentTransactions} />
}
