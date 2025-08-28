'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Github, Loader2, Lock, Mail } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { type AuthData, authSchema } from '@/lib/schemas'
import { useSignin } from '@/features/auth/signin/hooks/use-signin'

// Google Icon Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' width='20' height='20'>
    <path
      fill='#4285F4'
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
    />
    <path
      fill='#34A853'
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
    />
    <path
      fill='#FBBC05'
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
    />
    <path
      fill='#EA4335'
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
    />
  </svg>
)

interface SigninFormProps {
  showSocialAuth?: boolean
  showRememberMe?: boolean
}

export function SigninForm({
  showSocialAuth = true,
  showRememberMe = true,
}: SigninFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const form = useForm<AuthData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { handleSubmit, control } = form
  const { onSubmit, isLoading } = useSignin()

  const handleSocialAuth = (provider: string) => {
    console.log(`${provider} authentication clicked`)
    // TODO: Implement social auth
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2 text-center'>
        <h1 className='text-foreground text-3xl font-bold tracking-tight'>
          Welcome back
        </h1>
        <p className='text-muted-foreground'>
          Sign in to your account to continue
        </p>
      </div>

      <Card className='bg-card/50 border-0 shadow-lg backdrop-blur-sm'>
        <CardContent className='p-8'>
          {/* Social Authentication */}
          {showSocialAuth && (
            <>
              <div className='space-y-3'>
                <Button
                  type='button'
                  variant='outline'
                  className='hover:bg-accent/50 flex h-11 w-full items-center justify-center gap-3 transition-colors'
                  onClick={() => handleSocialAuth('google')}
                >
                  <GoogleIcon className='h-5 w-5' />
                  <span className='text-sm font-medium'>
                    Continue with Google
                  </span>
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  className='hover:bg-accent/50 flex h-11 w-full items-center justify-center gap-3 transition-colors'
                  onClick={() => handleSocialAuth('github')}
                >
                  <Github className='h-5 w-5' />
                  <span className='text-sm font-medium'>
                    Continue with GitHub
                  </span>
                </Button>
              </div>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='border-border w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-card text-muted-foreground px-3 font-medium'>
                    Or continue with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Email/Password Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <FormField
                control={control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-foreground text-sm font-medium'>
                      Email address
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Mail className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                        <Input
                          {...field}
                          type='email'
                          placeholder='name@example.com'
                          className='bg-background/50 border-border focus:border-ring focus:ring-ring/20 h-11 pl-10 transition-all focus:ring-2'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-foreground text-sm font-medium'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Lock className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Enter your password'
                          className='bg-background/50 border-border focus:border-ring focus:ring-ring/20 h-11 pr-10 pl-10 transition-all focus:ring-2'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute top-0 right-0 h-full px-3 hover:bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className='text-muted-foreground h-4 w-4' />
                          ) : (
                            <Eye className='text-muted-foreground h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me  */}
              {showRememberMe && (
                <div className='flex items-center justify-between text-sm'>
                  {showRememberMe && (
                    <label className='flex cursor-pointer items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className='border-input text-primary focus:ring-primary focus:ring-offset-background h-4 w-4 rounded'
                      />
                      <span className='text-muted-foreground select-none'>
                        Remember me
                      </span>
                    </label>
                  )}
                </div>
              )}

              <Button
                type='submit'
                className='h-11 w-full font-medium shadow-lg transition-all duration-300 hover:shadow-xl'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Footer */}
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
