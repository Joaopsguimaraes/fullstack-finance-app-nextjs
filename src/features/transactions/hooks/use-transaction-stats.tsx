import { useMemo } from 'react'
import { useListTransactions } from './use-list-transactions'
import { useTransactionFilters } from './use-transaction-filters'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'

export function useTransactionStats() {
  const { filters } = useTransactionFilters()
  const { data } = useListTransactions(filters)
  const transactions = useMemo(() => data?.transactions || [], [data])

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const balance = income - expenses
    const totalTransactions = transactions.length

    return {
      income,
      expenses,
      balance,
      totalTransactions,
    }
  }, [transactions])

  const statCards = [
    {
      title: 'Total Income',
      value: formatCurrency(stats.income),
      icon: <TrendingUp className='h-4 w-4' />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.expenses),
      icon: <TrendingDown className='h-4 w-4' />,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Net Balance',
      value: formatCurrency(Math.abs(stats.balance)),
      icon: <DollarSign className='h-4 w-4' />,
      color: stats.balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor:
        stats.balance >= 0
          ? 'bg-green-100 dark:bg-green-900/20'
          : 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      icon: <CreditCard className='h-4 w-4' />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
  ]

  return {
    statCards,
    stats,
  }
}
