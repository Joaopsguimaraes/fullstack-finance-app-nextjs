import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GenericError } from '../../../helpers'

export interface MonthlyData {
  month: string
  income: number
  expense: number
  net: number
}

export interface ChartData {
  monthlyData: MonthlyData[]
  summary: {
    totalIncome: number
    totalExpense: number
    netAmount: number
    averageIncome: number
    averageExpense: number
  }
}

export class ChartDataService {
  static async getMonthlyIncomeExpenseData(): Promise<ChartData> {
    const session = await auth()
    if (!session?.user?.id) {
      throw new GenericError('User not authenticated')
    }

    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: sixMonthsAgo,
          lte: endOfCurrentMonth,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    return this.processMonthlyData(transactions, sixMonthsAgo, now)
  }

  static async getCurrentYearIncomeExpenseData(): Promise<ChartData> {
    const session = await auth()
    if (!session?.user?.id) {
      throw new GenericError('User not authenticated')
    }

    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear(), 11, 31)

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    return this.processMonthlyData(transactions, startOfYear, now)
  }

  private static processMonthlyData(
    transactions: Array<{
      date: Date
      amount: number
      type: string
    }>,
    startDate: Date,
    endDate: Date
  ): ChartData {
    const monthlyMap = new Map<string, MonthlyData>()

    const current = new Date(startDate)
    while (current <= endDate) {
      const monthKey = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`
      const monthName = current.toLocaleString('pt-BR', {
        month: 'short',
        year: '2-digit',
      })

      monthlyMap.set(monthKey, {
        month: monthName,
        income: 0,
        expense: 0,
        net: 0,
      })

      current.setMonth(current.getMonth() + 1)
    }

    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      const monthData = monthlyMap.get(monthKey)

      if (monthData) {
        const amount = parseFloat(transaction.amount.toString())

        if (transaction.type === 'INCOME') {
          monthData.income += amount
        } else if (transaction.type === 'EXPENSE') {
          monthData.expense += amount
        }

        monthData.net = monthData.income - monthData.expense
      }
    })

    const monthlyData = Array.from(monthlyMap.values())

    const summary = monthlyData.reduce(
      (acc, month) => {
        acc.totalIncome += month.income
        acc.totalExpense += month.expense
        return acc
      },
      {
        totalIncome: 0,
        totalExpense: 0,
        netAmount: 0,
        averageIncome: 0,
        averageExpense: 0,
      }
    )

    summary.netAmount = summary.totalIncome - summary.totalExpense
    summary.averageIncome =
      monthlyData.length > 0 ? summary.totalIncome / monthlyData.length : 0
    summary.averageExpense =
      monthlyData.length > 0 ? summary.totalExpense / monthlyData.length : 0

    return {
      monthlyData,
      summary,
    }
  }

  static async getCurrentMonthCategoryData(): Promise<
    {
      category: string
      amount: number
      percentage: number
    }[]
  > {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const expenses = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        type: 'EXPENSE',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    })

    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        const category = expense.category
        const amount = parseFloat(expense.amount.toString())
        acc[category] = (acc[category] || 0) + amount
        return acc
      },
      {} as Record<string, number>
    )

    const totalExpenses = Object.values(categoryTotals).reduce(
      (sum, amount) => sum + amount,
      0
    )

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }
}
