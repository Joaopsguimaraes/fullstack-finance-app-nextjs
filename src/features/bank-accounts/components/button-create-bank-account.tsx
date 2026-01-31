'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useBankAccountForm } from '../hooks/use-bank-account-form'

export function ButtonCreateBankAccount() {
  const { openCreateForm } = useBankAccountForm()

  return (
    <Button onClick={openCreateForm}>
      <Plus className='mr-2 h-4 w-4' />
      Create Account
    </Button>
  )
}
