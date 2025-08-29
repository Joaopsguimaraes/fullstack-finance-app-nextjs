import { LoadingCard } from '@/components/ui/loading-states'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'

const SignupForm = dynamic(() =>
  import('@/features/auth/components').then(mod => mod.SignupForm)
)

export default function Page() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-foreground text-3xl font-bold tracking-tight'>
          Create your account
        </h1>
        <p className='text-muted-foreground'>
          Join us and start managing your finances
        </p>
      </div>

      <Suspense
        fallback={<LoadingCard variant='skeleton' description='Loading...' />}
      >
        <SignupForm />
      </Suspense>

      <div className='text-center'>
        <p className='text-muted-foreground text-sm'>
          Already have an account?{' '}
          <Link
            href='/auth/signin'
            className='text-primary hover:text-primary/80 font-medium transition-colors'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
