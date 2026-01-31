'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { accountIcons } from '@/features/bank-accounts/constants/account-icons'
import type { BankAccountInfo } from '@/services/bank-account-service'
import { formatCurrency } from '@/utils/format-currency'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface AccountBalancesProps {
  accounts: BankAccountInfo[]
}

export function AccountBalances({ accounts }: AccountBalancesProps) {
  return (
    <Card className='bg-background border-border w-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Account Balances</CardTitle>
        <Link
          href='/accounts'
          className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors'
        >
          View all
          <ArrowRight className='h-4 w-4' />
        </Link>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {accounts.map(account => {
            const Icon =
              accountIcons[
                account.type as keyof typeof accountIcons
              ]
            return (
              <Link
                key={account.id}
                href='/accounts'
                className='hover:bg-muted/50 group rounded-lg border p-4 transition-colors'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <Icon className='text-muted-foreground h-4 w-4' />
                      <p className='text-muted-foreground text-xs font-medium uppercase tracking-wide'>
                        {account.type === 'CHECKING' && 'Checking'}
                        {account.type === 'SAVINGS' && 'Savings'}
                        {account.type === 'CREDIT' && 'Credit'}
                        {account.type === 'INVESTMENT' && 'Investment'}
                      </p>
                    </div>
                    <p className='mt-1 truncate text-sm font-medium'>
                      {account.name}
                    </p>
                    <p className='mt-2 text-xl font-bold'>
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        {accounts.length === 0 && (
          <p className='text-muted-foreground py-8 text-center text-sm'>
            No accounts found
          </p>
        )}
      </CardContent>
    </Card>
  )
}
