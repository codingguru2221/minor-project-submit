import {
  type User, type InsertUser, type Bank, type Account, type InsertAccount, type Transaction, type InsertTransaction, type SavingGoal, type Loan
} from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Define Card types
interface Card {
  id: number;
  userId: number;
  contactNumber: string;
  cardAccountNumber: string;
  accountType: string;
  initialBalance: string;
  createdAt: Date;
  // Due payments tracking
  duePayments?: number;
}

interface InsertCard {
  userId: number;
  contactNumber: string;
  cardAccountNumber: string;
  accountType: string;
  initialBalance: string;
}

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByMobile(mobile: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private banks: Bank[] = [];
  private accounts: (Account & { bank: Bank | null })[] = [];
  private transactions: Transaction[] = [];
  private savingGoals: SavingGoal[] = [];
  private loans: Loan[] = [];
  private cards: Card[] = [];
  private nextUserId = 1;
  private nextBankId = 1;
  private nextAccountId = 1;
  private nextTransactionId = 1;
  private nextCardId = 1;

  constructor() {
    // Load demo data and user data from JSON files
    this.loadDemoData();
    this.loadUserData();
    // Create user-specific data files if they don't exist
    this.createUserSpecificDataFiles();
    // Load card data from cardsData.json
    this.loadCardData();
  }

  private loadDemoData() {
    try {
      const demoDataPath = path.join(__dirname, '..', 'data', 'demoData.json');
      if (fs.existsSync(demoDataPath)) {
        const demoData = JSON.parse(fs.readFileSync(demoDataPath, 'utf8'));
        
        // Load banks
        this.banks = demoData.banks;
        this.nextBankId = Math.max(...this.banks.map(bank => bank.id), 0) + 1;
        
        // Load users
        this.users = demoData.users.map((user: any) => ({
          id: user.user_id,
          username: user.full_name.replace(/\s+/g, '_'),
          password: user.password,
          fullName: user.full_name,
          email: user.email,
          mobile: user.mobile_number,
          city: '',
          country: '',
          monthlyBudget: null,
          currency: 'USD',
          appPin: null,
          fingerprintEnabled: false,
          isProfileComplete: false,
          createdAt: new Date(user.created_at)
        }));
        this.nextUserId = Math.max(...this.users.map(user => user.id), 0) + 1;
      }
    } catch (error) {
      console.error('Error loading demo data:', error);
    }
  }

  private createUserSpecificDataFiles() {
    // Create individual data files for each user from demo data
    try {
      const demoDataPath = path.join(__dirname, '..', 'data', 'demoData.json');
      if (fs.existsSync(demoDataPath)) {
        const demoData = JSON.parse(fs.readFileSync(demoDataPath, 'utf8'));
        const usersDir = path.join(__dirname, '..', 'data', 'users');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(usersDir)) {
          fs.mkdirSync(usersDir, { recursive: true });
        }
        
        // Create a data file for each user
        this.users.forEach(user => {
          const userDataPath = path.join(usersDir, `${user.id}.json`);
          
          // Check if user data file already exists
          if (!fs.existsSync(userDataPath)) {
            // Filter data for this specific user
            const userAccounts = demoData.accounts.filter((acc: any) => acc.user_id === user.id);
            const userTransactions: any[] = [];
            
            // Get transactions for user's accounts
            userAccounts.forEach((account: any) => {
              const accountTransactions = demoData.transactions.filter((trans: any) => trans.account_id === account.account_id);
              userTransactions.push(...accountTransactions);
            });
            
            // Get user's saving goals and loans
            const userSavingGoals = demoData.saving_goals.filter((goal: any) => goal.user_id === user.id);
            const userLoans = demoData.loans.filter((loan: any) => loan.user_id === user.id);
            
            // Create user data object
            const userData = {
              accounts: userAccounts.map((account: any) => ({
                id: account.account_id,
                userId: account.user_id,
                bankId: account.bank_id,
                accountNumber: account.account_number,
                type: 'savings',
                balance: account.current_balance.toString(),
                isLinked: true,
                createdAt: new Date(account.created_at)
              })),
              transactions: userTransactions.map((transaction: any) => ({
                id: transaction.transaction_id,
                accountId: transaction.account_id,
                amount: transaction.amount.toString(),
                type: transaction.transaction_type,
                category: transaction.category_id === 1 ? 'Food' : 
                         transaction.category_id === 2 ? 'Shopping' :
                         transaction.category_id === 3 ? 'Travel' :
                         transaction.category_id === 4 ? 'Bills' :
                         transaction.category_id === 5 ? 'Transfer' :
                         transaction.category_id === 6 ? 'Entertainment' : 'Others',
                description: transaction.description,
                date: new Date(transaction.transaction_date)
              })),
              savingGoals: userSavingGoals.map((goal: any) => ({
                id: goal.goal_id,
                userId: goal.user_id,
                targetAmount: goal.target_amount,
                currentAmount: goal.current_amount,
                editable: goal.editable
              })),
              loans: userLoans.map((loan: any) => ({
                id: loan.loan_id,
                userId: loan.user_id,
                loanType: loan.loan_type,
                totalAmount: loan.total_amount,
                emiAmount: loan.emi_amount,
                remainingAmount: loan.remaining_amount
              }))
            };
            
            // Write user data to file
            fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
          }
        });
      }
    } catch (error) {
      console.error('Error creating user-specific data files:', error);
    }
  }

  private loadUserData() {
    try {
      const userDataPath = path.join(__dirname, '..', 'data', 'userData.json');
      if (fs.existsSync(userDataPath)) {
        const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
        
        // Add users from userData to existing users
        if (userData.users && Array.isArray(userData.users)) {
          userData.users.forEach((user: any) => {
            // Check if user already exists to avoid duplicates
            const exists = this.users.some(u => u.mobile === user.mobile_number);
            if (!exists) {
              const newUser = {
                id: user.user_id || this.nextUserId++,
                username: user.full_name.replace(/\s+/g, '_'),
                password: user.password,
                fullName: user.full_name,
                email: user.email,
                mobile: user.mobile_number,
                city: user.city || '',
                country: user.country || '',
                monthlyBudget: user.monthly_budget ? user.monthly_budget.toString() : null,
                currency: user.currency || 'USD',
                appPin: user.app_pin || null,
                fingerprintEnabled: user.fingerprint_enabled || false,
                isProfileComplete: user.is_profile_complete || false,
                createdAt: new Date(user.created_at)
              };
              this.users.push(newUser);
              
              // Create user data file if it doesn't exist
              const userFile = path.join(__dirname, '..', 'data', 'users', `${newUser.id}.json`);
              if (!fs.existsSync(userFile)) {
                fs.writeFileSync(userFile, JSON.stringify({
                  accounts: [],
                  transactions: [],
                  savingGoals: [],
                  loans: []
                }, null, 2));
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private loadCardData() {
    try {
      const cardDataPath = path.join(__dirname, '..', 'data', 'cardsData.json');
      if (fs.existsSync(cardDataPath)) {
        const cardData = JSON.parse(fs.readFileSync(cardDataPath, 'utf8'));
        
        if (cardData.cards && Array.isArray(cardData.cards)) {
          this.cards = cardData.cards.map((card: any) => ({
            ...card,
            createdAt: new Date(card.createdAt)
          }));
          this.nextCardId = Math.max(...this.cards.map(card => card.id), 0) + 1;
        }
      } else {
        // Create the cardsData.json file with an empty array if it doesn't exist
        fs.writeFileSync(cardDataPath, JSON.stringify({ cards: [] }, null, 2));
      }
    } catch (error) {
      console.error('Error loading card data:', error);
      // Initialize with empty array if there's an error
      this.cards = [];
    }
  }

  private saveCardData() {
    try {
      const cardDataPath = path.join(__dirname, '..', 'data', 'cardsData.json');
      const cardData = {
        cards: this.cards.map(card => ({
          ...card,
          createdAt: card.createdAt.toISOString()
        }))
      };
      fs.writeFileSync(cardDataPath, JSON.stringify(cardData, null, 2));
    } catch (error) {
      console.error('Error saving card data:', error);
    }
  }

  private saveUserData() {
    try {
      const userDataPath = path.join(__dirname, '..', 'data', 'userData.json');
      const userData = {
        users: this.users.map(user => ({
          user_id: user.id,
          full_name: user.fullName,
          mobile_number: user.mobile,
          email: user.email,
          created_at: user.createdAt.toISOString(),
          password: user.password,
          city: user.city,
          country: user.country,
          monthly_budget: user.monthlyBudget ? parseFloat(user.monthlyBudget) : null,
          currency: user.currency,
          app_pin: user.appPin,
          fingerprint_enabled: user.fingerprintEnabled,
          is_profile_complete: user.isProfileComplete
        }))
      };
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    return this.users.find(user => user.mobile === mobile);
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return undefined;
    }
    
    // Update the user with new data
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      id: this.users[userIndex].id // Preserve the ID
    };
    
    // Save updated user data to file
    this.saveUserData();
    
    return this.users[userIndex];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if user with same mobile number already exists
    const existingUser = this.users.find(user => user.mobile === insertUser.mobile);
    if (existingUser) {
      throw new Error('User with this mobile number already exists');
    }
    
    const user: User = {
      id: this.nextUserId++,
      ...insertUser,
      username: insertUser.fullName?.replace(/\s+/g, '_') || `user_${this.nextUserId}`,
      createdAt: new Date(),
      isProfileComplete: insertUser.isProfileComplete ?? false,
      fingerprintEnabled: insertUser.fingerprintEnabled ?? false,
      currency: insertUser.currency ?? "USD",
      monthlyBudget: insertUser.monthlyBudget ?? null
    };
    this.users.push(user);
    
    // Save to JSON file
    this.saveUserData();
    
    return user;
  }

  async getBanks(): Promise<Bank[]> {
    return this.banks;
  }

  async seedBanks(): Promise<void> {
    if (this.banks.length === 0) {
      const bankData = [
        { name: "Chase", icon: "Landmark" },
        { name: "Bank of America", icon: "Building2" },
        { name: "Citi", icon: "Globe" },
        { name: "Wells Fargo", icon: "Briefcase" },
        { name: "Goldman Sachs", icon: "TrendingUp" },
        { name: "HSBC", icon: "Landmark" },
        { name: "Barclays", icon: "Building" },
        { name: "Santander", icon: "CreditCard" },
        { name: "US Bank", icon: "Wallet" },
        { name: "PNC", icon: "DollarSign" },
      ];

      this.banks = bankData.map((bank, index) => ({
        id: index + 1,
        name: bank.name,
        icon: bank.icon
      }));
      
      this.nextBankId = this.banks.length + 1;
    }
  }

  async getAccounts(userId: number): Promise<(Account & { bank: Bank | null })[]> {
    // Load user-specific accounts from their data file
    try {
      const userDataPath = path.join(__dirname, '..', 'data', 'users', `${userId}.json`);
      if (fs.existsSync(userDataPath)) {
        const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
        // Attach bank information to accounts
        return userData.accounts.map((account: any) => ({
          ...account,
          bank: this.banks.find(b => b.id === account.bankId) || null
        }));
      }
    } catch (error) {
      console.error(`Error loading accounts for user ${userId}:`, error);
    }
    return [];
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    // Find the bank for this account
    const bank = this.banks.find(b => b.id === insertAccount.bankId) || null;
    
    const account: Account & { bank: Bank | null } = {
      id: this.nextAccountId++,
      ...insertAccount,
      balance: insertAccount.balance ?? '0',
      isLinked: insertAccount.isLinked ?? false,
      createdAt: new Date(),
      bank
    };
    
    // Save to user-specific data file
    try {
      const userDataPath = path.join(__dirname, '..', 'data', 'users', `${insertAccount.userId}.json`);
      if (fs.existsSync(userDataPath)) {
        const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
        userData.accounts = userData.accounts || [];
        userData.accounts.push({
          id: account.id,
          userId: account.userId,
          bankId: account.bankId,
          accountNumber: account.accountNumber,
          type: account.type,
          balance: account.balance,
          isLinked: account.isLinked,
          createdAt: account.createdAt
        });
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      }
    } catch (error) {
      console.error(`Error saving account for user ${insertAccount.userId}:`, error);
    }
    
    return account;
  }

  async linkAccount(id: number, isLinked: boolean): Promise<Account> {
    // Find and update account in user-specific data file
    try {
      const usersDir = path.join(__dirname, '..', 'data', 'users');
      if (fs.existsSync(usersDir)) {
        const userFiles = fs.readdirSync(usersDir);
        
        for (const file of userFiles) {
          if (file.endsWith('.json')) {
            const userDataPath = path.join(usersDir, file);
            const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
            
            // Check if this account exists in this user's data
            const accountIndex = userData.accounts?.findIndex((acc: any) => acc.id === id) ?? -1;
            if (accountIndex !== -1) {
              userData.accounts[accountIndex].isLinked = isLinked;
              fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
              
              // Return the updated account with bank info
              const updatedAccount = userData.accounts[accountIndex];
              return {
                ...updatedAccount,
                bank: this.banks.find(b => b.id === updatedAccount.bankId) || null
              };
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error linking account ${id}:`, error);
    }
    
    // If account not found, create a minimal one
    const account: Account = {
      id,
      userId: 0,
      bankId: 0,
      accountNumber: "",
      type: "",
      balance: '0',
      isLinked,
      createdAt: new Date()
    };
    
    return account;
  }

  async getTransactions(accountId?: number): Promise<Transaction[]> {
    // Load user-specific transactions from data files
    try {
      const usersDir = path.join(__dirname, '..', 'data', 'users');
      if (fs.existsSync(usersDir)) {
        const userFiles = fs.readdirSync(usersDir);
        let allTransactions: Transaction[] = [];
        
        for (const file of userFiles) {
          if (file.endsWith('.json')) {
            const userDataPath = path.join(usersDir, file);
            const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
            
            if (accountId) {
              // Filter transactions by account ID
              const accountTransactions = userData.transactions?.filter((t: any) => t.accountId === accountId) || [];
              allTransactions = [...allTransactions, ...accountTransactions];
            } else {
              // Add all transactions (with safety check)
              const userTransactions = userData.transactions || [];
              allTransactions = [...allTransactions, ...userTransactions];
            }
          }
        }
        
        return allTransactions;
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
    return [];
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      id: this.nextTransactionId++,
      ...insertTransaction,
      date: new Date()
    };
    
    // Save to user-specific data file
    // We need to find which user owns the account for this transaction
    try {
      const usersDir = path.join(__dirname, '..', 'data', 'users');
      if (fs.existsSync(usersDir)) {
        const userFiles = fs.readdirSync(usersDir);
        
        for (const file of userFiles) {
          if (file.endsWith('.json')) {
            const userDataPath = path.join(usersDir, file);
            const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
            
            // Check if this account belongs to this user
            const accountExists = userData.accounts && userData.accounts.some((acc: any) => acc.id === insertTransaction.accountId);
            if (accountExists) {
              userData.transactions = userData.transactions || [];
              userData.transactions.push({
                id: transaction.id,
                accountId: transaction.accountId,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                description: transaction.description,
                date: transaction.date
              });
              fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
    
    return transaction;
  }

  async getSavingGoals(userId: number): Promise<SavingGoal[]> {
    // Load user-specific saving goals from their data file
    try {
      const userDataPath = path.join(__dirname, '..', 'data', 'users', `${userId}.json`);
      if (fs.existsSync(userDataPath)) {
        const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
        return userData.savingGoals || [];
      }
    } catch (error) {
      console.error(`Error loading saving goals for user ${userId}:`, error);
    }
    return [];
  }

  async getLoans(userId: number): Promise<Loan[]> {
    // Load user-specific loans from their data file
    try {
      const userDataPath = path.join(__dirname, '..', 'data', 'users', `${userId}.json`);
      if (fs.existsSync(userDataPath)) {
        const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
        return userData.loans || [];
      }
    } catch (error) {
      console.error(`Error loading loans for user ${userId}:`, error);
    }
    return [];
  }

  async getCards(userId: number): Promise<Card[]> {
    // Filter cards by user ID
    return this.cards.filter(card => card.userId === userId);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const card: Card = {
      id: this.nextCardId++,
      ...insertCard,
      createdAt: new Date(),
      duePayments: 0 // Initialize with no due payments
    };
    
    this.cards.push(card);
    
    // Save to cardsData.json
    this.saveCardData();
    
    return card;
  }

  async deleteCard(id: number): Promise<boolean> {
    const initialLength = this.cards.length;
    this.cards = this.cards.filter(card => card.id !== id);
    
    if (this.cards.length !== initialLength) {
      // Card was deleted, save the updated data
      this.saveCardData();
      return true;
    }
    
    return false;
  }

  async getCardTransactions(cardId: number): Promise<Transaction[]> {
    // For now, we'll return transactions related to the user who owns the card
    // In a real implementation, you might want to link cards to accounts more directly
    try {
      const card = this.cards.find(c => c.id === cardId);
      if (!card) {
        return [];
      }
      
      // Get user's accounts to find related transactions
      const usersDir = path.join(__dirname, '..', 'data', 'users');
      if (fs.existsSync(usersDir)) {
        const userDataPath = path.join(usersDir, `${card.userId}.json`);
        if (fs.existsSync(userDataPath)) {
          const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
          
          // Get account IDs for this user
          const accountIds = userData.accounts?.map((acc: any) => acc.id) || [];
          
          // Filter transactions that belong to this user's accounts
          const userTransactions = userData.transactions || [];
          const cardTransactions = userTransactions.filter((trans: any) => 
            accountIds.includes(trans.accountId)
          );
          
          // Calculate due payments based on transactions
          // For simplicity, we'll consider any debit transactions as potential due payments
          // In a real implementation, you might want to have specific logic for due payments
          let dueAmount = 0;
          cardTransactions.forEach((trans: any) => {
            if (trans.type === 'debit') {
              dueAmount += parseFloat(trans.amount) || 0;
            }
          });
          
          // Update the card's due payments
          const cardIndex = this.cards.findIndex(c => c.id === cardId);
          if (cardIndex !== -1) {
            this.cards[cardIndex].duePayments = dueAmount;
            // Save the updated card data
            this.saveCardData();
          }
          
          return cardTransactions;
        }
      }
    } catch (error) {
      console.error(`Error loading transactions for card ${cardId}:`, error);
    }
    
    return [];
  }
}

export const memoryStorage = new MemoryStorage();