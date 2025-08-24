import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { useStore } from "@/store";

export function DialogDeleteTransaction() {
  const { deleteTransaction } = useAppStore();
  const setDeleteDialog = useStore.use.setDeleteDialog();
  const deleteDialog = useStore.use.deleteDialog();

  const confirmDelete = () => {
    if (deleteDialog.transaction?.id) {
      deleteTransaction(deleteDialog.transaction.id);
      setDeleteDialog({ isOpen: false, transaction: null });
    }
  };

  return (
    <Dialog
      open={deleteDialog.isOpen}
      onOpenChange={(open) =>
        setDeleteDialog({ isOpen: open, transaction: null })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "
            {deleteDialog.transaction?.description}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              setDeleteDialog({ isOpen: false, transaction: null })
            }
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
