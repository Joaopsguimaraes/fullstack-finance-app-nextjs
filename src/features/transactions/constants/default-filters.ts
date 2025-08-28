export interface TransactionFilters {
  page: number
  limit: number
  type: string
  category: string
  search: string
}

export const DEFAULT_FILTERS: TransactionFilters = {
  page: 1,
  limit: 10,
  type: 'all',
  category: 'all',
  search: '',
}
