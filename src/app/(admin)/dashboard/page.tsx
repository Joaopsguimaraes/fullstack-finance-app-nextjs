import { OverviewCards } from "@/features/dashboard/components/overview-cards";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import {
  SpendingChart,
  SpendingPieChart,
} from "@/features/dashboard/components/spending-chart";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here an overview of your finances.
        </p>
      </div>

      <OverviewCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Spending chart */}
        <div className="lg:col-span-2">
          <SpendingChart />
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
      </div>

      {/* Pie chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <SpendingPieChart />

        {/* Quick actions card */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Add Transaction</div>
              <div className="text-sm text-muted-foreground">
                Record income or expense
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Create Budget</div>
              <div className="text-sm text-muted-foreground">
                Set spending limits
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Add Account</div>
              <div className="text-sm text-muted-foreground">
                Link bank or credit card
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Set Financial Goal</div>
              <div className="text-sm text-muted-foreground">
                Plan for the future
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
