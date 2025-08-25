'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTransaction } from "@/features/transactions/hooks/use-delete-transaction";
import { useTransactionForm } from "@/features/transactions/hooks/use-transaction-form";

export function DialogDeleteTransaction() {
  const { closeDeleteDialog, formState } = useTransactionForm();
  const deleteTransaction = useDeleteTransaction();

  const { deleteDialog: { transaction, isOpen }} = formState

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
