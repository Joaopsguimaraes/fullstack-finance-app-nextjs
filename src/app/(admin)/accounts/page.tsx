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
import {
  Plus,
  CreditCard,
  PiggyBank,
  Building2,
  TrendingUp,
} from "lucide-react";

export default function AccountsPage() {
  const { accounts } = useAppStore();

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-6 w-6" />;
      case "savings":
        return <PiggyBank className="h-6 w-6" />;
      case "credit":
        return <CreditCard className="h-6 w-6" />;
      case "investment":
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Building2 className="h-6 w-6" />;
    }
  };

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">
              Manage your bank accounts and credit cards
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* Total Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>Across all your accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
          </CardContent>
        </Card>

        {/* Accounts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {getAccountIcon(account.type)}
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {account.type}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(account.balance)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {account.currency}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <PiggyBank className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first account to start tracking your finances
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
