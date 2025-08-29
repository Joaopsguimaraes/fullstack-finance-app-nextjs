/* eslint-disable sort-imports */
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
import { useTransactionForm } from '@/features/transactions/hooks/use-transaction-form'
import { createTransactionSchema, type CreateTransaction } from '@/lib/schemas'
import { formatCurrency } from '@/utils/format-currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, DollarSign, FileText, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { categoriesOptions } from '../constants/categories'
import { transactionTypes } from '../constants/transaction-type'
import { useCreateTransaction } from '../hooks/use-create-transaction'
import { useUpdateTransaction } from '../hooks/use-update-transaction'

const mockAccounts = [
  { id: '1', name: 'Checking Account', balance: 0, type: 'CHECKING' },
  { id: '2', name: 'Savings Account', balance: 0, type: 'SAVINGS' },
]

export function TransactionForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { formState, closeForm } = useTransactionForm()
  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()
  const { editingTransaction, isFormOpen: isOpen } = formState
  const mode = editingTransaction ? 'edit' : 'create'

  const form = useForm<CreateTransaction>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: '',
      description: '',
      category: 'OTHER',
      type: 'EXPENSE',
      date: new Date(),
      accountId: mockAccounts[0]?.id || '',
    },
  })

  const onClose = () => {
    closeForm()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (data: CreateTransaction) => {
    setIsLoading(true)
    try {
      if (mode === 'create') {
        await createTransaction.mutateAsync(data)
      } else if (editingTransaction?.id) {
        await updateTransaction.mutateAsync({
          id: editingTransaction.id,
          data: { ...data, id: editingTransaction.id },
        })
      }
      form.reset()
      onClose()
    } catch (error) {
      console.error('Error saving transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when editing transaction changes
  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        category: editingTransaction.category,
        type: editingTransaction.type,
        date: new Date(editingTransaction.date),
        accountId: editingTransaction.accountId,
      })
    } else {
      form.reset({
        amount: '',
        description: '',
        category: 'OTHER',
        type: 'EXPENSE',
        date: new Date(),
        accountId: mockAccounts[0]?.id || '',
      })
    }
  }, [editingTransaction, form])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add Transaction' : 'Edit Transaction'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                        <SelectValue placeholder='Select transaction type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionTypes.map(type => (
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
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <div className='relative'>
                    <DollarSign className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='0.00'
                        className='pl-10'
                        onChange={e => field.onChange(e.target.value)}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <div className='relative'>
                    <FileText className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <FormControl>
                      <Input
                        placeholder='Enter description'
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
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className='relative'>
                    <Tag className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='pl-10'>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesOptions.map(category => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='accountId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select account' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockAccounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({formatCurrency(account.balance)})
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
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <div className='relative'>
                    <Calendar className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <FormControl>
                      <Input
                        type='date'
                        className='pl-10'
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split('T')[0]
                            : field.value
                        }
                        onChange={e => field.onChange(new Date(e.target.value))}
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
                    ? 'Add Transaction'
                    : 'Update Transaction'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
