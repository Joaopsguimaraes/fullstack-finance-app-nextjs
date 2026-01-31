import { ChartDataService } from '../services/chart-data-service'
import { IncomeExpenseChart } from './income-expense-chart'

export async function ChartAsync() {
  const chartDataResult = await ChartDataService.getMonthlyIncomeExpenseData()

  return <IncomeExpenseChart data={chartDataResult.monthlyData} />
}
