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
 * Transaction schema
 */
export const transactionSchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"]),
  date: z.date(),
  accountId: z.string().min(1, "Account is required"),
});

/**
 * Account schema
 */
export const accountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["checking", "savings", "credit", "investment"]),
  balance: z.number(),
  currency: z.string().default("USD"),
  color: z.string().optional(),
});

/**
 * Budget schema
 */
export const budgetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Budget name is required"),
  amount: z.number().positive("Budget amount must be positive"),
  category: z.string().min(1, "Category is required"),
  period: z.enum(["monthly", "yearly"]),
  startDate: z.date(),
  endDate: z.date().optional(),
});

/**
 * Investment schema
 */
export const investmentSchema = z.object({
  id: z.string().optional(),
  symbol: z.string().min(1, "Symbol is required"),
  name: z.string().min(1, "Investment name is required"),
  shares: z.number().positive("Shares must be positive"),
  purchasePrice: z.number().positive("Purchase price must be positive"),
  purchaseDate: z.date(),
  accountId: z.string().min(1, "Account is required"),
});

/**
 * Goal schema
 */
export const goalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().min(0, "Current amount cannot be negative"),
  targetDate: z.date(),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

// Type exports
export type AuthData = z.infer<typeof authSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Account = z.infer<typeof accountSchema>;
export type Budget = z.infer<typeof budgetSchema>;
export type Investment = z.infer<typeof investmentSchema>;
export type Goal = z.infer<typeof goalSchema>;
