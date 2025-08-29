import {
  MOCK_DASHBOARD_STATS,
  MOCK_RECENT_TRANSACTIONS,
} from '@/features/dashboard/helpers/data-transformers'
import dynamic from 'next/dynamic'
import { LoadingCard } from '../../../components/ui/loading-states'

const Dashboard = dynamic(
  () =>
    import('@/features/dashboard').then(mod => ({
      default: mod.Dashboard,
    })),
  {
    loading: () => <LoadingCard variant='spinner' title='Dashboard' />,
  }
)

export default async function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS
  const recentTransactions = MOCK_RECENT_TRANSACTIONS

  return <Dashboard stats={stats} recentTransactions={recentTransactions} />
}
