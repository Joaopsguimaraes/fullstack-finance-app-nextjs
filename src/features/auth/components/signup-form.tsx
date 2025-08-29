/* eslint-disable sort-imports */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react'
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
import { useRegister } from '@/features/auth/hooks/use-register'
import { registerSchema, type RegisterData } from '@/lib/schemas'
import { PasswordStrength } from './password-strength'

interface SignupFormProps {
  showTermsAndConditions?: boolean
}

export function SignupForm({ showTermsAndConditions = true }: SignupFormProps) {
  const { onSubmit, isLoading } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
  const password = watch('password')

  return (
    <Card className='bg-card/50 border-0 shadow-lg backdrop-blur-sm'>
      <CardContent className='p-8'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
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
              disabled={isLoading || (showTermsAndConditions && !agreeToTerms)}
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
  )
}
