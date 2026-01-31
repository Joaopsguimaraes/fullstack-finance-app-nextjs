import { notify } from '@/lib/toast'
import type { BankAccount } from '@/lib/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bankAccountKeys } from './bank-account-keys'

export function useDeleteBankAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/bank-account/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete bank account')
      }
      return response.json()
    },
    onMutate: async deletedId => {
      await queryClient.cancelQueries({ queryKey: bankAccountKeys.lists() })

      const previousQueries = queryClient.getQueriesData<BankAccount[]>({
        queryKey: bankAccountKeys.lists(),
      })

      queryClient.setQueriesData<BankAccount[]>(
        { queryKey: bankAccountKeys.lists() },
        old => {
          if (!old) return old
          return old.filter(account => account.id !== deletedId)
        }
      )

      return { previousQueries }
    },
    onError: (error, _, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      notify.error(
        error instanceof Error ? error.message : 'Failed to delete bank account'
      )
    },
    onSuccess: (_, deletedId) => {
      notify.success('Bank account deleted successfully')
      queryClient.removeQueries({
        queryKey: bankAccountKeys.detail(deletedId),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: bankAccountKeys.lists(),
      })
    },
  })
}
