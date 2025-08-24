import type {
  Transaction,
  CreateTransaction,
  UpdateTransaction,
  PaginatedTransactions,
} from "@/lib/schemas";

const API_BASE_URL = "/api/transaction";

export class TransactionService {
  static async getTransactions(params: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    search?: string;
  }): Promise<PaginatedTransactions> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.type) searchParams.append("type", params.type);
    if (params.category) searchParams.append("category", params.category);
    if (params.search) searchParams.append("search", params.search);

    const response = await fetch(`${API_BASE_URL}?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return response.json();
  }
  static async getTransaction(id: string): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch transaction");
    }

    return response.json();
  }

  static async createTransaction(
    data: CreateTransaction
  ): Promise<Transaction> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to create transaction");
    }

    return response.json();
  }

  static async updateTransaction(
    id: string,
    data: UpdateTransaction
  ): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }

    return response.json();
  }

  static async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }
  }
}
