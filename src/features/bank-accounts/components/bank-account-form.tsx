'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createBankAccountSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { DollarSign, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { accountTypes } from '../constants/account-types'
import { useBankAccountForm } from '../hooks/use-bank-account-form'
import { useCreateBankAccount } from '../hooks/use-create-bank-account'
import { useUpdateBankAccount } from '../hooks/use-update-bank-account'

type BankAccountFormInput = z.input<typeof createBankAccountSchema>

export function BankAccountForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { formState, closeForm } = useBankAccountForm()
  const createBankAccount = useCreateBankAccount()
  const updateBankAccount = useUpdateBankAccount()
  const { editingAccount, isFormOpen } = formState
  const mode = editingAccount ? 'edit' : 'create'

  const form = useForm<BankAccountFormInput>({
    resolver: zodResolver(createBankAccountSchema),
    defaultValues: {
      name: '',
      type: 'CHECKING',
    },
  })

  const onClose = () => {
    closeForm()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (data: BankAccountFormInput) => {
    setIsLoading(true)
    try {
      if (mode === 'create') {
        await createBankAccount.mutateAsync(data)
      } else if (editingAccount?.id) {
        await updateBankAccount.mutateAsync({
          id: editingAccount.id,
          data: {
            id: editingAccount.id,
            ...data,
          },
        })
      }
      form.reset()
      onClose()
    } catch (error) {
      console.error('Error saving bank account:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (editingAccount) {
      form.reset({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: editingAccount.balance,
      })
    } else {
      form.reset({
        name: '',
        type: 'CHECKING',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingAccount?.id])

  return (
    <Dialog open={isFormOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Account' : 'Edit Account'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <div className='relative'>
                    <FileText className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <FormControl>
                      <Input
                        placeholder='Enter account name'
                        className='pl-10'
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select account type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accountTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='balance'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
                  <div className='relative'>
                    <DollarSign className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        type='number'
                        step='0.01'
                        placeholder='0.00'
                        className='pl-10'
                        onChange={e => {
                          const value = e.target.value
                          field.onChange(value === '' ? undefined : parseFloat(value))
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading
                  ? 'Saving...'
                  : mode === 'create'
                    ? 'Create Account'
                    : 'Update Account'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
