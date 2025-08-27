"use client";

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
  const { deleteDialog } = formState;

  const confirmDelete = async () => {
    if (deleteDialog.transaction?.id) {
      await deleteTransaction.mutateAsync(deleteDialog.transaction.id);

      closeDeleteDialog();
    }
  };

  return (
    <Dialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {deleteDialog.transaction?.description}? This action cannot be
            undone.
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
