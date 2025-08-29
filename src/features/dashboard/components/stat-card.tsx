import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type StatCardProps } from '../types'

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className='bg-card border-border'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>
          {title}
        </CardTitle>
        <div className='flex h-8 w-8 items-center justify-center rounded-full'>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-foreground text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  )
}
