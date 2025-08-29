import { LoadingCard } from '@/components/ui/loading-states'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'

const SigninForm = dynamic(() =>
  import('@/features/auth/components').then(mod => mod.SigninForm)
)

export default function Page() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-foreground text-3xl font-bold tracking-tight'>
          Welcome back
        </h1>
        <p className='text-muted-foreground'>
          Sign in to your account to continue
        </p>
      </div>

      <Suspense
        fallback={<LoadingCard variant='skeleton' description='Loading...' />}
      >
        <SigninForm />
      </Suspense>

      <div className='text-center'>
        <p className='text-muted-foreground text-sm'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/signup'
            className='text-primary hover:text-primary/80 font-medium transition-colors'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
