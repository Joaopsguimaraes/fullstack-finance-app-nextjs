import { Sidebar } from '@/layout/sidebar'
import { type Session } from 'next-auth'
import { type PropsWithChildren } from 'react'

type Props = Readonly<
  PropsWithChildren & {
    session: Session
  }
>

export function AppLayout({ children, session }: Props) {
  return (
    <div className='bg-background flex min-h-screen'>
      <Sidebar user={session.user} />
      <main className='w-full p-6'>{children}</main>
    </div>
  )
}
