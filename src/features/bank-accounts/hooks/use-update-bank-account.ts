import { notify } from '@/lib/toast'
import type { BankAccount, UpdateBankAccount } from '@/lib/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bankAccountKeys } from './bank-account-keys'

export function useUpdateBankAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateBankAccount
    }) => {
      const response = await fetch(`/api/bank-account/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update bank account')
      }
      const result = await response.json()
      return result.data
    },
    onSuccess: (updatedAccount: BankAccount) => {
      if (updatedAccount.id) {
        queryClient.setQueryData(
          bankAccountKeys.detail(updatedAccount.id),
          updatedAccount
        )
      }
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.lists() })
      notify.success('Bank account updated successfully')
    },
    onError: (error: Error) => {
      notify.error(error.message || 'Failed to update bank account')
    },
  })
}
