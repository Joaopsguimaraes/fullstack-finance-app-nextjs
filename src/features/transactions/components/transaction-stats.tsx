'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTransactionStats } from '../hooks/use-transaction-stats'

export function TransactionStats() {
  const { statCards, stats } = useTransactionStats()

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              {stat.title}
            </CardTitle>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full`}
            >
              <div className={stat.color}>{stat.icon}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.title === 'Net Balance' && stats.balance < 0 && '-'}
              {stat.value}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {stat.title === 'Total Transactions'
                ? 'Based on current filters'
                : 'Current period total'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
