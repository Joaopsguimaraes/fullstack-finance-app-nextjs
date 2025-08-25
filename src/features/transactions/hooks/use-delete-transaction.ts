import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionService } from "../services/transaction-service";
import { showToast } from "@/lib/toast";
import { transactionKeys } from "./transaction-key";

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