import { notify } from '@/lib/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction-service'
import { transactionKeys } from './transaction-key'

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),
    onSuccess: (_, deletedId) => {
      notify.success('Transaction deleted successfully')
      queryClient.removeQueries({
        queryKey: transactionKeys.detail(deletedId),
      })

      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      })
    },
    onError: error => {
      notify.error('Failed to delete transaction', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      })
    },
  })
}
