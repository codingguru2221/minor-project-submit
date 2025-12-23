import { z } from 'zod';
import { insertUserSchema, insertAccountSchema, insertTransactionSchema, users, banks, accounts, transactions } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  // Auth & User
  users: {
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/users/:id',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    login: { // Simple mock login
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ mobile_number: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    }
  },
  // Data
  banks: {
    list: {
      method: 'GET' as const,
      path: '/api/banks',
      responses: {
        200: z.array(z.custom<typeof banks.$inferSelect>()),
      },
    },
  },
  accounts: {
    list: {
      method: 'GET' as const,
      path: '/api/accounts', // ?userId=...
      input: z.object({ userId: z.coerce.number().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof accounts.$inferSelect & { bank: typeof banks.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/accounts',
      input: insertAccountSchema,
      responses: {
        201: z.custom<typeof accounts.$inferSelect>(),
      },
    },
    link: {
      method: 'PATCH' as const,
      path: '/api/accounts/:id/link',
      input: z.object({ isLinked: z.boolean() }),
      responses: {
        200: z.custom<typeof accounts.$inferSelect>(),
      },
    }
  },
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/transactions',
      input: z.object({ accountId: z.coerce.number().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
  },
  savingGoals: {
    list: {
      method: 'GET' as const,
      path: '/api/saving-goals',
      input: z.object({ userId: z.coerce.number().optional() }).optional(),
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
  },
  loans: {
    list: {
      method: 'GET' as const,
      path: '/api/loans',
      input: z.object({ userId: z.coerce.number().optional() }).optional(),
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
