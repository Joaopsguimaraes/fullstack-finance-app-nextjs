'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRegister } from '@/features/auth/register/hooks/use-register'
import { type RegisterData, registerSchema } from '@/lib/schemas'

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

interface PasswordStrengthProps {
  password: string
}

function PasswordStrength({ password }: PasswordStrengthProps) {
  const checks = [
    { label: 'At least 8 characters', test: password.length >= 8 },
    { label: 'Contains uppercase letter', test: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', test: /[a-z]/.test(password) },
    { label: 'Contains number', test: /\d/.test(password) },
    {
      label: 'Contains special character',
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ]

  const passedChecks = checks.filter(check => check.test).length
  const strength =
    passedChecks === 0 ? 0 : passedChecks <= 2 ? 1 : passedChecks <= 4 ? 2 : 3
  const strengthColors = [
    'bg-gray-200',
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
  ]
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong']

  if (password.length === 0) return null

  return (
    <div className='space-y-2'>
      <div className='flex space-x-1'>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1 w-full rounded-full transition-colors ${
              i < strength ? strengthColors[strength] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className='space-y-1'>
        <p
          className={`text-xs font-medium ${
            strength === 3
              ? 'text-green-600'
              : strength === 2
                ? 'text-yellow-600'
                : 'text-red-600'
          }`}
        >
          {strengthLabels[strength]} {strength > 0 && `(${passedChecks}/5)`}
        </p>
        <div className='space-y-0.5'>
          {checks.map((check, index) => (
            <div key={index} className='flex items-center space-x-2 text-xs'>
              <Check
                className={`h-3 w-3 ${
                  check.test ? 'text-green-600' : 'text-muted-foreground'
                }`}
              />
              <span
                className={
                  check.test ? 'text-green-600' : 'text-muted-foreground'
                }
              >
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface SignupFormProps {
  showSocialAuth?: boolean
  showTermsAndConditions?: boolean
}

export function SignupForm({
  showSocialAuth = true,
  showTermsAndConditions = true,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { handleSubmit, control, watch } = form
  const { onSubmit, isLoading } = useRegister()

  const password = watch('password')

  const handleSocialAuth = (provider: string) => {
    console.log(`${provider} authentication clicked`)
    // TODO: Implement social auth
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2 text-center'>
        <h1 className='text-foreground text-3xl font-bold tracking-tight'>
          Create your account
        </h1>
        <p className='text-muted-foreground'>
          Join us and start managing your finances
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
                    Or create with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Registration Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-foreground text-sm font-medium'>
                        First name
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <User className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                          <Input
                            {...field}
                            placeholder='John'
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
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-foreground text-sm font-medium'>
                        Last name
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <User className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                          <Input
                            {...field}
                            placeholder='Doe'
                            className='bg-background/50 border-border focus:border-ring focus:ring-ring/20 h-11 pl-10 transition-all focus:ring-2'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
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
                          placeholder='john.doe@example.com'
                          className='bg-background/50 border-border focus:border-ring focus:ring-ring/20 h-11 pl-10 transition-all focus:ring-2'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
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
                          placeholder='Create a strong password'
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
                    <PasswordStrength password={password || ''} />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-foreground text-sm font-medium'>
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Lock className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='Confirm your password'
                          className='bg-background/50 border-border focus:border-ring focus:ring-ring/20 h-11 pr-10 pl-10 transition-all focus:ring-2'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute top-0 right-0 h-full px-3 hover:bg-transparent'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
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

              {/* Terms and Conditions */}
              {showTermsAndConditions && (
                <div className='flex items-center space-x-2'>
                  <input
                    id='terms'
                    type='checkbox'
                    checked={agreeToTerms}
                    onChange={e => setAgreeToTerms(e.target.checked)}
                    className='border-input text-primary focus:ring-primary focus:ring-offset-background h-4 w-4 rounded'
                  />
                  <label
                    htmlFor='terms'
                    className='text-muted-foreground text-sm'
                  >
                    I agree to the{' '}
                    <Link
                      href='/terms'
                      className='text-primary hover:text-primary/80 font-medium'
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href='/privacy'
                      className='text-primary hover:text-primary/80 font-medium'
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              )}

              <Button
                type='submit'
                className='h-11 w-full font-medium shadow-lg transition-all duration-300 hover:shadow-xl'
                disabled={
                  isLoading || (showTermsAndConditions && !agreeToTerms)
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Footer */}
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
