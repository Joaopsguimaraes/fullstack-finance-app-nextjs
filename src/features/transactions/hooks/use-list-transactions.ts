import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction-service'
import type { PaginationParams } from '../types/pagination'
import { transactionKeys } from './transaction-key'

export const useListTransactions = (params?: PaginationParams) => {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => TransactionService.getTransactions(params),
    placeholderData: keepPreviousData,
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })
}
