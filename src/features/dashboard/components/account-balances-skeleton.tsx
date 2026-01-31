import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AccountBalancesSkeleton() {
  return (
    <Card className='bg-background border-border w-full'>
      <CardHeader>
        <Skeleton className='h-6 w-40' />
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='rounded-lg border p-4'>
              <Skeleton className='mb-1 h-4 w-20' />
              <Skeleton className='mb-2 h-4 w-24' />
              <Skeleton className='h-7 w-28' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
