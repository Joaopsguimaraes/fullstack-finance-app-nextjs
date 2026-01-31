import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryKeys } from './category-keys'

async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/category/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete category')
  }
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
    },
  })
}
