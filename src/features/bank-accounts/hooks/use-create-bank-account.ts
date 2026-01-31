import { notify } from '@/lib/toast'
import type { CreateBankAccount } from '@/lib/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bankAccountKeys } from './bank-account-keys'

export function useCreateBankAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<CreateBankAccount, 'balance'> & { balance?: number }) => {
      const response = await fetch('/api/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create bank account')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.lists() })
      notify.success('Bank account created successfully')
    },
    onError: (error: Error) => {
      notify.error(error.message || 'Failed to create bank account')
    },
  })
}
