import { z } from 'zod'

export const authSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const registerSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const transactionCategoryEnum = z.enum([
  'FOOD',
  'TRANSPORT',
  'ENTERTAINMENT',
  'UTILITIES',
  'HEALTH',
  'EDUCATION',
  'DEBTS',
  'SALARY',
  'FREELANCE',
  'INVESTMENTS',
  'OTHER',
])

const bankAccountTypeEnum = z.enum([
  'CHECKING',
  'SAVINGS',
  'CREDIT',
  'INVESTMENT',
])

const bankAccountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Account name is required'),
  type: bankAccountTypeEnum,
  balance: z.number().default(0),
  userId: z.string().optional(),
})

const transactionsSchema = bankAccountSchema.extend({
  bankAccount: z.object({
    id: z.string(),
    name: z.string(),
    type: bankAccountTypeEnum,
    balance: z.number(),
  }),
})

const createBankAccountSchema = bankAccountSchema.omit({
  id: true,
  userId: true,
})

const updateBankAccountSchema = bankAccountSchema.partial().extend({
  id: z.string(),
})

const transactionSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1),
  type: z.union([z.literal('INCOME'), z.literal('EXPENSE')]),
  amount: z.string(),
  category: transactionCategoryEnum,
  bankAccount: bankAccountSchema.optional(),
  date: z.date().or(z.string()),
  accountId: z.string().min(1),
  userId: z.string().optional(),
})

const createTransactionSchema = transactionSchema.omit({
  id: true,
  userId: true,
  bankAccount: true,
})

const updateTransactionSchema = transactionSchema.partial().extend({
  id: z.string(),
})

type AuthData = z.infer<typeof authSchema>
type RegisterData = z.infer<typeof registerSchema>
type Transaction = z.infer<typeof transactionSchema>
type Transactions = z.infer<typeof transactionSchema>
type CreateTransaction = z.infer<typeof createTransactionSchema>
type UpdateTransaction = z.infer<typeof updateTransactionSchema>
type TransactionCategory = z.infer<typeof transactionCategoryEnum>
type BankAccount = z.infer<typeof bankAccountSchema>
type CreateBankAccount = z.infer<typeof createBankAccountSchema>
type UpdateBankAccount = z.infer<typeof updateBankAccountSchema>
type BankAccountType = z.infer<typeof bankAccountTypeEnum>

export {
  bankAccountSchema,
  bankAccountTypeEnum,
  createBankAccountSchema,
  createTransactionSchema,
  transactionSchema,
  transactionsSchema,
  updateBankAccountSchema,
  updateTransactionSchema,
  type AuthData,
  type BankAccount,
  type BankAccountType,
  type CreateBankAccount,
  type CreateTransaction,
  type RegisterData,
  type Transaction,
  type TransactionCategory,
  type Transactions,
  type UpdateBankAccount,
  type UpdateTransaction,
}
