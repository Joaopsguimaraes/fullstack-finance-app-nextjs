import type { Category, UpdateCategory } from '@/lib/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryKeys } from './category-keys'

type UpdateCategoryParams = {
  id: string
  data: UpdateCategory
}

async function updateCategory({
  id,
  data,
}: UpdateCategoryParams): Promise<Category> {
  const response = await fetch(`/api/category/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update category')
  }

  return response.json()
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
    },
  })
}
