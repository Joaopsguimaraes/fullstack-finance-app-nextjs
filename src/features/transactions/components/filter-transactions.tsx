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
import { CalendarIcon, Search, X } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useBankAccounts } from '@/features/bank-accounts/hooks/use-bank-accounts'
import { useCategories } from '@/features/categories/hooks/use-categories'

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
  const { data: categories = [] } = useCategories()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const handleDateChange = useCallback(
    (type: 'start' | 'end', date: Date | undefined) => {
      const formatDateToISO = (d: Date) => {
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      if (type === 'start') {
        setStartDate(date)
        onFiltersChange({ startDate: date ? formatDateToISO(date) : null })
      } else {
        setEndDate(date)
        onFiltersChange({ endDate: date ? formatDateToISO(date) : null })
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
            {categories.map(category => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
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
              {startDate
                ? startDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })
                : 'Start Date'}
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
              {endDate
                ? endDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })
                : 'End Date'}
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
