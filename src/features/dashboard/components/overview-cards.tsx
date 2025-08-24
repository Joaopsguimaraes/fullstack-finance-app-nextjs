"use client";

import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

function OverviewCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
}: OverviewCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="ml-1">
            {change > 0 ? "+" : ""}
            {change}% {changeLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewCards() {
  const { transactions, accounts } = useAppStore();

  // Calculate financial metrics
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  const monthlyIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const netIncome = monthlyIncome - monthlyExpenses;

  // Calculate month-over-month changes (simplified)
  const previousMonthIncome = monthlyIncome * 0.95; // Mock data
  const previousMonthExpenses = monthlyExpenses * 1.02; // Mock data
  const incomeChange =
    previousMonthIncome > 0
      ? ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100
      : 0;
  const expenseChange =
    previousMonthExpenses > 0
      ? ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) *
        100
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Total Balance"
        value={formatCurrency(totalBalance)}
        change={2.5}
        changeLabel="from last month"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend="up"
      />
      <OverviewCard
        title="Monthly Income"
        value={formatCurrency(monthlyIncome)}
        change={incomeChange}
        changeLabel="from last month"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        trend={incomeChange >= 0 ? "up" : "down"}
      />
      <OverviewCard
        title="Monthly Expenses"
        value={formatCurrency(monthlyExpenses)}
        change={expenseChange}
        changeLabel="from last month"
        icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
        trend={expenseChange <= 0 ? "up" : "down"}
      />
      <OverviewCard
        title="Net Income"
        value={formatCurrency(netIncome)}
        change={netIncome >= 0 ? 5.2 : -3.1}
        changeLabel="from last month"
        icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
        trend={netIncome >= 0 ? "up" : "down"}
      />
    </div>
  );
}
