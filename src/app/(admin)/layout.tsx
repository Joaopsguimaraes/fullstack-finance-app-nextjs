import { AppLayout } from '@/layout/app-layout'
import { auth } from '@/lib/auth'
import { type Session } from 'next-auth'
import { redirect } from 'next/navigation'
import type { PropsWithChildren } from 'react'

export default async function Layout({ children }: PropsWithChildren) {
  const session: Session | null = await auth()

  if (!session) {
    redirect('auth/signin')
  }

  return <AppLayout session={session}>{children}</AppLayout>
}
