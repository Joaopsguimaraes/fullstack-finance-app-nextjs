'use client'

import type { BankAccount } from '@/lib/schemas'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export interface BankAccountFormState {
  isFormOpen: boolean
  editingAccount: BankAccount | null
  deleteDialog: {
    isOpen: boolean
    account: BankAccount | null
  }
}

export function useBankAccountForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const formState = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    return {
      isFormOpen: params.get('form') === 'open',
      editingAccount: params.get('edit')
        ? JSON.parse(decodeURIComponent(params.get('edit')!))
        : null,
      deleteDialog: {
        isOpen: params.get('delete') === 'open',
        account: params.get('deleteAccount')
          ? JSON.parse(decodeURIComponent(params.get('deleteAccount')!))
          : null,
      },
    }
  }, [searchParams])

  const updateFormState = useCallback(
    (updates: Partial<BankAccountFormState>) => {
      const params = new URLSearchParams(searchParams)

      if (updates.isFormOpen !== undefined) {
        if (updates.isFormOpen) {
          params.set('form', 'open')
        } else {
          params.delete('form')
          params.delete('edit')
        }
      }

      if (updates.editingAccount !== undefined) {
        if (updates.editingAccount) {
          params.set(
            'edit',
            encodeURIComponent(JSON.stringify(updates.editingAccount))
          )
          params.set('form', 'open')
        } else {
          params.delete('edit')
        }
      }

      if (updates.deleteDialog !== undefined) {
        if (updates.deleteDialog.isOpen) {
          params.set('delete', 'open')
          if (updates.deleteDialog.account) {
            params.set(
              'deleteAccount',
              encodeURIComponent(JSON.stringify(updates.deleteDialog.account))
            )
          }
        } else {
          params.delete('delete')
          params.delete('deleteAccount')
        }
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  const openCreateForm = useCallback(() => {
    updateFormState({
      isFormOpen: true,
      editingAccount: null,
    })
  }, [updateFormState])

  const openEditForm = useCallback(
    (account: BankAccount) => {
      updateFormState({
        isFormOpen: true,
        editingAccount: account,
      })
    },
    [updateFormState]
  )

  const closeForm = useCallback(() => {
    updateFormState({
      isFormOpen: false,
      editingAccount: null,
    })
  }, [updateFormState])

  const openDeleteDialog = useCallback(
    (account: BankAccount) => {
      updateFormState({
        deleteDialog: {
          isOpen: true,
          account,
        },
      })
    },
    [updateFormState]
  )

  const closeDeleteDialog = useCallback(() => {
    updateFormState({
      deleteDialog: {
        isOpen: false,
        account: null,
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
