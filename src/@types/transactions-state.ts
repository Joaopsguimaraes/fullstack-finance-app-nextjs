import type { Transaction } from "@/lib/schemas";
import type { StateCreator } from "zustand";

export type TransactionsState = {
  typeFilter: "all" | "income" | "expense";
  searchQuery: string;
  categoryFilter: string;
  isFormOpen: boolean;
  editingTransaction: Transaction | null;
  deleteDialog: {
    isOpen: boolean;
    transaction: Transaction | null;
  };
};

export type TransactionStore = {
  setTypeFilter: (_arg: TransactionsState["typeFilter"]) => void;
  setSearchQuery: (_arg: TransactionsState["searchQuery"]) => void;
  setCategoryFilter: (_arg: TransactionsState["categoryFilter"]) => void;
  setIsFormOpen: (_arg: TransactionsState["isFormOpen"]) => void;
  setDeleteDialog: (_arg: TransactionsState["deleteDialog"]) => void;
  setEditingTransaction: (_arg: Transaction | undefined) => void;
} & TransactionsState;

export type TransactionSlice = StateCreator<
  TransactionStore,
  [],
  [],
  TransactionStore
>;
