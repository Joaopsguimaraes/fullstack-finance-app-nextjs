import * as React from 'react'
import { Card, CardContent, CardHeader } from './card'
import { LoadingSpinner, PulseDots, Skeleton } from './loading'
import { cn } from '@/lib/utils'

interface LoadingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  variant?: 'spinner' | 'skeleton' | 'dots'
  size?: 'sm' | 'default' | 'lg'
}

const LoadingCard = React.forwardRef<HTMLDivElement, LoadingCardProps>(
  (
    {
      className,
      title,
      description,
      variant = 'spinner',
      size = 'default',
      ...props
    },
    ref
  ) => {
    const renderContent = () => {
      switch (variant) {
        case 'skeleton':
          return <Skeleton lines={3} className='p-0' />
        case 'dots':
          return <PulseDots size={size} />
        default:
          return (
            <LoadingSpinner
              size={size}
              text={description}
              orientation='vertical'
            />
          )
      }
    }

    return (
      <Card ref={ref} className={cn('w-full shadow-sm', className)} {...props}>
        {title && (
          <CardHeader className='pb-4'>
            <div className='bg-muted h-6 w-1/3 animate-pulse rounded' />
          </CardHeader>
        )}
        <CardContent className='flex items-center justify-center py-8'>
          {renderContent()}
        </CardContent>
      </Card>
    )
  }
)
LoadingCard.displayName = 'LoadingCard'

interface LoadingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
  showHeader?: boolean
}

const LoadingTable = React.forwardRef<HTMLDivElement, LoadingTableProps>(
  ({ className, rows = 5, columns = 4, showHeader = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full space-y-3', className)}
        role='status'
        aria-label='Loading table'
        {...props}
      >
        {showHeader && (
          <div className='flex space-x-4 border-b pb-2'>
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className='bg-muted h-4 flex-1 animate-pulse rounded'
              />
            ))}
          </div>
        )}

        <div className='space-y-3'>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className='flex space-x-4'>
              {Array.from({ length: columns }).map((_, j) => (
                <div
                  key={j}
                  className={cn(
                    'bg-muted h-10 flex-1 animate-pulse rounded',
                    j === 0 && 'w-16 flex-none' // First column smaller for actions/avatar
                  )}
                  style={{ animationDelay: `${(i * columns + j) * 0.05}s` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
LoadingTable.displayName = 'LoadingTable'

interface LoadingPageProps extends React.HTMLAttributes<HTMLDivElement> {
  showHeader?: boolean
  showSidebar?: boolean
  variant?: 'default' | 'dashboard' | 'form' | 'table'
}

const LoadingPage = React.forwardRef<HTMLDivElement, LoadingPageProps>(
  (
    {
      className,
      showHeader = true,
      showSidebar = false,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const renderVariant = () => {
      switch (variant) {
        case 'dashboard':
          return (
            <div className='space-y-6'>
              {/* Stats cards */}
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <LoadingCard key={i} variant='skeleton' className='h-24' />
                ))}
              </div>
              {/* Main content */}
              <div className='grid gap-6 md:grid-cols-2'>
                <LoadingCard variant='skeleton' className='h-64' />
                <LoadingCard variant='skeleton' className='h-64' />
              </div>
            </div>
          )
        case 'table':
          return <LoadingTable />
        case 'form':
          return (
            <LoadingCard className='mx-auto max-w-md'>
              <Skeleton lines={5} button />
            </LoadingCard>
          )
        default:
          return (
            <div className='flex min-h-[400px] items-center justify-center'>
              <LoadingSpinner size='lg' text='Loading content...' />
            </div>
          )
      }
    }

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        role='status'
        aria-label='Loading page'
        {...props}
      >
        {showHeader && (
          <div className='mb-6 space-y-2'>
            <div className='bg-muted h-8 w-1/4 animate-pulse rounded' />
            <div className='bg-muted h-4 w-1/2 animate-pulse rounded' />
          </div>
        )}

        <div className={cn('flex gap-6', showSidebar && '')}>
          {showSidebar && (
            <div className='w-64 space-y-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='bg-muted h-10 animate-pulse rounded' />
              ))}
            </div>
          )}

          <div className='flex-1'>{renderVariant()}</div>
        </div>
      </div>
    )
  }
)
LoadingPage.displayName = 'LoadingPage'

export { LoadingCard, LoadingTable, LoadingPage }
export type { LoadingCardProps, LoadingTableProps, LoadingPageProps }
