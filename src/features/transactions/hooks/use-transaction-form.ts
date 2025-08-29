'use client'

import type { Transaction } from '@/lib/schemas'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export interface TransactionFormState {
  isFormOpen: boolean
  editingTransaction: Transaction | null
  deleteDialog: {
    isOpen: boolean
    transaction: Transaction | null
  }
}

export const useTransactionForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const formState = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    return {
      isFormOpen: params.get('form') === 'open',
      editingTransaction: params.get('edit')
        ? JSON.parse(decodeURIComponent(params.get('edit')!))
        : null,
      deleteDialog: {
        isOpen: params.get('delete') === 'open',
        transaction: params.get('deleteTransaction')
          ? JSON.parse(decodeURIComponent(params.get('deleteTransaction')!))
          : null,
      },
    }
  }, [searchParams])

  const updateFormState = useCallback(
    (updates: Partial<TransactionFormState>) => {
      const params = new URLSearchParams(searchParams)

      if (updates.isFormOpen !== undefined) {
        if (updates.isFormOpen) {
          params.set('form', 'open')
        } else {
          params.delete('form')
          params.delete('edit')
        }
      }

      if (updates.editingTransaction !== undefined) {
        if (updates.editingTransaction) {
          params.set(
            'edit',
            encodeURIComponent(JSON.stringify(updates.editingTransaction))
          )
          params.set('form', 'open')
        } else {
          params.delete('edit')
        }
      }

      if (updates.deleteDialog !== undefined) {
        if (updates.deleteDialog.isOpen) {
          params.set('delete', 'open')
          if (updates.deleteDialog.transaction) {
            params.set(
              'deleteTransaction',
              encodeURIComponent(
                JSON.stringify(updates.deleteDialog.transaction)
              )
            )
          }
        } else {
          params.delete('delete')
          params.delete('deleteTransaction')
        }
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  const openCreateForm = useCallback(() => {
    updateFormState({
      isFormOpen: true,
      editingTransaction: null,
    })
  }, [updateFormState])

  const openEditForm = useCallback(
    (transaction: Transaction) => {
      updateFormState({
        isFormOpen: true,
        editingTransaction: transaction,
      })
    },
    [updateFormState]
  )

  const closeForm = useCallback(() => {
    updateFormState({
      isFormOpen: false,
      editingTransaction: null,
    })
  }, [updateFormState])

  const openDeleteDialog = useCallback(
    (transaction: Transaction) => {
      updateFormState({
        deleteDialog: {
          isOpen: true,
          transaction,
        },
      })
    },
    [updateFormState]
  )

  const closeDeleteDialog = useCallback(() => {
    updateFormState({
      deleteDialog: {
        isOpen: false,
        transaction: null,
      },
    })
  }, [updateFormState])

  return {
    formState,
    openCreateForm,
    openEditForm,
    closeForm,
    openDeleteDialog,
    closeDeleteDialog,
  }
}
