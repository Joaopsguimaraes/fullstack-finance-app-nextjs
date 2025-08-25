'use client'

import { formatCurrency } from "@/lib/utils";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { useTransactionFilters } from "@/features/transactions/hooks/use-transaction-filters";

export function ResultsSummary() {
  const { filters } = useTransactionFilters();
  const { data, isLoading } = useTransactions(filters);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Loading...</span>
      </div>
    );
  }

  const { transactions, total, page, limit } = data;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + transactions.length;

  const totalAmount = transactions.reduce(
    (sum, t) => sum + (t.type === "INCOME" ? t.amount : -t.amount),
    0
  );

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Showing {startIndex + 1}-{endIndex} of {total} transactions
      </span>
      <span>Total: {formatCurrency(totalAmount)}</span>
    </div>
  );
}
