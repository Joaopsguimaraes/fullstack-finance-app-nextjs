import { LoadingCard } from '@/components/ui/loading-states'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Transactions = dynamic(
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
      <Transactions />
    </Suspense>
  )
}
