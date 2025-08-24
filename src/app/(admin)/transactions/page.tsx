"use client";

import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { Button } from "@/components/ui/button";
import { DialogDeleteTransaction } from "@/features/transactions/components/dialog-delete-transaction";
import { FilterTransactions } from "@/features/transactions/components/filter-transactions";
import { ResultsSummary } from "@/features/transactions/components/results-summary";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import { useTransactionForm } from "@/features/transactions/hooks/use-transaction-form";
import { Plus } from "lucide-react";

export default function TransactionsPage() {
  const { formState, openCreateForm } = useTransactionForm();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <FilterTransactions />
      <ResultsSummary />
      <TransactionsTable />
      <TransactionForm
        mode={formState.editingTransaction ? "edit" : "create"}
        isOpen={formState.isFormOpen}
        editingTransaction={formState.editingTransaction}
      />
      <DialogDeleteTransaction
        isOpen={formState.deleteDialog.isOpen}
        transaction={formState.deleteDialog.transaction}
      />
    </div>
  );
}
