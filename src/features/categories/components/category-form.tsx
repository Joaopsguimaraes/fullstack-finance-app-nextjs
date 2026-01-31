'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type CreateCategory, createCategorySchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCreateCategory } from '../hooks/use-create-category'
import { useUpdateCategory } from '../hooks/use-update-category'

type CategoryFormProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly category?: { id: string; name: string }
  readonly mode?: 'create' | 'edit'
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  mode = 'create',
}: CategoryFormProps) {
  const form = useForm<CreateCategory>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name || '',
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  React.useEffect(() => {
    if (open) {
      reset({ name: category?.name || '' })
    }
  }, [open, category, reset])

  const onSubmit = async (data: CreateCategory) => {
    try {
      if (mode === 'edit' && category) {
        await updateMutation.mutateAsync({
          id: category.id,
          data,
        })
        toast.success('Category updated successfully')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Category created successfully')
      }
      onOpenChange(false)
      reset()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(`Failed to ${mode} category`)
      }
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Category' : 'Edit Category'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new category for your transactions.'
              : 'Update the category name.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Category Name</Label>
              <Input
                id='name'
                placeholder='e.g., GROCERIES'
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className='text-destructive text-sm'>
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Updating...'
                : mode === 'create'
                  ? 'Create'
                  : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
