import { DialogDeleteTransaction } from '@/features/transactions/components/dialog-delete-transaction'
import { TransactionForm } from '@/features/transactions/components/transaction-form'
import { TransactionStats } from '@/features/transactions/components/transaction-stats'
import { TransactionTable } from '@/features/transactions/components/transaction-table'
import { ButtonCreateTransaction } from './button-create-transaction'

export function Transactions() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl tracking-tight'>Transactions</h1>
          <p className='text-muted-foreground'>
            Manage your income and expenses with enhanced filtering and search
          </p>
        </div>
        <ButtonCreateTransaction />
      </div>
      <TransactionStats />
      <TransactionTable />
      <TransactionForm />
      <DialogDeleteTransaction />
    </div>
  )
}
