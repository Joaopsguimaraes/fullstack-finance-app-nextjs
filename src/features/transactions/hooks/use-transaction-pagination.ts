'use client'

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useCallback, useMemo } from 'react'
import type { PaginationParams } from '../types/pagination'
import { defaultTransactions } from '../constants/default-transactions-filters'

const paginationParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  type: parseAsString.withDefault('all'),
  category: parseAsString.withDefault('all'),
  search: parseAsString.withDefault(''),
  sortBy: parseAsString.withDefault('date'),
  sortOrder: parseAsString.withDefault('desc'),
  startDate: parseAsString,
  endDate: parseAsString,
  accountId: parseAsString.withDefault('all'),
}

export function useTransactionPagination() {
  const [params, setParams] = useQueryStates(paginationParsers, {
    shallow: false,
    history: 'push',
  })

  const paginationParams = useMemo<PaginationParams>(
    () => ({
      page: params.page,
      limit: params.limit,
      type: params.type === 'all' ? undefined : params.type,
      category: params.category === 'all' ? undefined : params.category,
      search: params.search || undefined,
      sortBy: params.sortBy as PaginationParams['sortBy'],
      sortOrder: params.sortOrder as PaginationParams['sortOrder'],
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      accountId: params.accountId === 'all' ? undefined : params.accountId,
    }),
    [params]
  )

  const setPage = useCallback(
    (page: number) => {
      setParams({ page })
    },
    [setParams]
  )

  const setLimit = useCallback(
    (limit: number) => {
      setParams({ limit, page: 1 })
    },
    [setParams]
  )

  const setFilters = useCallback(
    (filters: Partial<typeof params>) => {
      setParams({ ...filters, page: 1 })
    },
    [setParams]
  )

  const setSorting = useCallback(
    (sortBy: string, sortOrder?: string) => {
      setParams({
        sortBy,
        sortOrder: sortOrder || params.sortOrder,
        page: 1,
      })
    },
    [setParams, params.sortOrder]
  )

  const resetFilters = useCallback(() => {
    setParams(defaultTransactions)
  }, [setParams])

  return {
    params: paginationParams,
    urlParams: params,
    setPage,
    setLimit,
    setFilters,
    setSorting,
    resetFilters,
  }
}
