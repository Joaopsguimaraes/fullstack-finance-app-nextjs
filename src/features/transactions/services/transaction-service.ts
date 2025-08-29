import type {
  CreateTransaction,
  Transaction,
  Transactions,
  UpdateTransaction,
} from '@/lib/schemas'

const API_BASE_URL = '/api/transaction'

export class TransactionService {
  static async getTransactions(): Promise<Transactions[]> {
    const response = await fetch(API_BASE_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }

    const transactions = await response.json()

    return transactions.data as Transactions[]
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
