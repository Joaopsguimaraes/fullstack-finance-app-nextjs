'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BankAccount } from '@/lib/schemas'
import { formatCurrency } from '@/utils/format-currency'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useCallback } from 'react'
import { accountIcons } from '../constants/account-icons'
import { useBankAccountForm } from '../hooks/use-bank-account-form'
import { useBankAccounts } from '../hooks/use-bank-accounts'

export function BankAccountTable() {
  const { data: accounts = [], isLoading } = useBankAccounts()
  const { openEditForm, openDeleteDialog } = useBankAccountForm()

  const handleEdit = useCallback(
    (account: BankAccount) => {
      openEditForm(account)
    },
    [openEditForm]
  )

  const handleDelete = useCallback(
    (account: BankAccount) => {
      openDeleteDialog(account)
    },
    [openDeleteDialog]
  )

  if (isLoading) {
    return (
      <Card className='bg-background border-border w-full'>
        <CardHeader>
          <Skeleton className='h-10 w-full' />
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='h-16 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='bg-background border-border w-full'>
      <CardHeader>
        <CardTitle>List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='border-border overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className='w-12'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='text-muted-foreground py-8 text-center'
                  >
                    No bank accounts found.
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map(account => {
                  const Icon = accountIcons[account.type]
                  console.log(account)
                  return (
                    <TableRow key={account.id} className='hover:bg-muted/50'>
                      <TableCell>
                        <div className='text-foreground font-medium'>
                          {account.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='secondary'
                          className='inline-flex items-center gap-1.5'
                        >
                          <Icon className='h-3.5 w-3.5' />
                          {account.type === 'CHECKING' && 'Checking'}
                          {account.type === 'SAVINGS' && 'Savings'}
                          {account.type === 'CREDIT' && 'Credit Card'}
                          {account.type === 'INVESTMENT' && 'Investment'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className='font-semibold'>
                          {account.balance
                            ? formatCurrency(account.balance)
                            : formatCurrency(0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => handleEdit(account)}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(account)}
                              className='text-destructive'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
