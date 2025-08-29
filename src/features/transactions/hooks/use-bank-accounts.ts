import type { BankAccount } from '@/lib/schemas'
import { useQuery } from '@tanstack/react-query'

interface BankAccountsResponse {
  data: BankAccount[]
  message: string
}

async function fetchBankAccounts(): Promise<BankAccount[]> {
  const response = await fetch('/api/bank-account')

  if (!response.ok) {
    throw new Error('Failed to fetch bank accounts')
  }

  const result: BankAccountsResponse = await response.json()
  return result.data
}

export function useBankAccounts() {
  return useQuery({
    queryKey: ['bankAccounts'],
    queryFn: fetchBankAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
