import type { Transaction } from '@/lib/schemas'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { useCallback } from 'react'

export function useTransactionsTable() {
  const getAccountDisplay = useCallback((transaction: Transaction) => {
    if (transaction.bankAccount) {
      return {
        name: transaction.bankAccount.name,
        type: transaction.bankAccount.type,
      }
    }

    return {
      name: 'Unknown Account',
      type: 'CHECKING',
    }
  }, [])

  const getTransactionIcon = useCallback((type: string) => {
    return type === 'INCOME' ? (
      <ArrowUpIcon className='h-4 w-4 text-green-600' />
    ) : (
      <ArrowDownIcon className='h-4 w-4 text-red-600' />
    )
  }, [])

  const formatDateDisplay = useCallback((date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }, [])

  return {
    getAccountDisplay,
    getTransactionIcon,
    formatDateDisplay,
  }
}
