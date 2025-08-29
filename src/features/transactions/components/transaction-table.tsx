'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListTransactions } from '@/features/transactions/hooks/use-list-transactions'
import { useTransactionFilters } from '@/features/transactions/hooks/use-transaction-filters'
import { useTransactionForm } from '@/features/transactions/hooks/use-transaction-form'
import type { Transaction } from '@/lib/schemas'
import { formatCurrency } from '@/utils/format-currency'
import { format } from 'date-fns'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { categoryIcons } from '../constants/category-icons'
import { getCategoryColor } from '../helpers/get-category-color'

type SortField = 'date' | 'amount' | 'description' | 'category' | 'type'
type SortDirection = 'asc' | 'desc'

const mockAccounts = [
  { id: '1', name: 'Checking Account', balance: 5000, type: 'CHECKING' },
  { id: '2', name: 'Savings Account', balance: 10000, type: 'SAVINGS' },
]

export function TransactionTable() {
  const { filters, setFilter } = useTransactionFilters()
  const { data } = useListTransactions(filters)
  const { openEditForm, openDeleteDialog } = useTransactionForm()
  const transactions = useMemo(() => data?.transactions || [], [data])

  const [localSearch, setLocalSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  const getAccountName = (accountId: string) => {
    const account = mockAccounts.find(a => a.id === accountId)
    return account?.name || 'Unknown Account'
  }

  const categories = useMemo(() => {
    const cats = Array.from(new Set(transactions.map(t => t.category)))
    return cats
  }, [transactions])

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter(transaction => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(localSearch.toLowerCase()) ||
        transaction.category.toLowerCase().includes(localSearch.toLowerCase())

      const matchesDateRange =
        (!dateRange.from || new Date(transaction.date) >= dateRange.from) &&
        (!dateRange.to || new Date(transaction.date) <= dateRange.to)

      return matchesSearch && matchesDateRange
    })

    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'date') {
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
      } else if (sortField === 'amount') {
        aValue = Math.abs(Number(a.amount))
        bValue = Math.abs(Number(b.amount))
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [transactions, localSearch, dateRange, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className='h-4 w-4' />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className='h-4 w-4' />
    ) : (
      <ArrowDown className='h-4 w-4' />
    )
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
      <CardHeader>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <CardTitle className='text-foreground text-2xl font-bold'>
              Enhanced Transactions
            </CardTitle>
            <p className='text-muted-foreground'>
              Showing {filteredAndSortedTransactions.length} of{' '}
              {transactions.length} transactions
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Enhanced Filters */}
        <div className='flex flex-col gap-4 lg:flex-row'>
          {/* Search */}
          <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
              placeholder='Search transactions...'
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Category Filter */}
          <Select
            value={filters.category}
            onValueChange={value => setFilter('category', value)}
          >
            <SelectTrigger className='w-full lg:w-48'>
              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4' />
                <SelectValue placeholder='Category' />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  <div className='flex items-center gap-2'>
                    {categoryIcons[category] || (
                      <MoreHorizontal className='h-4 w-4' />
                    )}
                    <span className='capitalize'>{category.toLowerCase()}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select
            value={filters.type}
            onValueChange={value => setFilter('type', value)}
          >
            <SelectTrigger className='w-full lg:w-48'>
              <SelectValue placeholder='Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              <SelectItem value='income'>Income</SelectItem>
              <SelectItem value='expense'>Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-full lg:w-48'>
                <Calendar className='mr-2 h-4 w-4' />
                {dateRange.from
                  ? dateRange.to
                    ? `${format(dateRange.from, 'MMM dd')} - ${format(
                        dateRange.to,
                        'MMM dd'
                      )}`
                    : format(dateRange.from, 'MMM dd, yyyy')
                  : 'Pick a date range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <CalendarComponent
                mode='range'
                selected={
                  dateRange.from && dateRange.to
                    ? { from: dateRange.from, to: dateRange.to }
                    : undefined
                }
                onSelect={range => setDateRange(range || {})}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Enhanced Table */}
        <div className='border-border overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead className='w-12'>#</TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('type')}
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Type
                    {getSortIcon('type')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('description')}
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Description
                    {getSortIcon('description')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('category')}
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Category
                    {getSortIcon('category')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('amount')}
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Amount
                    {getSortIcon('amount')}
                  </Button>
                </TableHead>
                <TableHead>Account</TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('date')}
                    className='h-auto p-0 font-semibold hover:bg-transparent'
                  >
                    Date
                    {getSortIcon('date')}
                  </Button>
                </TableHead>
                <TableHead className='w-12'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <Download className='mr-2 h-4 w-4' />
                        Export CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className='mr-2 h-4 w-4' />
                        Import
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className='text-muted-foreground py-8 text-center'
                  >
                    No transactions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedTransactions.map((transaction, index) => (
                  <TableRow key={transaction.id} className='hover:bg-muted/50'>
                    <TableCell className='text-muted-foreground font-mono text-sm'>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            transaction.type === 'INCOME'
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          }`}
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
                        {categoryIcons[transaction.category] || (
                          <MoreHorizontal className='h-4 w-4' />
                        )}
                        <Badge
                          variant='secondary'
                          className={`text-xs ${getCategoryColor(
                            transaction.category
                          )}`}
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          transaction.type === 'INCOME'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount))}
                      </span>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {getAccountName(transaction.accountId)}
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
