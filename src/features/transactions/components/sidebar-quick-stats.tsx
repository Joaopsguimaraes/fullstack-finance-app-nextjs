import { formatCurrency } from '../../../utils'
import { useTransactionStats } from '../hooks/use-transaction-stats'

export function SidebarQuickStats() {
  const { stats } = useTransactionStats()

  return (
    <div className='space-y-3'>
      <p className='text-muted-foreground px-2 text-xs font-semibold tracking-wider uppercase'>
        Quick Stats
      </p>

      <div className='space-y-2'>
        <div className='flex items-center justify-between px-2'>
          <div className='flex items-center space-x-2'>
            <div className='h-2 w-2 rounded-full bg-green-500'></div>
            <span className='text-muted-foreground text-xs'>Income</span>
          </div>
          <span className='text-xs font-medium'>
            {formatCurrency(stats.income)}
          </span>
        </div>

        <div className='flex items-center justify-between px-2'>
          <div className='flex items-center space-x-2'>
            <div className='h-2 w-2 rounded-full bg-red-500'></div>
            <span className='text-muted-foreground text-xs'>Expenses</span>
          </div>
          <span className='text-xs font-medium'>
            {formatCurrency(stats.expenses)}
          </span>
        </div>

        <div className='flex items-center justify-between px-2'>
          <div className='flex items-center space-x-2'>
            <div className='h-2 w-2 rounded-full bg-blue-500'></div>
            <span className='text-muted-foreground text-xs'>Savings</span>
          </div>
          <span className='text-xs font-medium'>
            {formatCurrency(stats.balance)}
          </span>
        </div>
      </div>
    </div>
  )
}
