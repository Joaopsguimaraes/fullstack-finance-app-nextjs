import { useQuery } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction-service'
import { transactionKeys } from './transaction-key'

export const useTransactionStatsQuery = () => {
  return useQuery({
    queryKey: transactionKeys.stats(),
    queryFn: () => TransactionService.getTransactions(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
