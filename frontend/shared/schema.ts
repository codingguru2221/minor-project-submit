import { z } from "zod";
// === TYPE DEFINITIONS ===

export interface User {
  id: number;
  username: string;
  password: string; // Will mock auth
  fullName?: string | null;
  email?: string | null;
  mobile?: string | null;
  city?: string | null;
  country?: string | null;
  monthlyBudget?: string | null;
  currency: string;
  appPin?: string | null;
  fingerprintEnabled: boolean;
  isProfileComplete: boolean;
  createdAt: Date;
}

export interface Bank {
  id: number;
  name: string;
  icon?: string | null; // Lucide icon name or similar
}

export interface Account {
  id: number;
  userId: number;
  bankId: number;
  accountNumber: string; // Masked usually
  type: string; // Savings, Current, Loan
  balance: string;
  isLinked: boolean;
  // Loan specific fields
  loanAmount?: string | null;
  loanPaid?: string | null;
  createdAt: Date;
}

export interface Transaction {
  id: number;
  accountId: number;
  amount: string;
  type: string; // credit, debit
  category?: string | null; // Food, Shopping, Rent, etc.
  description?: string | null;
  date: Date;
}

export interface SavingGoal {
  id: number;
  userId: number;
  targetAmount: number;
  currentAmount: number;
  editable: boolean;
}

export interface Loan {
  id: number;
  userId: number;
  loanType: string;
  totalAmount: number;
  emiAmount: number;
  remainingAmount: number;
}

// === BASE SCHEMAS ===

// Create simplified schemas for validation
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  monthlyBudget: z.string().optional(),
  currency: z.string().optional(),
  appPin: z.string().optional(),
  fingerprintEnabled: z.boolean().optional(),
  isProfileComplete: z.boolean().optional()
}).omit({ id: true, createdAt: true });

export const insertBankSchema = z.object({
  name: z.string(),
  icon: z.string().optional()
}).omit({ id: true });

export const insertAccountSchema = z.object({
  userId: z.number(),
  bankId: z.number(),
  accountNumber: z.string(),
  type: z.string(),
  balance: z.string().optional(),
  isLinked: z.boolean().optional(),
  loanAmount: z.string().optional(),
  loanPaid: z.string().optional()
}).omit({ id: true, createdAt: true });

export const insertTransactionSchema = z.object({
  accountId: z.number(),
  amount: z.string(),
  type: z.string(),
  category: z.string().optional(),
  description: z.string().optional()
}).omit({ id: true, date: true });

// === EXPLICIT API CONTRACT TYPES ===

export type User = {
  id: number;
  username: string;
  password: string;
  fullName?: string | null;
  email?: string | null;
  mobile?: string | null;
  city?: string | null;
  country?: string | null;
  monthlyBudget?: string | null;
  currency: string;
  appPin?: string | null;
  fingerprintEnabled: boolean;
  isProfileComplete: boolean;
  createdAt: Date;
};

export type Bank = {
  id: number;
  name: string;
  icon?: string | null;
};

export type Account = {
  id: number;
  userId: number;
  bankId: number;
  accountNumber: string;
  type: string;
  balance: string;
  isLinked: boolean;
  loanAmount?: string | null;
  loanPaid?: string | null;
  createdAt: Date;
};

export type Transaction = {
  id: number;
  accountId: number;
  amount: string;
  type: string;
  category?: string | null;
  description?: string | null;
  date: Date;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type CreateUserRequest = InsertUser;
export type UpdateUserRequest = Partial<InsertUser>;
export type CreateAccountRequest = InsertAccount;
export type CreateTransactionRequest = InsertTransaction;

// Response types
export type UserResponse = User;
export type BankResponse = Bank;
export type AccountResponse = Account & { bank?: Bank };
export type TransactionResponse = Transaction;

// For the multi-step signup
export type SignupStep1Request = Pick<InsertUser, "fullName" | "email" | "mobile" | "city" | "country">;
export type SignupStep2Request = { linkedAccountIds: number[] }; // IDs of demo accounts to link
export type SignupStep3Request = Pick<InsertUser, "monthlyBudget" | "currency">; // And categories preference (could be stored in user or implied)
export type SignupStep4Request = Pick<InsertUser, "username" | "password" | "appPin" | "fingerprintEnabled">;
