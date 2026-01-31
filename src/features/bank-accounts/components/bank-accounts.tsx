'use client'

import { BankAccountForm } from './bank-account-form'
import { BankAccountTable } from './bank-account-table'
import { ButtonCreateBankAccount } from './button-create-bank-account'
import { DialogDeleteBankAccount } from './dialog-delete-bank-account'

export function BankAccounts() {
  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Bank Accounts</h1>
          <p className='text-muted-foreground mt-1'>
            Manage your bank accounts and balances
          </p>
        </div>
        <ButtonCreateBankAccount />
      </div>

      <BankAccountTable />
      <BankAccountForm />
      <DialogDeleteBankAccount />
    </div>
  )
}
