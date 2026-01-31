'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useBankAccountForm } from '../hooks/use-bank-account-form'
import { useDeleteBankAccount } from '../hooks/use-delete-bank-account'

export function DialogDeleteBankAccount() {
  const { formState, closeDeleteDialog } = useBankAccountForm()
  const deleteBankAccount = useDeleteBankAccount()
  const { deleteDialog } = formState

  const confirmDelete = async () => {
    if (deleteDialog.account?.id) {
      await deleteBankAccount.mutateAsync(deleteDialog.account.id)
      closeDeleteDialog()
    }
  }

  return (
    <Dialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Bank Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;
            {deleteDialog.account?.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={closeDeleteDialog}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={confirmDelete}
            disabled={deleteBankAccount.isPending}
          >
            {deleteBankAccount.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
