import { useAppStore } from "@/lib/store";
import { useStore } from "@/store";
import { useCallback, useMemo, useState } from "react";
import { ITEMS_PER_PAGE } from "../constants/items-per-page";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const useTransactions = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { transactions, accounts } = useAppStore();
  const searchQuery = useStore.use.searchQuery();
  const typeFilter = useStore.use.typeFilter();
  const categoryFilter = useStore.use.categoryFilter();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex
  );

  const getAccountName = useCallback(
    (accountId: string) => {
      const account = accounts.find((a) => a.id === accountId);
      return account?.name || "Unknown Account";
    },
    [accounts]
  );

  const getTransactionIcon = useCallback((type: "income" | "expense") => {
    return type === "income" ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  }, []);

  return {
    filteredTransactions,
    getAccountName,
    getTransactionIcon,
    pagination: {
      currentPage,
      setCurrentPage,
      totalPages,
      startIndex,
      endIndex,
      paginatedTransactions,
    },
  };
};
