'use client'

import { type Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Header } from './header'
import { LayoutContextProvider } from './layout-context'
import { Sidebar } from './sidebar'

interface LayoutProviderProps {
  user: Session['user']
  children: React.ReactNode
}

export function LayoutProvider({ user, children }: LayoutProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/auth/signin' })
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
      console.error('Logout error:', error)
    }
  }, [])

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed])

  const layoutContextValue = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      closeSidebar,
      isCollapsed,
      handleToggleCollapse,
    }),
    [
      sidebarOpen,
      toggleSidebar,
      closeSidebar,
      isCollapsed,
      handleToggleCollapse,
    ]
  )

  return (
    <LayoutContextProvider value={layoutContextValue}>
      <div className='bg-background flex h-screen overflow-hidden'>
        <Sidebar user={user} isOpen={sidebarOpen} onClose={closeSidebar} />
        <div className='flex flex-1 flex-col overflow-hidden'>
          <Header
            user={user}
            onMenuClick={toggleSidebar}
            onLogout={handleLogout}
          />
          <main className='flex-1 overflow-auto'>
            <div className='container mx-auto p-4 sm:p-6 lg:p-8'>
              <div className='space-y-6'>{children}</div>
            </div>
          </main>
        </div>
      </div>
    </LayoutContextProvider>
  )
}
