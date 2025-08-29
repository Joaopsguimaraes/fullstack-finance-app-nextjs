import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { type StatCardProps } from '../types'

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change >= 0

  return (
    <Card className='bg-card border-border'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>
          {title}
        </CardTitle>
        <div className='text-muted-foreground h-4 w-4'>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className='text-foreground text-2xl font-bold'>{value}</div>
        <div
          className={`flex items-center text-xs ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className='mr-1 h-3 w-3' />
          ) : (
            <ArrowDownRight className='mr-1 h-3 w-3' />
          )}
          {isPositive ? '+' : ''}
          {change.toFixed(1)}% from last month
        </div>
      </CardContent>
    </Card>
  )
}
