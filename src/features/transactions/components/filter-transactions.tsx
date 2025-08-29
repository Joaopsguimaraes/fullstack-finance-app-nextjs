'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { format } from 'date-fns'
import { CalendarIcon, Search, X } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { categoriesOptions } from '../constants/categories'
import { useBankAccounts } from '../hooks/use-bank-accounts'

interface FilterTransactionsProps {
  filters: {
    type: string
    category: string
    search: string
    startDate?: string | null
    endDate?: string | null
    accountId: string
  }
  onFiltersChange: (filters: any) => void
  onReset: () => void
}

function FilterTransactionsComponent({
  filters,
  onFiltersChange,
  onReset,
}: FilterTransactionsProps) {
  const { data: bankAccounts } = useBankAccounts()
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  )

  // Debounced search to avoid too many API calls
  const debouncedSearch = useDebouncedCallback((value: string) => {
    onFiltersChange({ search: value })
  }, 300)

  useEffect(() => {
    debouncedSearch(searchValue)
  }, [searchValue, debouncedSearch])

  const handleDateChange = useCallback(
    (type: 'start' | 'end', date: Date | undefined) => {
      if (type === 'start') {
        setStartDate(date)
        onFiltersChange({ startDate: date ? format(date, 'yyyy-MM-dd') : null })
      } else {
        setEndDate(date)
        onFiltersChange({ endDate: date ? format(date, 'yyyy-MM-dd') : null })
      }
    },
    [onFiltersChange]
  )

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.search ||
    filters.startDate ||
    filters.endDate ||
    filters.accountId !== 'all'

  return (
    <div className='space-y-4'>
      {/* Search Bar */}
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='Search transactions...'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          className='pl-9'
        />
      </div>

      {/* Filters Row */}
      <div className='flex flex-wrap gap-2'>
        {/* Type Filter */}
        <Select
          value={filters.type}
          onValueChange={value => onFiltersChange({ type: value })}
        >
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Types</SelectItem>
            <SelectItem value='INCOME'>Income</SelectItem>
            <SelectItem value='EXPENSE'>Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={value => onFiltersChange({ category: value })}
        >
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            {categoriesOptions.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Account Filter */}
        <Select
          value={filters.accountId}
          onValueChange={value => onFiltersChange({ accountId: value })}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Account' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Accounts</SelectItem>
            {bankAccounts?.map(account => (
              <SelectItem key={account.id} value={account.id || ''}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-[140px] justify-start text-left font-normal'
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {startDate ? format(startDate, 'MMM dd, yyyy') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={startDate}
              onSelect={date => handleDateChange('start', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-[140px] justify-start text-left font-normal'
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {endDate ? format(endDate, 'MMM dd, yyyy') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={endDate}
              onSelect={date => handleDateChange('end', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setSearchValue('')
              setStartDate(undefined)
              setEndDate(undefined)
              onReset()
            }}
            className='h-10'
          >
            <X className='mr-2 h-4 w-4' />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}

export const FilterTransactions = memo(FilterTransactionsComponent)
