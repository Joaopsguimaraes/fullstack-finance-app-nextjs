import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useTransactionFilters } from '@/features/transactions/hooks/use-transaction-filters'
import { useListTransactions } from '@/features/transactions/hooks/use-list-transactions'
import { useMemo } from 'react'

export function TransactionsPagination() {
  const { filters, setFilter } = useTransactionFilters()
  const { data } = useListTransactions(filters)

  const paginationValues = useMemo(() => {
    if (!data) {
      return {
        currentPage: 1,
        totalPages: 1,
      }
    } else {
      return {
        currentPage: data.page,
        totalPages: data.totalPages,
      }
    }
  }, [data])

  const paginationPrevious = () => {
    setFilter('page', Math.max(1, paginationValues.currentPage - 1))
  }

  const paginationNext = () => {
    setFilter(
      'page',
      Math.min(paginationValues.totalPages, paginationValues.currentPage + 1)
    )
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={paginationPrevious}
            size={'sm'}
            className={
              paginationValues.currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {Array.from(
          { length: paginationValues.totalPages },
          (_, i) => i + 1
        ).map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              size={'sm'}
              isActive={paginationValues.currentPage === page}
              onClick={() => setFilter('page', page)}
              className='cursor-pointer'
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            size={'sm'}
            onClick={paginationNext}
            className={
              paginationValues.currentPage === paginationValues.totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
