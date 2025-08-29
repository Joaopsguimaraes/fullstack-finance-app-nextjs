import type { AuthData, RegisterData } from '@/lib/schemas'
import { notify } from '@/lib/toast'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

export const useAuth = () => {
  const [isPending, startTransition] = useTransition()
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const login = useCallback(
    async (credentials: AuthData) => {
      startTransition(async () => {
        try {
          const result = await signIn('credentials', {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
          })

          if (result?.error) {
            notify.error('Invalid email or password')
            return
          }

          if (result?.ok) {
            notify.success('Welcome back!')

            const callbackUrl = searchParams.get('callbackUrl')
            const redirectUrl =
              callbackUrl && callbackUrl !== '/auth/signin'
                ? callbackUrl
                : '/dashboard'

            router.push(redirectUrl)
          }
        } catch (reason) {
          const response =
            reason instanceof Error ? reason.message : 'Unexpected Error'
          notify.error(response)
        }
      })
    },
    [router, searchParams]
  )

  const logout = useCallback(async () => {
    startTransition(async () => {
      try {
        await signOut({ redirect: false })
        notify.success('Logged out successfully')
        router.push('/auth/signin')
      } catch (error) {
        console.error('Logout error:', error)
        notify.error('Error logging out')
      }
    })
  }, [router])

  const register = useCallback(
    async (data: RegisterData) => {
      startTransition(async () => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          const result = await response.json()

          if (!response.ok) {
            notify.error(result.error || 'Registration failed')
            return result
          }

          notify.success('Account created successfully! Please sign in.')
          router.push('/auth/signin')
          return result
        } catch (error) {
          console.error('Registration error:', error)
          const reasonError =
            error instanceof Error
              ? error.message
              : 'Unexpected Error, please try again'
          notify.error(reasonError)
          return { success: false, error: reasonError }
        }
      })
    },
    [router]
  )

  return {
    session,
    status,
    isAuthenticated: !!session,

    isLoading: status === 'loading' || isPending,

    login,
    logout,
    register,
  }
}
