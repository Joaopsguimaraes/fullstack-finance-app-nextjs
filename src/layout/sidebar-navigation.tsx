import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigationItems, useLayout } from '.'
import { Separator } from '../components/ui/separator'
import { SidebarQuickStats } from '../features/transactions/components/sidebar-quick-stats'
import { cn } from '../lib/utils'

export function SidebarNavigation() {
  const { isCollapsed } = useLayout()
  const pathname = usePathname()

  return (
    <nav className='flex-1 space-y-2 p-4'>
      <div className='space-y-1'>
        {!isCollapsed && (
          <p className='text-muted-foreground px-2 text-xs font-semibold tracking-wider uppercase'>
            Navigation
          </p>
        )}

        {navigationItems.map(item => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(item.href.concat('/'))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'hover:bg-primary/80 flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-primary/20',
                isCollapsed ? 'justify-center px-2' : ''
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive && 'text-primary-foreground'
                )}
              />
              {!isCollapsed && <span className='truncate'>{item.name}</span>}
            </Link>
          )
        })}
      </div>

      {!isCollapsed && (
        <>
          <Separator className='my-4' />
          <SidebarQuickStats />
        </>
      )}
    </nav>
  )
}
