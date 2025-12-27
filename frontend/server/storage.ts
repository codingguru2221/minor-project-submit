import { memoryStorage } from "./memoryStorage";
import {
  type User, type InsertUser, type Bank, type Account, type InsertAccount, type Transaction, type InsertTransaction, type SavingGoal, type Loan, type Card, type InsertCard
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByMobile(mobile: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Banks
  getBanks(): Promise<Bank[]>;
  seedBanks(): Promise<void>;

  // Accounts
  getAccounts(userId: number): Promise<(Account & { bank: Bank | null })[]>;
  createAccount(account: InsertAccount): Promise<Account>;
  linkAccount(id: number, isLinked: boolean): Promise<Account>;

  // Transactions
  getTransactions(accountId?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Saving Goals
  getSavingGoals(userId: number): Promise<SavingGoal[]>;

  // Loans
  getLoans(userId: number): Promise<Loan[]>;

  // Cards
  getCards(userId: number): Promise<Card[]>;
  createCard(card: InsertCard): Promise<Card>;
  deleteCard(id: number): Promise<boolean>;
  getCardTransactions(cardId: number): Promise<Transaction[]>;
}

export class MemoryStorageAdapter implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    return memoryStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return memoryStorage.getUserByUsername(username);
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    return memoryStorage.getUserByMobile(mobile);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return memoryStorage.createUser(insertUser);
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    return memoryStorage.updateUser(id, user);
  }

  async getBanks(): Promise<Bank[]> {
    return memoryStorage.getBanks();
  }

  async seedBanks(): Promise<void> {
    return memoryStorage.seedBanks();
  }

  async getAccounts(userId: number): Promise<(Account & { bank: Bank | null })[]> {
    return memoryStorage.getAccounts(userId);
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    return memoryStorage.createAccount(insertAccount);
  }

  async linkAccount(id: number, isLinked: boolean): Promise<Account> {
    return memoryStorage.linkAccount(id, isLinked);
  }

  async getTransactions(accountId?: number): Promise<Transaction[]> {
    return memoryStorage.getTransactions(accountId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    return memoryStorage.createTransaction(insertTransaction);
  }

  async getSavingGoals(userId: number): Promise<SavingGoal[]> {
    return memoryStorage.getSavingGoals(userId);
  }

  async getLoans(userId: number): Promise<Loan[]> {
    return memoryStorage.getLoans(userId);
  }

  async getCards(userId: number): Promise<Card[]> {
    return memoryStorage.getCards(userId);
  }

  async createCard(card: InsertCard): Promise<Card> {
    return memoryStorage.createCard(card);
  }

  async deleteCard(id: number): Promise<boolean> {
    return memoryStorage.deleteCard(id);
  }

  async getCardTransactions(cardId: number): Promise<Transaction[]> {
    return memoryStorage.getCardTransactions(cardId);
  }
}

export const storage = new MemoryStorageAdapter();
