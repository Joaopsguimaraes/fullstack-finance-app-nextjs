'use client'

import { ChevronRight, CoinsIcon, TrendingUp, X } from 'lucide-react'
import { type Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLayout } from '.'
import { getUserInitials } from '../utils/get-user-initials'
import { SidebarNavigation } from './sidebar-navigation'

interface Props {
  user: Session['user']
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ user, isOpen, onClose }: Props) {
  const { isCollapsed, handleToggleCollapse } = useLayout()
  const pathname = usePathname()

  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-zinc-100 transition-all duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className='flex h-16 items-center justify-between border-b px-4'>
          {!isCollapsed && (
            <div className='flex items-center space-x-2'>
              <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
                {
                  // TODO: Implements application logo here
                }
                <CoinsIcon className='text-primary-foreground h-5 w-5' />
              </div>
              <span className='text-primary text-lg font-bold'>Finances</span>
            </div>
          )}

          {isCollapsed && (
            <div
              onClick={handleToggleCollapse}
              className='bg-primary flex items-center justify-center rounded-lg p-3'
            >
              <CoinsIcon className='text-primary-foreground h-4 w-4' />
            </div>
          )}

          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={onClose}
          >
            <X className='h-5 w-5' />
          </Button>

          {/* Desktop collapse toggle */}
          <Button
            variant='ghost'
            size='icon'
            className='hidden lg:flex'
            onClick={handleToggleCollapse}
          >
            {!isCollapsed && <ChevronRight className='h-4 w-4' />}
          </Button>
        </div>
        {isCollapsed && (
          <div className='flex justify-center border-b p-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className='bg-primary/10 text-primary text-xs'>
                {getUserInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <SidebarNavigation />
        {isCollapsed && (
          <div className='flex justify-center p-2'>
            <Button size='icon' variant='ghost' className='h-8 w-8'>
              <TrendingUp className='h-4 w-4' />
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}
