import { type CreateTransaction } from '@/lib/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction-service'
import { showToast } from '@/lib/toast'
import { transactionKeys } from './transaction-key'

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransaction) =>
      TransactionService.createTransaction(data),
    onSuccess: () => {
      showToast.success('Transaction created successfully')
      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      })
    },
    onError: error => {
      showToast.error('Failed to create transaction', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      })
    },
  })
}
