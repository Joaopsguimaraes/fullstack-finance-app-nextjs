'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTransactionFilters } from '@/features/transactions/hooks/use-transaction-filters'
import { Filter, Search } from 'lucide-react'
import { categoriesOptions } from '../constants/categories'

const transactionsType = new Set(['all', 'income', 'expense'])

export function FilterTransactions() {
  const { filters, setFilter } = useTransactionFilters()

  return (
    <div className='flex flex-col gap-4 sm:flex-row'>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
        <Input
          placeholder='Search transactions...'
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          className='pl-10'
        />
      </div>
      <Select
        defaultValue={'expense'}
        value={filters.type}
        onValueChange={value => setFilter('type', value)}
      >
        <SelectTrigger className='w-full sm:w-[180px]'>
          <Filter className='mr-2 h-4 w-4' />
          <SelectValue placeholder='Filter by type' />
        </SelectTrigger>
        <SelectContent>
          {Array.from(transactionsType).map(type => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.category}
        onValueChange={value => setFilter('category', value)}
      >
        <SelectTrigger className='w-full sm:w-[180px]'>
          <SelectValue placeholder='Filter by category' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Categories</SelectItem>
          {categoriesOptions.map(cat => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
