import { AppLayout } from "@/layout/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Plus, BarChart3, Target } from "lucide-react";

export default function BudgetsPage() {
  const { budgets, transactions } = useAppStore();

  const getBudgetProgress = (budget: any) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category &&
          new Date(t.date).getMonth() === currentMonth &&
          new Date(t.date).getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (spent / budget.amount) * 100;
    return { spent, percentage: Math.min(percentage, 100) };
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
            <p className="text-muted-foreground">
              Set and track your spending limits
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </div>

        {/* Budgets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = getBudgetProgress(budget);
            const isOverBudget = progress.percentage > 100;

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6" />
                    <div>
                      <CardTitle className="text-lg">{budget.name}</CardTitle>
                      <CardDescription>{budget.category}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Spent
                      </span>
                      <span className="font-medium">
                        {formatCurrency(progress.spent)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Budget
                      </span>
                      <span className="font-medium">
                        {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span
                          className={
                            isOverBudget ? "text-red-600" : "text-green-600"
                          }
                        >
                          {progress.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isOverBudget ? "bg-red-500" : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(progress.percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    {isOverBudget && (
                      <p className="text-sm text-red-600 font-medium">
                        Over budget by{" "}
                        {formatCurrency(progress.spent - budget.amount)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first budget to start tracking your spending
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
