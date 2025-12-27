import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

// Define types that would normally come from schema
interface InsertUser {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  city?: string;
  country?: string;
  monthlyBudget?: string;
  currency?: string;
  appPin?: string;
  fingerprintEnabled?: boolean;
  isProfileComplete?: boolean;
}

interface InsertAccount {
  userId: number;
  bankId: number;
  accountNumber: string;
  type: string;
  balance?: string;
  isLinked?: boolean;
  loanAmount?: string;
  loanPaid?: string;
}

// === USERS ===

export function useUser(id?: number) {
  return useQuery({
    queryKey: [api.users.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.users.get.path, { id });
      try {
        const data = await apiGet(url);
        return api.users.get.responses[200].parse(data);
      } catch (error: any) {
        if (error.message?.includes('404')) return null;
        throw new Error("Failed to fetch user");
      }
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await apiPost(api.users.create.path, data);
        return api.users.create.responses[201].parse(response);
      } catch (error: any) {
        throw new Error(error.message || "Failed to create user");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// === BANKS ===

export function useBanks() {
  return useQuery({
    queryKey: [api.banks.list.path],
    queryFn: async () => {
      const data = await apiGet(api.banks.list.path);
      return api.banks.list.responses[200].parse(data);
    },
  });
}

// === ACCOUNTS ===

export function useAccounts(userId?: number) {
  return useQuery({
    queryKey: [api.accounts.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const url = `${api.accounts.list.path}?userId=${userId}`;
      const data = await apiGet(url);
      return api.accounts.list.responses[200].parse(data);
    },
    enabled: !!userId,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiPost(api.accounts.create.path, data);
      return api.accounts.create.responses[201].parse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.accounts.list.path] });
      toast({ title: "Account Created", description: "Successfully linked new account." });
    },
  });
}

export function useLinkAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, isLinked }: { id: number; isLinked: boolean }) => {
      const url = buildUrl(api.accounts.link.path, { id });
      const response = await apiPatch(url, { isLinked });
      return api.accounts.link.responses[200].parse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.accounts.list.path] });
      toast({ title: "Success", description: "Account status updated." });
    },
  });
}

// === TRANSACTIONS ===

export function useTransactions(accountId?: number) {
  return useQuery({
    queryKey: [api.transactions.list.path, accountId],
    queryFn: async () => {
      // Return empty array if no accountId provided
      if (!accountId) return [];
      
      let url = api.transactions.list.path;
      url += `?accountId=${accountId}`;
      const data = await apiGet(url);
      return api.transactions.list.responses[200].parse(data);
    },
    enabled: !!accountId, // Only run query when accountId is provided
  });
}

// === SAVING GOALS ===

export function useSavingGoals(userId?: number) {
  return useQuery({
    queryKey: [api.savingGoals.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const url = `${api.savingGoals.list.path}?userId=${userId}`;
      const data = await apiGet(url);
      return api.savingGoals.list.responses[200].parse(data);
    },
    enabled: !!userId,
  });
}

// === LOANS ===

export function useLoans(userId?: number) {
  return useQuery({
    queryKey: [api.loans.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const url = `${api.loans.list.path}?userId=${userId}`;
      const data = await apiGet(url);
      return api.loans.list.responses[200].parse(data);
    },
    enabled: !!userId,
  });
}

// === CARDS ===

export interface Card {
  id: number;
  contactNumber: string;
  cardAccountNumber: string;
  accountType: string;
  initialBalance: string;
  createdAt: string | Date;
}

export function useCards(userId?: number) {
  return useQuery<Card[]>({
    queryKey: [api.cards.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const url = `${api.cards.list.path}?userId=${userId}`;
      const data = await apiGet(url);
      return api.cards.list.responses[200].parse(data);
    },
    enabled: !!userId,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (cardData: Omit<Card, 'id' | 'createdAt'>) => {
      const response = await apiPost(api.cards.create.path, cardData);
      return api.cards.create.responses[201].parse(response);
    },
    onSuccess: () => {
      // Invalidate and refetch cards
      queryClient.invalidateQueries({ queryKey: [api.cards.list.path] });
      toast({ title: "Card Added", description: "Card has been added successfully." });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error adding card", 
        description: error.message || "Failed to add card",
        variant: "destructive" 
      });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cards.delete.path, { id });
      const response = await apiDelete(url);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch cards
      queryClient.invalidateQueries({ queryKey: [api.cards.list.path] });
      toast({ title: "Card Deleted", description: "Card has been removed successfully." });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting card", 
        description: error.message || "Failed to delete card",
        variant: "destructive" 
      });
    },
  });
}

export function useCardTransactions(cardId?: number) {
  return useQuery({
    queryKey: [api.cards.transactions.path, cardId],
    queryFn: async () => {
      if (!cardId) return [];
      const url = buildUrl(api.cards.transactions.path, { id: cardId });
      const data = await apiGet(url);
      return api.cards.transactions.responses[200].parse(data);
    },
    enabled: !!cardId,
  });
}
