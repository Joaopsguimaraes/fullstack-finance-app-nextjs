import { z } from "zod";

export const authSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const registerSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const recoverySchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
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
  description: z.string().min(1),
  type: z.union([z.literal("INCOME"), z.literal("EXPENSE")]),
  amount: z.string(),
  category: transactionCategoryEnum,
  date: z.date(),
  accountId: z.string().min(1),
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
