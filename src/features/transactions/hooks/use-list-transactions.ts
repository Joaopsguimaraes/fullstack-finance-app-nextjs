import { useQuery } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction-service'
import { transactionKeys } from './transaction-key'

export const useListTransactions = () => {
  return useQuery({
    queryKey: transactionKeys.list(),
    queryFn: () => TransactionService.getTransactions(),
  })
}
