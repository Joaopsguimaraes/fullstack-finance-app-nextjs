import { prisma } from '@/lib/prisma'
import { GenericError } from '../helpers/generic-error'

export interface CreateBankAccountData {
  name: string
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT'
  balance?: number
  userId: string
}

export interface BankAccountInfo {
  id: string
  name: string
  type: string
  balance: number
  userId: string
}

export class BankAccountService {
  static async createDefaultWallet(userId: string): Promise<BankAccountInfo> {
    try {
      const existingWallet = await this.getDefaultWallet(userId)

      if (existingWallet) {
        return existingWallet
      }

      const bankAccount = await prisma.bankAccount.create({
        data: {
          name: 'Wallet',
          type: 'CHECKING',
          balance: 0,
          userId,
        },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          userId: true,
        },
      })

      return bankAccount
    } catch (error) {
      console.error('Default wallet creation failed:', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })

      if (error instanceof Error) {
        throw error
      }

      throw new GenericError(
        'Failed to create default wallet. Please try again.'
      )
    }
  }

  static async getDefaultWallet(
    userId: string
  ): Promise<BankAccountInfo | null> {
    try {
      const bankAccount = await prisma.bankAccount.findFirst({
        where: {
          userId,
          name: 'Wallet',
          type: 'CHECKING',
        },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          userId: true,
        },
      })

      return bankAccount
    } catch (error) {
      console.error('Get default wallet error:', error)
      return null
    }
  }

  static async createBankAccount(
    data: CreateBankAccountData
  ): Promise<BankAccountInfo> {
    try {
      const bankAccount = await prisma.bankAccount.create({
        data: {
          name: data.name,
          type: data.type,
          balance: data.balance || 0,
          userId: data.userId,
        },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          userId: true,
        },
      })

      return bankAccount
    } catch (error) {
      console.error('Bank account creation failed:', {
        data,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })

      if (error instanceof Error) {
        throw error
      }

      throw new GenericError('Failed to create bank account. Please try again.')
    }
  }

  static async getUserBankAccounts(userId: string): Promise<BankAccountInfo[]> {
    try {
      const bankAccounts = await prisma.bankAccount.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          userId: true,
        },
        orderBy: [{ name: 'asc' }],
      })

      return bankAccounts
    } catch (error) {
      console.error('Get user bank accounts error:', error)
      return []
    }
  }

  static async ensureDefaultWallet(userId: string): Promise<BankAccountInfo> {
    try {
      const existingWallet = await this.getDefaultWallet(userId)

      if (existingWallet) {
        return existingWallet
      }

      return await this.createDefaultWallet(userId)
    } catch (error) {
      console.error('Ensure default wallet error:', error)
      throw new GenericError('Failed to ensure default wallet exists.')
    }
  }

  /**
   * Checks if user has any bank accounts
   */
  static async userHasBankAccounts(userId: string): Promise<boolean> {
    try {
      const count = await prisma.bankAccount.count({
        where: { userId },
      })

      return count > 0
    } catch (error) {
      console.error('Check user bank accounts error:', error)
      return false
    }
  }
}
