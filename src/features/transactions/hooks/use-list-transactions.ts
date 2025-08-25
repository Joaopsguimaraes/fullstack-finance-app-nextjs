import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "./transaction-key";
import { TransactionService } from "../services/transaction-service";

export const useListTransactions = (params: {
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