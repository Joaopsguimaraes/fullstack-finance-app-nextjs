import { ChartAsync } from '@/features/dashboard/components/chart-async'
import { ChartSkeleton } from '@/features/dashboard/components/chart-skeleton'
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header'
import { RecentTransactionsAsync } from '@/features/dashboard/components/recent-transactions-async'
import { RecentTransactionsSkeleton } from '@/features/dashboard/components/recent-transactions-skeleton'
import { StatCardsAsync } from '@/features/dashboard/components/stat-cards-async'
import { StatCardsSkeleton } from '@/features/dashboard/components/stat-cards-skeleton'
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <DashboardHeader />

      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCardsAsync />
      </Suspense>

      <div className='grid gap-6 md:grid-cols-2'>
        <Suspense fallback={<ChartSkeleton />}>
          <ChartAsync />
        </Suspense>

        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <RecentTransactionsAsync />
        </Suspense>
      </div>
    </div>
  )
}
