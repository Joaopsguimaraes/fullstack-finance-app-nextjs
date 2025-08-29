'use client'

import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  User,
} from 'lucide-react'
import { type Session } from 'next-auth'
import { usePathname } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getBreadcrumbs } from '../utils/get-breadcrumbs'
import { getUserInitials } from '../utils/get-user-initials'

interface Props {
  readonly user: Session['user']
  readonly onMenuClick: () => void
  readonly onLogout?: () => void
}

export function Header({ user, onMenuClick, onLogout }: Props) {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname)

  const handleLogout = () => {
    onLogout?.()
  }

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur'>
      <div className='flex h-16 items-center gap-4 px-4 sm:px-6'>
        {/* Mobile menu button */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          onClick={onMenuClick}
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Breadcrumbs */}
        <nav className='text-muted-foreground hidden items-center space-x-1 text-sm sm:flex'>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className='flex items-center'>
              {index === 0 && breadcrumb.icon && (
                <breadcrumb.icon className='mr-1 h-4 w-4' />
              )}
              <a
                href={breadcrumb.href}
                className={`hover:text-foreground transition-colors ${
                  index === breadcrumbs.length - 1
                    ? 'text-foreground font-medium'
                    : 'hover:text-foreground'
                }`}
              >
                {breadcrumb.name}
              </a>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className='mx-1 h-4 w-4' />
              )}
            </div>
          ))}
        </nav>

        <div className='flex-1' />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-9 w-auto px-2'>
              <Avatar className='h-7 w-7'>
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback className='text-xs'>
                  {getUserInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className='ml-2 hidden flex-col items-start sm:flex'>
                <span className='text-sm leading-none font-medium'>
                  {user?.name || 'User'}
                </span>
                <span className='text-muted-foreground text-xs'>
                  {user?.email}
                </span>
              </div>
              <ChevronDown className='ml-1 h-4 w-4 opacity-50' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {user?.name || 'User'}
                </p>
                <p className='text-muted-foreground text-xs leading-none'>
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
