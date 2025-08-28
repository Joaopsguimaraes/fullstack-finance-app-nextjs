import type {
  TransactionSlice,
  TransactionsState,
} from '@/@types/transactions-state'

const transactionsInitialState: TransactionsState = {
  typeFilter: 'all',
  searchQuery: 'all',
  categoryFilter: 'all',
  isFormOpen: false,
  deleteDialog: {
    isOpen: false,
    transaction: null,
  },
  editingTransaction: null,
}

const createTransactionSlice: TransactionSlice = set => ({
  ...transactionsInitialState,
  setTypeFilter: arg => set(() => ({ typeFilter: arg })),
  setSearchQuery: arg => set(() => ({ searchQuery: arg })),
  setCategoryFilter: arg => set(() => ({ categoryFilter: arg })),
  setIsFormOpen: arg => set(() => ({ isFormOpen: arg })),
  setDeleteDialog: arg => set(() => ({ deleteDialog: arg })),
  setEditingTransaction: arg => set(() => ({ editingTransaction: arg })),
})

export const transactionsSlice = createTransactionSlice
