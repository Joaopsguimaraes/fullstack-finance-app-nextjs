"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { Transaction } from "@/lib/schemas";

export interface TransactionFormState {
  isFormOpen: boolean;
  editingTransaction: Transaction | null;
  deleteDialog: {
    isOpen: boolean;
    transaction: Transaction | null;
  };
}

/**
 * Hook to manage transaction form state using URL search params
 */
export const useTransactionForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current form state from URL
  const formState = useMemo(() => {
    const params = new URLSearchParams(searchParams);

    return {
      isFormOpen: params.get("form") === "open",
      editingTransaction: params.get("edit")
        ? JSON.parse(decodeURIComponent(params.get("edit")!))
        : null,
      deleteDialog: {
        isOpen: params.get("delete") === "open",
        transaction: params.get("deleteTransaction")
          ? JSON.parse(decodeURIComponent(params.get("deleteTransaction")!))
          : null,
      },
    };
  }, [searchParams]);

  // Update URL with form state
  const updateFormState = useCallback(
    (updates: Partial<TransactionFormState>) => {
      const params = new URLSearchParams(searchParams);

      // Handle form open/close
      if (updates.isFormOpen !== undefined) {
        if (updates.isFormOpen) {
          params.set("form", "open");
        } else {
          params.delete("form");
          params.delete("edit"); // Clear edit data when closing form
        }
      }

      // Handle editing transaction
      if (updates.editingTransaction !== undefined) {
        if (updates.editingTransaction) {
          params.set(
            "edit",
            encodeURIComponent(JSON.stringify(updates.editingTransaction))
          );
          params.set("form", "open");
        } else {
          params.delete("edit");
        }
      }

      // Handle delete dialog
      if (updates.deleteDialog !== undefined) {
        if (updates.deleteDialog.isOpen) {
          params.set("delete", "open");
          if (updates.deleteDialog.transaction) {
            params.set(
              "deleteTransaction",
              encodeURIComponent(
                JSON.stringify(updates.deleteDialog.transaction)
              )
            );
          }
        } else {
          params.delete("delete");
          params.delete("deleteTransaction");
        }
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  // Open form for creating new transaction
  const openCreateForm = useCallback(() => {
    updateFormState({
      isFormOpen: true,
      editingTransaction: null,
    });
  }, [updateFormState]);

  // Open form for editing transaction
  const openEditForm = useCallback(
    (transaction: Transaction) => {
      updateFormState({
        isFormOpen: true,
        editingTransaction: transaction,
      });
    },
    [updateFormState]
  );

  // Close form
  const closeForm = useCallback(() => {
    updateFormState({
      isFormOpen: false,
      editingTransaction: null,
    });
  }, [updateFormState]);

  // Open delete dialog
  const openDeleteDialog = useCallback(
    (transaction: Transaction) => {
      updateFormState({
        deleteDialog: {
          isOpen: true,
          transaction,
        },
      });
    },
    [updateFormState]
  );

  // Close delete dialog
  const closeDeleteDialog = useCallback(() => {
    updateFormState({
      deleteDialog: {
        isOpen: false,
        transaction: null,
      },
    });
  }, [updateFormState]);

  return {
    formState,
    openCreateForm,
    openEditForm,
    closeForm,
    openDeleteDialog,
    closeDeleteDialog,
  };
};
