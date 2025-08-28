import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { AuthData, RegisterData } from '@/lib/schemas'
import { toast } from 'sonner'

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = useCallback(
    async (credentials: AuthData) => {
      try {
        setIsLoading(true)
        await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
        })

        router.push('/transactions')
      } catch (reason) {
        const response =
          reason instanceof Error ? reason.message : 'Unexpected Error'
        toast.error(response)
        setIsLoading(true)
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push('/auth/signin')
  }, [router])

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      return await response.json()
    } catch (error) {
      setIsLoading(false)
      console.error('Registration error:', error)
      const reasonError =
        error instanceof Error
          ? error.message
          : 'Unexpected Error, please try again'
      toast.error(reasonError)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === 'loading' || isLoading,
    login,
    logout,
    register,
  }
}
