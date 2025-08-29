import type {
  CreateTransaction,
  Transaction,
  Transactions,
  UpdateTransaction,
} from '@/lib/schemas'
import type { PaginatedResponse, PaginationParams } from '../types/pagination'

const API_BASE_URL = '/api/transaction'

export class TransactionService {
  static async getTransactions(
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<Transactions>> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })

    const response = await fetch(`${API_BASE_URL}?${searchParams.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }

    const result = await response.json()

    return {
      data: result.data.transactions as Transactions[],
      pagination: result.data.pagination,
    }
  }
  static async getTransaction(id: string): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/${id}`)

    if (!response.ok) {
      throw new Error('Failed to fetch transaction')
    }

    return response.json()
  }

  static async createTransaction(
    data: CreateTransaction
  ): Promise<Transaction> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create transaction')
    }

    return response.json()
  }

  static async updateTransaction(
    id: string,
    data: UpdateTransaction
  ): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update transaction')
    }

    return response.json()
  }

  static async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete transaction')
    }
  }
}
