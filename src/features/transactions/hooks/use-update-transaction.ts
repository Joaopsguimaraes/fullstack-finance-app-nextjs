import { type UpdateTransaction } from '@/lib/schemas'
import { notify } from '@/lib/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction-service'
import { transactionKeys } from './transaction-key'

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransaction }) =>
      TransactionService.updateTransaction(id, data),
    onSuccess: updatedTransaction => {
      notify.success('Transaction updated successfully')
      queryClient.setQueryData(
        transactionKeys.detail(updatedTransaction.id!),
        updatedTransaction
      )

      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      })
    },
    onError: error => {
      notify.error('Failed to update transaction', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      })
    },
  })
}
