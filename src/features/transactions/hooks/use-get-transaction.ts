import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "./transaction-key";
import { TransactionService } from "../services/transaction-service";

export const useGetTransaction = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => TransactionService.getTransaction(id),
    enabled: !!id,
  });
};