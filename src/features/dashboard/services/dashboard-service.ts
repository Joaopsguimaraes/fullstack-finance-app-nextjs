import { GenericError, getCurrentMonthForAPI } from '@/helpers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Transactions } from '@/lib/schemas'
import { cache } from 'react'
import type { DashboardStats, DashboardTransaction } from '../types'
import { ChartDataService, type MonthlyData } from './chart-data-service'

export class DashboardService {
  static async getCurrentMonthTransactions(): Promise<Transactions[]> {
    const session = await auth()
    if (!session?.user?.id) {
      throw new GenericError('User not authenticated')
    }

    const { startDate, endDate } = getCurrentMonthForAPI()

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        bankAccount: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    return transactions.map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      type: transaction.type as 'INCOME' | 'EXPENSE',
      amount: transaction.amount.toString(),
      category: transaction.category,
      accountId: transaction.bankAccountId,
      date: transaction.date,
      userId: transaction.userId,
      bankAccount: transaction.bankAccount,
    })) as Transactions[]
  }

  static calculateStats(
    transactions: Transactions[]
  ): Omit<DashboardStats, 'iconName'>[] {
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const totalBalance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0

    return [
      {
        title: 'Total Balance',
        value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(totalBalance),
      },
      {
        title: 'Monthly Income',
        value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(totalIncome),
      },
      {
        title: 'Monthly Expenses',
        value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(totalExpenses),
      },
      {
        title: 'Savings Rate',
        value: `${savingsRate.toFixed(1)}%`,
      },
    ]
  }

  static transformToRecentTransactions(
    transactions: Transactions[],
    limit = 5
  ): Omit<DashboardTransaction, 'iconName'>[] {
    return transactions.slice(0, limit).map(transaction => ({
      id: transaction.id || '',
      description: transaction.description,
      amount: parseFloat(transaction.amount),
      type:
        transaction.type === 'INCOME'
          ? ('income' as const)
          : ('expense' as const),
      category: transaction.category,
      date:
        typeof transaction.date === 'string'
          ? transaction.date
          : transaction.date.toISOString(),
    }))
  }

  static getDashboardData = cache(async (): Promise<{
    transactions: Transactions[]
    stats: Omit<DashboardStats, 'iconName'>[]
    recentTransactions: Omit<DashboardTransaction, 'iconName'>[]
    chartData: MonthlyData[]
  }> => {
    try {
      const [transactions, chartDataResult] = await Promise.all([
        DashboardService.getCurrentMonthTransactions(),
        ChartDataService.getMonthlyIncomeExpenseData(),
      ])

      const stats = DashboardService.calculateStats(transactions)
      const recentTransactions =
        DashboardService.transformToRecentTransactions(transactions)

      return {
        transactions,
        stats,
        recentTransactions,
        chartData: chartDataResult.monthlyData,
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)

      if (
        error instanceof Error &&
        error.message === 'User not authenticated'
      ) {
        throw error
      }

      return {
        transactions: [],
        stats: DashboardService.getEmptyStats(),
        recentTransactions: [],
        chartData: [],
      }
    }
  })

  private static getEmptyStats(): Omit<DashboardStats, 'iconName'>[] {
    return [
      {
        title: 'Total Balance',
        value: '$0.00',
      },
      {
        title: 'Monthly Income',
        value: '$0.00',
      },
      {
        title: 'Monthly Expenses',
        value: '$0.00',
      },
      {
        title: 'Savings Rate',
        value: '0.0%',
      },
    ]
  }
}
