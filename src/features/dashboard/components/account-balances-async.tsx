import { auth } from '@/lib/auth'
import { BankAccountService } from '@/services/bank-account-service'
import { AccountBalances } from './account-balances'

export async function AccountBalancesAsync() {
  const session = await auth()

  if (!session?.user?.id) {
    return <AccountBalances accounts={[]} />
  }

  const accounts = await BankAccountService.getUserBankAccounts(session.user.id)

  return <AccountBalances accounts={accounts} />
}
