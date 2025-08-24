import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTransaction } from "@/features/transactions/hooks/use-transactions";
import { useTransactionForm } from "@/features/transactions/hooks/use-transaction-form";
import type { Transaction } from "@/lib/schemas";

interface DialogDeleteTransactionProps {
  readonly isOpen: boolean;
  readonly transaction: Transaction | null;
}

export function DialogDeleteTransaction({
  isOpen,
  transaction,
}: DialogDeleteTransactionProps) {
  const { closeDeleteDialog } = useTransactionForm();
  const deleteTransaction = useDeleteTransaction();

  const confirmDelete = async () => {
    if (transaction?.id) {
      try {
        await deleteTransaction.mutateAsync(transaction.id);
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {transaction?.description}? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeDeleteDialog}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={deleteTransaction.isPending}
          >
            {deleteTransaction.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
