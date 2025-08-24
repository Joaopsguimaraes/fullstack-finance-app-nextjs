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
import { Plus, Target, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function GoalsPage() {
  const { goals } = useAppStore();

  const getGoalProgress = (goal: any) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const daysLeft = Math.ceil(
      (new Date(goal.targetDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return { percentage: Math.min(percentage, 100), remaining, daysLeft };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Financial Goals
            </h1>
            <p className="text-muted-foreground">
              Set and track your financial objectives
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Set Goal
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = getGoalProgress(goal);
            const isCompleted = progress.percentage >= 100;
            const isOverdue = progress.daysLeft < 0;

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Target className="h-6 w-6" />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <CardDescription>{goal.category}</CardDescription>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                        goal.priority
                      )}`}
                    >
                      {goal.priority}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Saved
                      </span>
                      <span className="font-medium">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Target
                      </span>
                      <span className="font-medium">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span
                          className={
                            isCompleted ? "text-green-600" : "text-blue-600"
                          }
                        >
                          {progress.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCompleted ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Target Date
                        </span>
                      </div>
                      <span
                        className={
                          isOverdue ? "text-red-600" : "text-muted-foreground"
                        }
                      >
                        {format(new Date(goal.targetDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                    {!isCompleted && (
                      <div className="text-sm text-muted-foreground">
                        {isOverdue ? (
                          <span className="text-red-600">
                            Overdue by {Math.abs(progress.daysLeft)} days
                          </span>
                        ) : (
                          <span>{progress.daysLeft} days remaining</span>
                        )}
                      </div>
                    )}
                    {isCompleted && (
                      <div className="text-sm text-green-600 font-medium">
                        Goal completed! 🎉
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {goals.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">
                Set your first financial goal to start planning for the future
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
