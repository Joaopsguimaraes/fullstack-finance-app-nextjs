'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

interface LayoutContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  closeSidebar: () => void
  isCollapsed: boolean
  handleToggleCollapse: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

interface LayoutContextProviderProps {
  children: ReactNode
  value: LayoutContextType
}

export function LayoutContextProvider({
  children,
  value,
}: LayoutContextProviderProps) {
  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
