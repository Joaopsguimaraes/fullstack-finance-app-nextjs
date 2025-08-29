export interface PaginationParams {
  page: number
  limit: number
  type?: string
  category?: string
  search?: string
  sortBy?: 'date' | 'amount' | 'description'
  sortOrder?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
  accountId?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}
