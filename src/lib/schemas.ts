import { z } from "zod";

/**
 * User authentication schema
 */
export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * User registration schema
 */
export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Password recovery schema
 */
export const recoverySchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const transactionCategoryEnum = z.enum([
  "FOOD",
  "TRANSPORT",
  "ENTERTAINMENT",
  "UTILITIES",
  "HEALTH",
  "EDUCATION",
  "DEBTS",
  "SALARY",
  "FREELANCE",
  "INVESTMENTS",
  "OTHER",
]);

const transactionSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  type: z.union([z.literal("INCOME"), z.literal("EXPENSE")]),
  amount: z.number().positive("Amount must be positive"),
  category: transactionCategoryEnum,
  date: z.date(),
  accountId: z.string().min(1, "Account is required"),
  userId: z.string().optional(),
});

const createTransactionSchema = transactionSchema.omit({
  id: true,
  userId: true,
});

const updateTransactionSchema = transactionSchema.partial().extend({
  id: z.string(),
});

const paginatedTransactionsSchema = z.object({
  transactions: z.array(transactionSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// Type definitions
type AuthData = z.infer<typeof authSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type RecoveryData = z.infer<typeof recoverySchema>;
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
type Transaction = z.infer<typeof transactionSchema>;
type CreateTransaction = z.infer<typeof createTransactionSchema>;
type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
type PaginatedTransactions = z.infer<typeof paginatedTransactionsSchema>;
type TransactionCategory = z.infer<typeof transactionCategoryEnum>;

export {
  type AuthData,
  type RegisterData,
  type RecoveryData,
  type ResetPasswordData,
  type Transaction,
  type CreateTransaction,
  type UpdateTransaction,
  type PaginatedTransactions,
  type TransactionCategory,
  transactionSchema,
  createTransactionSchema,
  updateTransactionSchema,
  paginatedTransactionsSchema,
};
