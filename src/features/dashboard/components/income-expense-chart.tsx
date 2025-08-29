'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCurrency } from '@/utils'
import type { MonthlyData } from '../services/chart-data-service'

interface IncomeExpenseChartProps {
  data: MonthlyData[]
  title?: string
  description?: string
  className?: string
}

export function IncomeExpenseChart({
  data,
  title = 'Income vs Expense',
  description = 'Last 6 months',
  className,
}: IncomeExpenseChartProps) {
  const chartConfig = {
    income: {
      label: 'Income',
      color: 'hsl(var(--chart-1))',
      theme: {
        light: '#22c55e', // green-500
        dark: '#16a34a', // green-600
      },
    },
    expense: {
      label: 'Despesas',
      color: 'hsl(var(--chart-2))',
      theme: {
        light: '#ef4444', // red-500
        dark: '#dc2626', // red-600
      },
    },
  }

  const summary = useMemo(() => {
    const totalIncome = data.reduce((sum, month) => sum + month.income, 0)
    const totalExpense = data.reduce((sum, month) => sum + month.expense, 0)
    const netAmount = totalIncome - totalExpense
    const netPercentage = totalIncome > 0 ? (netAmount / totalIncome) * 100 : 0

    return {
      totalIncome,
      totalExpense,
      netAmount,
      netPercentage,
      isPositive: netAmount >= 0,
    }
  }, [data])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              className='text-xs'
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className='text-xs'
              tickFormatter={value =>
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey='income'
              name='Income'
              fill='var(--color-income)'
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey='expense'
              name='Expense'
              fill='var(--color-expense)'
              radius={[0, 0, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 leading-none font-medium'>
          {summary.isPositive ? (
            <>
              <TrendingUp className='h-4 w-4 text-green-500' />
              <span className='text-green-600'>
                Positive balance of {formatCurrency(summary.netAmount)}
              </span>
            </>
          ) : (
            <>
              <TrendingDown className='h-4 w-4 text-red-500' />
              <span className='text-red-600'>
                Negative balance of{' '}
                {formatCurrency(Math.abs(summary.netAmount))}
              </span>
            </>
          )}
        </div>
        <div className='text-muted-foreground leading-none'>
          {summary.isPositive ? 'Positive balance' : 'Negative balance'} of{' '}
          {Math.abs(summary.netPercentage).toFixed(1)}% in relation to income
        </div>
      </CardFooter>
    </Card>
  )
}
