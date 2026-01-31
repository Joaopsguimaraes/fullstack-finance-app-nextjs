import { CreditCard, PiggyBank, TrendingUp, Wallet } from 'lucide-react'

export const accountIcons = {
  CHECKING: Wallet,
  SAVINGS: PiggyBank,
  CREDIT: CreditCard,
  INVESTMENT: TrendingUp,
} as const

export type AccountType = keyof typeof accountIcons
