import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertCardSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed banks on startup
  await storage.seedBanks();

  // === Users & Auth ===
  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      const user = await storage.createUser(input);
      // For a real app, we'd create a session here. For now, just return the user.
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.users.login.path, async (req, res) => {
    try {
      const { mobile_number, password } = api.users.login.input.parse(req.body);
      const user = await storage.getUserByMobile(mobile_number);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.put(api.users.update.path, async (req, res) => {
    try {
      const input = api.users.update.input.parse(req.body);
      const userId = Number(req.params.id);
      
      // Find the user to update
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In a real app, we'd update the user in the storage
      // For now, we'll return the user with updated values
      const updatedUser = {
        ...existingUser,
        ...input
      };
      
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  // === Banks ===
  app.get(api.banks.list.path, async (req, res) => {
    const banks = await storage.getBanks();
    res.json(banks);
  });

  // === Accounts ===
  app.get(api.accounts.list.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    if (!userId) return res.json([]); // Return empty if no user specified
    const accounts = await storage.getAccounts(userId);
    res.json(accounts);
  });

  app.post(api.accounts.create.path, async (req, res) => {
    try {
      const input = api.accounts.create.input.parse(req.body);
      const account = await storage.createAccount(input);
      res.status(201).json(account);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.accounts.link.path, async (req, res) => {
    const account = await storage.linkAccount(Number(req.params.id), req.body.isLinked);
    res.json(account);
  });

  // === Transactions ===
  app.get(api.transactions.list.path, async (req, res) => {
    const accountId = req.query.accountId ? Number(req.query.accountId) : undefined;
    const transactions = await storage.getTransactions(accountId);
    res.json(transactions);
  });

  // === Saving Goals ===
  app.get(api.savingGoals.list.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    if (!userId) return res.json([]); // Return empty if no user specified
    const savingGoals = await storage.getSavingGoals(userId);
    res.json(savingGoals);
  });

  // === Loans ===
  app.get(api.loans.list.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    if (!userId) return res.json([]); // Return empty if no user specified
    const loans = await storage.getLoans(userId);
    res.json(loans);
  });

  // === Cards ===
  app.get(api.cards.list.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    if (!userId) return res.json([]); // Return empty if no user specified
    const cards = await storage.getCards(userId);
    res.json(cards);
  });

  app.post(api.cards.create.path, async (req, res) => {
    try {
      const input = insertCardSchema.parse(req.body);
      const card = await storage.createCard(input);
      res.status(201).json(card);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.cards.delete.path, async (req, res) => {
    const cardId = Number(req.params.id);
    const success = await storage.deleteCard(cardId);
    
    if (success) {
      res.json({ message: "Card deleted successfully" });
    } else {
      res.status(404).json({ message: "Card not found" });
    }
  });

  app.get(api.cards.transactions.path, async (req, res) => {
    const cardId = Number(req.params.id);
    const transactions = await storage.getCardTransactions(cardId);
    res.json(transactions);
  });

  return httpServer;
}
