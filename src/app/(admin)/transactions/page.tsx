import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { LoadingCard } from '@/components/ui/loading-states'

const EnhancedTransactions = dynamic(
  () =>
    import('@/features/transactions/components/transactions').then(mod => ({
      default: mod.Transactions,
    })),
  {
    loading: () => <LoadingCard variant='skeleton' title='Transactions' />,
  }
)

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <LoadingCard variant='spinner' description='Loading transactions...' />
      }
    >
      <EnhancedTransactions />
    </Suspense>
  )
}
