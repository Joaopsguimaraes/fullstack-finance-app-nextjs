import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/lib/schemas";
import { formatCurrency } from "@/lib/utils";
import { useTransactionForm } from "@/features/transactions/hooks/use-transaction-form";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { useTransactionFilters } from "@/features/transactions/hooks/use-transaction-filters";
import { format } from "date-fns";
import { Edit, Trash2, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getCategoryColor } from "../helpers/get-category-color";
import { TransactionsPagination } from "./transactions-pagination";

// Mock accounts data - replace with actual accounts hook
const mockAccounts = [
  { id: "1", name: "Checking Account", balance: 5000, type: "CHECKING" },
  { id: "2", name: "Savings Account", balance: 10000, type: "SAVINGS" },
];

export function TransactionsTable() {
  const { filters } = useTransactionFilters();
  const { data, isLoading, error } = useTransactions(filters);
  const { openEditForm, openDeleteDialog } = useTransactionForm();

  const getAccountName = (accountId: string) => {
    const account = mockAccounts.find((a) => a.id === accountId);
    return account?.name || "Unknown Account";
  };

  const getTransactionIcon = (type: "income" | "expense") => {
    return type === "income" ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const handleEdit = (transaction: Transaction) => {
    openEditForm(transaction);
  };

  const handleDelete = (transaction: Transaction) => {
    openDeleteDialog(transaction);
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <div className="text-muted-foreground">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <div className="text-destructive">Error loading transactions</div>
      </div>
    );
  }

  const transactions = data?.transactions || [];

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(
                        transaction.type as "income" | "expense"
                      )}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        transaction.category
                      )}`}
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className={
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>{getAccountName(transaction.accountId)}</TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <TransactionsPagination />
    </>
  );
}
