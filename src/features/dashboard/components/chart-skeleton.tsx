import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-[300px] w-full'>
          <Skeleton className='h-full w-full' />
        </div>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2'>
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-3 w-64' />
      </CardFooter>
    </Card>
  )
}
