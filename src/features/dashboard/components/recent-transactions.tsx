'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getIcon } from '../constants/icons'
import { formatCurrency, formatDate } from '../helpers/utils'
import { type DashboardTransaction } from '../types'

interface RecentTransactionsProps {
  transactions: DashboardTransaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className='bg-card border-border'>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Here are the most recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='border-border rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='w-[50px]'></TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
                <TableHead className='w-[50px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-accent text-green-600'
                          : 'bg-accent text-red-600'
                      }`}
                    >
                      {getIcon(transaction.iconName)}
                    </div>
                  </TableCell>
                  <TableCell className='text-foreground font-medium'>
                    {transaction.description}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <span
                      className={`font-medium ${
                        transaction.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
