import * as React from 'react'
import { Circle, Loader2 } from 'lucide-react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const loadingVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      default: 'text-primary',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      secondary: 'text-secondary-foreground',
    },
    size: {
      sm: 'gap-2 text-sm',
      default: 'gap-3 text-base',
      lg: 'gap-4 text-lg',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    orientation: 'horizontal',
  },
})

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
  showSpinner?: boolean
  spinnerSize?: VariantProps<typeof spinnerVariants>['size']
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      className,
      variant,
      size,
      orientation,
      text,
      showSpinner = true,
      spinnerSize,
      ...props
    },
    ref
  ) => {
    const effectiveSpinnerSize = spinnerSize || size

    return (
      <div
        ref={ref}
        className={cn(
          loadingVariants({ variant, size, orientation, className })
        )}
        role='status'
        aria-label={text || 'Loading'}
        {...props}
      >
        {showSpinner && (
          <Loader2
            className={cn(spinnerVariants({ size: effectiveSpinnerSize }))}
          />
        )}
        {text && <span>{text}</span>}
        <span className='sr-only'>{text || 'Loading...'}</span>
      </div>
    )
  }
)
LoadingSpinner.displayName = 'LoadingSpinner'

// Skeleton Component for more sophisticated loading states
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  avatar?: boolean
  button?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, lines = 3, avatar = false, button = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-pulse space-y-3', className)}
        role='status'
        aria-label='Loading content'
        {...props}
      >
        {avatar && (
          <div className='flex items-center space-x-4'>
            <div className='bg-muted h-10 w-10 rounded-full' />
            <div className='flex-1 space-y-2'>
              <div className='bg-muted h-4 w-3/4 rounded' />
              <div className='bg-muted h-3 w-1/2 rounded' />
            </div>
          </div>
        )}

        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className='space-y-2'>
            <div
              className={cn(
                'bg-muted h-4 rounded',
                i === lines - 1 ? 'w-2/3' : 'w-full'
              )}
            />
          </div>
        ))}

        {button && (
          <div className='flex space-x-2 pt-2'>
            <div className='bg-muted h-9 w-20 rounded' />
            <div className='bg-muted h-9 w-16 rounded' />
          </div>
        )}
      </div>
    )
  }
)
Skeleton.displayName = 'Skeleton'

// Pulse dots animation
interface PulseDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof loadingVariants>['variant']
  size?: VariantProps<typeof loadingVariants>['size']
}

const PulseDots = React.forwardRef<HTMLDivElement, PulseDotsProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const dotSize =
      size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2'
    const variantColor =
      variant === 'muted'
        ? 'bg-muted-foreground'
        : variant === 'destructive'
          ? 'bg-destructive'
          : variant === 'secondary'
            ? 'bg-secondary-foreground'
            : 'bg-primary'

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center space-x-1', className)}
        role='status'
        aria-label='Loading'
        {...props}
      >
        {[0, 1, 2].map(i => (
          <Circle
            key={i}
            className={cn(dotSize, variantColor, 'animate-pulse rounded-full')}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1s',
            }}
          />
        ))}
        <span className='sr-only'>Loading...</span>
      </div>
    )
  }
)
PulseDots.displayName = 'PulseDots'

export { LoadingSpinner, Skeleton, PulseDots, loadingVariants, spinnerVariants }
export type { LoadingSpinnerProps, SkeletonProps, PulseDotsProps }
