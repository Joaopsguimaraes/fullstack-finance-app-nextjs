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
import { Skeleton } from '@/components/ui/skeleton'
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
import { useTransactionPagination } from '@/features/transactions/hooks/use-transaction-pagination'
import type { Transaction } from '@/lib/schemas'
import { formatCurrency } from '@/utils/format-currency'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  Edit,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'
import { categoryIcons } from '../constants/category-icons'
import { getCategoryColor } from '../helpers/get-category-color'
import { useTransactionsTable } from '../hooks/use-transactions-table'
import { FilterTransactions } from './filter-transactions'
import { TransactionsPagination } from './transactions-pagination'

function TransactionTableComponent() {
  const {
    params,
    urlParams,
    setPage,
    setLimit,
    setFilters,
    setSorting,
    resetFilters,
  } = useTransactionPagination()
  const { data, isLoading, isFetching, isPlaceholderData } =
    useListTransactions(params)
  const { openEditForm, openDeleteDialog } = useTransactionForm()
  const { formatDateDisplay, getAccountDisplay, getTransactionIcon } =
    useTransactionsTable()

  const transactions = useMemo(() => data?.data || [], [data])

  const handleSort = useCallback(
    (column: 'date' | 'amount' | 'description') => {
      if (urlParams.sortBy === column) {
        setSorting(column, urlParams.sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSorting(column, 'desc')
      }
    },
    [urlParams.sortBy, urlParams.sortOrder, setSorting]
  )

  const getSortIcon = useCallback(
    (column: string) => {
      if (urlParams.sortBy !== column) {
        return <ArrowUpDownIcon className='ml-2 h-4 w-4' />
      }
      return urlParams.sortOrder === 'asc' ? (
        <ArrowUpIcon className='ml-2 h-4 w-4' />
      ) : (
        <ArrowDownIcon className='ml-2 h-4 w-4' />
      )
    },
    [urlParams.sortBy, urlParams.sortOrder]
  )

  const handleEdit = useCallback(
    (transaction: Transaction) => {
      openEditForm(transaction)
    },
    [openEditForm]
  )

  const handleDelete = useCallback(
    (transaction: Transaction) => {
      openDeleteDialog(transaction)
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
        <FilterTransactions
          filters={urlParams}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />
      </CardHeader>
      <CardContent className='space-y-6'>
        <div
          className={`border-border overflow-hidden rounded-lg border ${isFetching && !isPlaceholderData ? 'opacity-60' : ''}`}
        >
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead>Type</TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                    onClick={() => handleSort('description')}
                  >
                    Description
                    {getSortIcon('description')}
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                    {getSortIcon('amount')}
                  </Button>
                </TableHead>
                <TableHead>Account</TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {getSortIcon('date')}
                  </Button>
                </TableHead>
                <TableHead className='w-12'>Actions</TableHead>
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

        {data?.pagination && (
          <TransactionsPagination
            pagination={data.pagination}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </CardContent>
    </Card>
  )
}

export const TransactionTable = memo(TransactionTableComponent)
