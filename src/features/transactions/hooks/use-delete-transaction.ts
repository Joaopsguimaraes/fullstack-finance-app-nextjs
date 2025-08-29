import type { Transactions } from '@/lib/schemas'
import { notify } from '@/lib/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction-service'
import type { PaginatedResponse } from '../types/pagination'
import { transactionKeys } from './transaction-key'

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),
    onMutate: async deletedId => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() })

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData<
        PaginatedResponse<Transactions>
      >({
        queryKey: transactionKeys.lists(),
      })

      // Optimistically update all cached lists
      queryClient.setQueriesData<PaginatedResponse<Transactions>>(
        { queryKey: transactionKeys.lists() },
        old => {
          if (!old) return old
          return {
            ...old,
            data: old.data.filter(transaction => transaction.id !== deletedId),
            pagination: {
              ...old.pagination,
              totalCount: Math.max(0, old.pagination.totalCount - 1),
            },
          }
        }
      )

      // Return a context object with the snapshotted value
      return { previousQueries }
    },
    onError: (error, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      notify.error('Failed to delete transaction', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      })
    },
    onSuccess: (_, deletedId) => {
      notify.success('Transaction deleted successfully')
      queryClient.removeQueries({
        queryKey: transactionKeys.detail(deletedId),
      })
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      })
    },
  })
}
