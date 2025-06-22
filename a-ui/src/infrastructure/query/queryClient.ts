/**
 * React Query Configuration
 * Centralized configuration for TanStack Query with DDD-aligned settings
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: How long inactive data stays in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry configuration for failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus for critical data
      refetchOnWindowFocus: true,

      // Refetch on network reconnect
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on network error
      retry: 1,

      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Query Keys Factory - following DDD domain boundaries
export const queryKeys = {
  // Product domain queries
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    search: (query: string) => [...queryKeys.products.all, 'search', query] as const,
    categories: ['products', 'categories'] as const,
  },

  // Cart domain queries
  cart: {
    all: ['cart'] as const,
    details: () => [...queryKeys.cart.all, 'detail'] as const,
    items: () => [...queryKeys.cart.all, 'items'] as const,
    summary: (cartId?: string) => [...queryKeys.cart.all, 'summary', cartId] as const,
    totals: (cartId?: string) => [...queryKeys.cart.all, 'totals', cartId] as const,
    validation: (cartId?: string) => [...queryKeys.cart.all, 'validation', cartId] as const,
  },

  // Customer domain queries
  customer: {
    all: ['customer'] as const,
    profile: () => [...queryKeys.customer.all, 'profile'] as const,
    addresses: () => [...queryKeys.customer.all, 'addresses'] as const,
    orders: () => [...queryKeys.customer.all, 'orders'] as const,
    wishlist: () => [...queryKeys.customer.all, 'wishlist'] as const,
  },

  // Order domain queries
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.orders.lists(), { filters }] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    history: (customerId: string) => [...queryKeys.orders.all, 'history', customerId] as const,
  },

  // Review domain queries
  reviews: {
    all: ['reviews'] as const,
    lists: () => [...queryKeys.reviews.all, 'list'] as const,
    byProduct: (productId: string) => [...queryKeys.reviews.lists(), 'product', productId] as const,
    byCustomer: (customerId: string) => [...queryKeys.reviews.lists(), 'customer', customerId] as const,
    details: () => [...queryKeys.reviews.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.reviews.details(), id] as const,
  },

  // Inventory domain queries
  inventory: {
    all: ['inventory'] as const,
    stock: (productId: string) => [...queryKeys.inventory.all, 'stock', productId] as const,
    availability: () => [...queryKeys.inventory.all, 'availability'] as const,
  },

  // Promotion domain queries
  promotions: {
    all: ['promotions'] as const,
    active: () => [...queryKeys.promotions.all, 'active'] as const,
    applicable: (cartId: string) => [...queryKeys.promotions.all, 'applicable', cartId] as const,
  },
} as const;

// Cache invalidation helpers
export const invalidateQueries = {
  products: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  cart: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  customer: () => queryClient.invalidateQueries({ queryKey: queryKeys.customer.all }),
  orders: () => queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
  reviews: () => queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all }),
  inventory: () => queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all }),
  promotions: () => queryClient.invalidateQueries({ queryKey: queryKeys.promotions.all }),
};
