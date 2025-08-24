import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Transaction, Account, Budget, Investment, Goal } from "./schemas";

/**
 * Application state interface
 */
interface AppState {
  // User state
  user: User;

  // Financial data
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  investments: Investment[];
  goals: Goal[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AppState["user"]) => void;
  logout: () => void;

  // Transaction actions
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Account actions
  addAccount: (account: Account) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Budget actions
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Investment actions
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;

  // Goal actions
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Initial state
 */
const initialState = {
  user: {
    id: null,
    email: null,
    firstName: null,
    lastName: null,
    isAuthenticated: false,
  },
  transactions: [],
  accounts: [],
  budgets: [],
  investments: [],
  goals: [],
  isLoading: false,
  error: null,
};

/**
 * Zustand store with persistence and devtools
 */
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // User actions
        setUser: (user) => set({ user }),
        logout: () => set({ user: initialState.user }),

        // Transaction actions
        addTransaction: (transaction) =>
          set((state) => ({
            transactions: [
              ...state.transactions,
              { ...transaction, id: transaction.id || crypto.randomUUID() },
            ],
          })),

        updateTransaction: (id, transaction) =>
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, ...transaction } : t
            ),
          })),

        deleteTransaction: (id) =>
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
          })),

        // Account actions
        addAccount: (account) =>
          set((state) => ({
            accounts: [
              ...state.accounts,
              { ...account, id: account.id || crypto.randomUUID() },
            ],
          })),

        updateAccount: (id, account) =>
          set((state) => ({
            accounts: state.accounts.map((a) =>
              a.id === id ? { ...a, ...account } : a
            ),
          })),

        deleteAccount: (id) =>
          set((state) => ({
            accounts: state.accounts.filter((a) => a.id !== id),
          })),

        // Budget actions
        addBudget: (budget) =>
          set((state) => ({
            budgets: [
              ...state.budgets,
              { ...budget, id: budget.id || crypto.randomUUID() },
            ],
          })),

        updateBudget: (id, budget) =>
          set((state) => ({
            budgets: state.budgets.map((b) =>
              b.id === id ? { ...b, ...budget } : b
            ),
          })),

        deleteBudget: (id) =>
          set((state) => ({
            budgets: state.budgets.filter((b) => b.id !== id),
          })),

        // Investment actions
        addInvestment: (investment) =>
          set((state) => ({
            investments: [
              ...state.investments,
              { ...investment, id: investment.id || crypto.randomUUID() },
            ],
          })),

        updateInvestment: (id, investment) =>
          set((state) => ({
            investments: state.investments.map((i) =>
              i.id === id ? { ...i, ...investment } : i
            ),
          })),

        deleteInvestment: (id) =>
          set((state) => ({
            investments: state.investments.filter((i) => i.id !== id),
          })),

        // Goal actions
        addGoal: (goal) =>
          set((state) => ({
            goals: [
              ...state.goals,
              { ...goal, id: goal.id || crypto.randomUUID() },
            ],
          })),

        updateGoal: (id, goal) =>
          set((state) => ({
            goals: state.goals.map((g) =>
              g.id === id ? { ...g, ...goal } : g
            ),
          })),

        deleteGoal: (id) =>
          set((state) => ({
            goals: state.goals.filter((g) => g.id !== id),
          })),

        // UI actions
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
      }),
      {
        name: "finance-app-storage",
        partialize: (state) => ({
          user: state.user,
          transactions: state.transactions,
          accounts: state.accounts,
          budgets: state.budgets,
          investments: state.investments,
          goals: state.goals,
        }),
      }
    ),
    {
      name: "finance-app-store",
    }
  )
);
