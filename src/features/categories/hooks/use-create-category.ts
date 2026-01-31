import type { Category, CreateCategory } from '@/lib/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryKeys } from './category-keys'

async function createCategory(data: CreateCategory): Promise<Category> {
  const response = await fetch('/api/category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create category')
  }

  return response.json()
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
    },
  })
}
