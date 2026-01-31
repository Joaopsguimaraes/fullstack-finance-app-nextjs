import { type CreateTransaction } from '@/lib/schemas'
import { notify } from '@/lib/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction-service'
import { transactionKeys } from './transaction-key'

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransaction) =>
      TransactionService.createTransaction(data),
    onSuccess: () => {
      notify.success('Transaction created successfully')
      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: transactionKeys.stats(),
      })
    },
    onError: error => {
      notify.error('Failed to create transaction', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      })
    },
  })
}
