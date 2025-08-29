import { type Session } from 'next-auth'
import { type PropsWithChildren } from 'react'

import { LayoutProvider } from './layout-provider'

type Props = Readonly<
  PropsWithChildren & {
    session: Session
  }
>

export function AppLayout({ children, session }: Props) {
  return <LayoutProvider user={session.user}>{children}</LayoutProvider>
}
