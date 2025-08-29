'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
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
import { useSignin } from '@/features/auth/hooks/use-signin'
// eslint-disable-next-line sort-imports
import { authSchema, type AuthData } from '@/lib/schemas'

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { onSubmit, isLoading } = useSignin()
  const form = useForm<AuthData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { handleSubmit, control } = form

  return (
    <Card className='bg-card/50 border-0 shadow-lg backdrop-blur-sm'>
      <CardContent className='p-8'>
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
  )
}
