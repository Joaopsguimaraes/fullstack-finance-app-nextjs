import type { Category } from '@/lib/schemas'
import { useQuery } from '@tanstack/react-query'
import { categoryKeys } from './category-keys'

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('/api/category')

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
