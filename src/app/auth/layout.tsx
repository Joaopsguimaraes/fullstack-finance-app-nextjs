import type { Metadata } from 'next'
import { AuthLayout } from '@/features/auth/components'

export const metadata: Metadata = {
  title: 'Authentication - Finance App',
  description: 'Sign in to your account or create a new one',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
