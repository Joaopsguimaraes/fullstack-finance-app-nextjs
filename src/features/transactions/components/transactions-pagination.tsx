'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { memo, useMemo } from 'react'
import type { PaginationMeta } from '../types/pagination'

interface TransactionsPaginationProps {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

function TransactionsPaginationComponent({
  pagination,
  onPageChange,
  onLimitChange,
}: TransactionsPaginationProps) {
  const { page, limit, totalPages, hasNextPage, hasPreviousPage, totalCount } =
    pagination

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, page - halfVisible)
    let endPage = Math.min(totalPages, page + halfVisible)

    if (page <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages)
    } else if (page >= totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('ellipsis-start')
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      pages.push(totalPages)
    }

    return pages
  }, [page, totalPages])

  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, totalCount)

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='text-muted-foreground text-sm'>
        Showing {startItem} to {endItem} of {totalCount} transactions
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6'>
        <div className='flex min-w-sm items-center justify-end gap-2'>
          <span className='text-muted-foreground text-sm'>Items per page:</span>
          <Select
            value={String(limit)}
            onValueChange={value => onLimitChange(Number(value))}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => hasPreviousPage && onPageChange(page - 1)}
                className={
                  !hasPreviousPage
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {pageNumbers.map((pageNumber, index) => {
              if (
                pageNumber === 'ellipsis-start' ||
                pageNumber === 'ellipsis-end'
              ) {
                return (
                  <PaginationItem key={`${pageNumber}-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => onPageChange(pageNumber as number)}
                    isActive={pageNumber === page}
                    className='cursor-pointer'
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => hasNextPage && onPageChange(page + 1)}
                className={
                  !hasNextPage
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export const TransactionsPagination = memo(TransactionsPaginationComponent)
