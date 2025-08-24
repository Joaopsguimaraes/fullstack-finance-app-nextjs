import { formatCurrency } from "@/lib/utils";
import { useTransactions } from "../hooks/use-transactions";

export function ResultsSummary() {
  const { pagination, filteredTransactions } = useTransactions();
  const { startIndex, endIndex } = pagination;

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Showing {startIndex + 1}-
        {Math.min(endIndex, filteredTransactions.length)} of{" "}
        {filteredTransactions.length} transactions
      </span>
      <span>
        Total:{" "}
        {formatCurrency(
          filteredTransactions.reduce(
            (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount),
            0
          )
        )}
      </span>
    </div>
  );
}
