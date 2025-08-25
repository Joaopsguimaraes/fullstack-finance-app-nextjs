import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTransactionFilters } from "@/features/transactions/hooks/use-transaction-filters";
import { useListTransactions } from "@/features/transactions/hooks/use-list-transactions";

export function TransactionsPagination() {
  const { filters, setFilter } = useTransactionFilters();
  const { data } = useListTransactions(filters);

  if (!data || data.totalPages <= 1) {
    return null;
  }

  const { totalPages, page: currentPage } = data;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setFilter("page", Math.max(1, currentPage - 1))}
            size={"sm"}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              size={"sm"}
              isActive={currentPage === page}
              onClick={() => setFilter("page", page)}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            size={"sm"}
            onClick={() =>
              setFilter("page", Math.min(totalPages, currentPage + 1))
            }
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
