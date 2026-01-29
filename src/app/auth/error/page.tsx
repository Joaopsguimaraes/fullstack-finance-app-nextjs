'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

/**
 * Authentication error messages mapping
 */
const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An unexpected error occurred during authentication.',
  CredentialsSignin:
    'Invalid email or password. Please check your credentials and try again.',
  EmailCreateAccount: 'Could not create an account with that email address.',
  OAuthCreateAccount: 'Could not create an account with that OAuth provider.',
  SessionRequired: 'You must be signed in to access this page.',
}

type ErrorType = keyof typeof errorMessages

/**
 * Authentication Error Page Component
 *
 * Displays user-friendly error messages for authentication failures
 * with options to retry or return to sign-in page.
 */
function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const error = (searchParams.get('error') as ErrorType) || 'Default'
  const errorMessage = errorMessages[error] || errorMessages.Default

  const handleRetry = () => {
    router.push('/auth/signin')
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className='bg-background flex min-h-screen items-center justify-center px-4 py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
            <AlertCircle className='text-destructive h-6 w-6' />
          </div>
          <CardTitle className='text-2xl font-bold'>
            Authentication Error
          </CardTitle>
          <CardDescription>
            We encountered an issue while trying to sign you in.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='bg-destructive/5 rounded-lg p-4 text-center'>
            <p className='text-destructive text-sm'>{errorMessage}</p>
          </div>

          {error === 'CredentialsSignin' && (
            <div className='text-muted-foreground mt-4 text-sm'>
              <p>Please make sure:</p>
              <ul className='mt-2 list-inside list-disc space-y-1'>
                <li>Your email address is correct</li>
                <li>Your password is correct</li>
                <li>Your account exists and is active</li>
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className='flex flex-col space-y-2'>
          <Button onClick={handleRetry} className='w-full'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Try Again
          </Button>

          <Button variant='outline' onClick={handleGoBack} className='w-full'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go Back
          </Button>

          <div className='pt-4 text-center'>
            <Link
              href='/auth/signup'
              className='text-muted-foreground hover:text-primary text-sm'
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

/**
 * Main error page with Suspense boundary
 */
export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
            <p className='text-muted-foreground mt-2 text-sm'>Loading...</p>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}
