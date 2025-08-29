'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListTransactions } from '@/features/transactions/hooks/use-list-transactions'
import { useTransactionForm } from '@/features/transactions/hooks/use-transaction-form'
import type { Transaction } from '@/lib/schemas'
import { formatCurrency } from '@/utils/format-currency'
import { format } from 'date-fns'
import { ArrowDown, ArrowUp, Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { categoryIcons } from '../constants/category-icons'
import { getCategoryColor } from '../helpers/get-category-color'

export function TransactionTable() {
  const { data } = useListTransactions()
  const { openEditForm, openDeleteDialog } = useTransactionForm()
  const transactions = useMemo(() => data || [], [data])

  const getAccountDisplay = (transaction: Transaction) => {
    if (transaction.bankAccount) {
      return {
        name: transaction.bankAccount.name,
        type: transaction.bankAccount.type,
      }
    }

    return {
      name: 'Unknown Account',
      type: 'CHECKING',
    }
  }

  const getTransactionIcon = (type: string) => {
    return type === 'INCOME' ? (
      <ArrowUp className='h-4 w-4 text-green-600' />
    ) : (
      <ArrowDown className='h-4 w-4 text-red-600' />
    )
  }

  const formatDateDisplay = (date: string | Date) => {
    return format(
      typeof date === 'string' ? new Date(date) : date,
      'MMM dd, yyyy'
    )
  }

  const handleEdit = (transaction: Transaction) => {
    openEditForm(transaction)
  }

  const handleDelete = (transaction: Transaction) => {
    openDeleteDialog(transaction)
  }

  return (
    <Card className='bg-background border-border w-full'>
      <CardHeader></CardHeader>
      <CardContent className='space-y-6'>
        <div className='border-border overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead>
                  <Button
                    variant='ghost'
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Type
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Description
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Category
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Amount
                  </Button>
                </TableHead>
                <TableHead>Account</TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Date
                  </Button>
                </TableHead>
                <TableHead className='w-12'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className='text-muted-foreground py-8 text-center'
                  >
                    No transactions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map(transaction => (
                  <TableRow key={transaction.id} className='hover:bg-muted/50'>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <div
                          className={
                            'flex h-8 w-8 items-center justify-center rounded-full'
                          }
                        >
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <span className='text-sm capitalize'>
                          {transaction.type.toLowerCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-foreground font-medium'>
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='secondary'
                          className={`inline-flex items-center gap-1 text-xs ${getCategoryColor(
                            transaction.category
                          )}`}
                        >
                          {categoryIcons[transaction.category] || (
                            <MoreHorizontal className='h-4 w-4' />
                          )}
                          {transaction.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className='font-semibold'>
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount))}
                      </span>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {getAccountDisplay(transaction).name}
                        </span>
                        <span className='text-muted-foreground text-xs'>
                          {getAccountDisplay(transaction).type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {formatDateDisplay(transaction.date)}
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
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(transaction)}
                            className='text-destructive'
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
