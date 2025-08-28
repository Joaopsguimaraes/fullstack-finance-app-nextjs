import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface TopBarProps {
  readonly setSidebarOpen: (value: boolean) => void
}

export function TopBar({ setSidebarOpen }: TopBarProps) {
  return (
    <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-6 backdrop-blur'>
      <Button
        variant='ghost'
        size='icon'
        className='lg:hidden'
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className='h-5 w-5' />
      </Button>
      <div className='flex-1' />
    </div>
  )
}
