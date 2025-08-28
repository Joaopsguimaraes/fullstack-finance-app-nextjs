'use client'

import { formatCurrency } from '@/lib/utils'
import { useListTransactions } from '@/features/transactions/hooks/use-list-transactions'
import { useTransactionFilters } from '@/features/transactions/hooks/use-transaction-filters'
import { useMemo } from 'react'

export function ResultsSummary() {
  const { filters } = useTransactionFilters()
  const { data } = useListTransactions(filters)
  const startIndex = data ? (data?.page - 1) * data?.limit : 0
  const endIndex = data ? startIndex + data.transactions.length : 0

  const totalAmount = useMemo(
    () =>
      data?.transactions.reduce(
        (sum, t) =>
          sum + (t.type === 'INCOME' ? Number(t.amount) : Number(-t.amount)),
        0
      ),
    [data]
  )

  return (
    <div className='text-muted-foreground flex items-center justify-between text-sm'>
      <span>
        Showing {startIndex + 1}-{endIndex} of {data?.total} transactions
      </span>
      <span>Total: {formatCurrency(totalAmount ?? 0)}</span>
    </div>
  )
}
