import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { DialogDeleteTransaction } from "@/features/transactions/components/dialog-delete-transaction";
import { FilterTransactions } from "@/features/transactions/components/filter-transactions";
import { ResultsSummary } from "@/features/transactions/components/results-summary";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import { ButtonCreateTransaction } from "./button-create-transaction";

export function Transactions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <ButtonCreateTransaction />
      </div>
      <FilterTransactions />
      <ResultsSummary />
      <TransactionsTable />
      <TransactionForm />
      <DialogDeleteTransaction />
    </div>
  );
}
