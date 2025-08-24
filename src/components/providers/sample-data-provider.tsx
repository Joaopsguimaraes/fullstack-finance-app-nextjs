"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  sampleTransactions,
  sampleAccounts,
  sampleBudgets,
  sampleInvestments,
  sampleGoals,
} from "@/lib/sample-data";

interface SampleDataProviderProps {
  children: React.ReactNode;
}

export function SampleDataProvider({ children }: SampleDataProviderProps) {
  const {
    transactions,
    accounts,
    budgets,
    investments,
    goals,
    addTransaction,
    addAccount,
    addBudget,
    addInvestment,
    addGoal,
  } = useAppStore();

  useEffect(() => {
    if (transactions.length === 0) {
      sampleTransactions.forEach((transaction) => {
        addTransaction(transaction);
      });
    }

    if (accounts.length === 0) {
      sampleAccounts.forEach((account) => {
        addAccount(account);
      });
    }

    if (budgets.length === 0) {
      sampleBudgets.forEach((budget) => {
        addBudget(budget);
      });
    }

    if (investments.length === 0) {
      sampleInvestments.forEach((investment) => {
        addInvestment(investment);
      });
    }

    if (goals.length === 0) {
      sampleGoals.forEach((goal) => {
        addGoal(goal);
      });
    }
  }, [
    transactions.length,
    accounts.length,
    budgets.length,
    investments.length,
    goals.length,
    addTransaction,
    addAccount,
    addBudget,
    addInvestment,
    addGoal,
  ]);

  return <>{children}</>;
}
