import type { CreateTransaction, UpdateTransaction } from "@/lib/schemas";
import { TransactionService } from "@/features/transactions/services/transaction-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

export const useTransactions = (params: {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => TransactionService.getTransactions(params),
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => TransactionService.getTransaction(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransaction) =>
      TransactionService.createTransaction(data),
    onSuccess: () => {
      showToast.success("Transaction created successfully");
      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
    },
    onError: (error) => {
      showToast.error("Failed to create transaction", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransaction }) =>
      TransactionService.updateTransaction(id, data),
    onSuccess: (updatedTransaction) => {
      showToast.success("Transaction updated successfully");
      queryClient.setQueryData(
        transactionKeys.detail(updatedTransaction.id!),
        updatedTransaction
      );

      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
    },
    onError: (error) => {
      showToast.error("Failed to update transaction", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),
    onSuccess: (_, deletedId) => {
      showToast.success("Transaction deleted successfully");
      queryClient.removeQueries({
        queryKey: transactionKeys.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
    },
    onError: (error) => {
      showToast.error("Failed to delete transaction", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });
};
