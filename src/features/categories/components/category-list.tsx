'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { useCategories } from '../hooks/use-categories'
import { useDeleteCategory } from '../hooks/use-delete-category'
import { CategoryForm } from './category-form'

export function CategoryList() {
  const { data: categories = [], isLoading } = useCategories()
  const deleteMutation = useDeleteCategory()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<{
    id: string
    name: string
  } | null>(null)

  const systemCategories = categories.filter(c => c.userId === null)
  const userCategories = categories.filter(c => c.userId !== null)

  const handleEdit = (category: { id: string; name: string }) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return
    }

    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Category deleted successfully')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to delete category')
      }
    }
  }

  const handleCreateNew = () => {
    setEditingCategory(null)
    setFormOpen(true)
  }

  if (isLoading) {
    return <div className='text-muted-foreground'>Loading categories...</div>
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Categories</h2>
          <p className='text-muted-foreground'>
            Manage your transaction categories
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className='mr-2 h-4 w-4' />
          New Category
        </Button>
      </div>

      <div className='space-y-6'>
        <div>
          <h3 className='mb-3 text-lg font-semibold'>System Categories</h3>
          <div className='divide-border divide-y rounded-lg border'>
            {systemCategories.map(category => (
              <div
                key={category.id}
                className='flex items-center justify-between p-4'
              >
                <div>
                  <p className='font-medium'>{category.name}</p>
                  <p className='text-muted-foreground text-sm'>
                    Default category
                  </p>
                </div>
                <div className='text-muted-foreground text-sm'></div>
              </div>
            ))}
          </div>
        </div>

        {userCategories.length > 0 && (
          <div>
            <h3 className='mb-3 text-lg font-semibold'>Custom Categories</h3>
            <div className='divide-border divide-y rounded-lg border'>
              {userCategories.map(category => (
                <div
                  key={category.id}
                  className='flex items-center justify-between p-4'
                >
                  <div>
                    <p className='font-medium'>{category.name}</p>
                    <p className='text-muted-foreground text-sm'>
                      Custom category
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userCategories.length === 0 && (
          <div className='text-muted-foreground rounded-lg border border-dashed p-8 text-center'>
            <p>No custom categories yet.</p>
            <p className='text-sm'>
              Create your first custom category to get started.
            </p>
          </div>
        )}
      </div>

      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory || undefined}
        mode={editingCategory ? 'edit' : 'create'}
      />
    </div>
  )
}
