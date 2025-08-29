import type { Transaction } from '@/lib/schemas'
import { format } from 'date-fns'
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
    return format(
      typeof date === 'string' ? new Date(date) : date,
      'dd MM, yyyy'
    )
  }, [])

  return {
    getAccountDisplay,
    getTransactionIcon,
    formatDateDisplay,
  }
}
