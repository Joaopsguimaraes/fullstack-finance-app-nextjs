import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogOut, X } from 'lucide-react'
import { navigationItems } from './navigation-items'
import { memo, useCallback, useState } from 'react'
import { ButtonColapseSidebar } from './button-collapse-sidebar'
import { type Session } from 'next-auth'

interface SidebarProps {
  readonly user: Session['user']
}

export const Sidebar = memo(function Sidebar({ user }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSidebarToggle = useCallback((value: boolean) => {
    setSidebarOpen(value)
  }, [])

  const handleLogout = useCallback(() => {
    console.log('Logging out...')
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [setSidebarOpen])

  return (
    <>
      <ButtonColapseSidebar
        sidebarOpen={sidebarOpen}
        handleSidebarToggle={handleSidebarToggle}
      />
      <div
        className={cn(
          'bg-card fixed inset-y-0 left-0 z-50 w-64 transform border-r transition-transform duration-200 ease-in-out lg:static lg:inset-0 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='flex h-16 items-center justify-between border-b px-6'>
            <h1 className='text-primary text-xl font-bold'>Finance App</h1>
            <Button
              variant='ghost'
              size='icon'
              className='lg:hidden'
              onClick={handleCloseSidebar}
            >
              <X className='h-5 w-5' />
            </Button>
          </div>

          {/* User info */}
          <div className='border-b px-6 py-4'>
            <div className='flex items-center space-x-3'>
              <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                <span className='text-primary font-semibold'>
                  {user?.name ? user.name[0] : 'U'}
                  {user?.email}
                </span>
              </div>
              <div className='flex-1'>
                <p className='font-medium'>{user?.name}</p>
                <p className='text-muted-foreground text-sm'>{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-2 px-4 py-6'>
            {navigationItems.map(item => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className='text-muted-foreground hover:text-foreground hover:bg-accent flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                >
                  <Icon className='h-5 w-5' />
                  <span>{item.name}</span>
                </a>
              )
            })}
          </nav>

          {/* Logout */}
          <div className='border-t p-4'>
            <Button
              variant='ghost'
              className='text-muted-foreground hover:text-foreground w-full justify-start'
              onClick={handleLogout}
            >
              <LogOut className='mr-3 h-5 w-5' />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
})
