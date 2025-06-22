/**
 * Cart Query Hooks
 * React Query hooks for cart domain operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApiClient } from '../../api';
import { CartMapper } from '../../../application/mappers/CartMapper';
import { queryKeys, invalidateQueries } from '../queryClient';
import { Cart } from '../../../domain/aggregates/cart/Cart';
import { CartDto, AddToCartDto, UpdateCartItemDto } from '../../../application/dto/CartDto';

// Query: Fetch current cart
export const useCart = (customerId?: string) => {
  return useQuery({
    queryKey: queryKeys.cart.details(),
    queryFn: async () => {
      if (!customerId) {
        // Return empty cart for guest users
        return null;
      }
      const dto = await cartApiClient.getByCustomerId(customerId);
      return dto ? CartMapper.toDomain(dto) : null;
    },
    enabled: !!customerId,
    staleTime: 0, // Cart data should always be fresh
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes when not in use
  });
};

// Query: Fetch cart items
export const useCartItems = (cartId?: string) => {
  return useQuery({
    queryKey: queryKeys.cart.items(),
    queryFn: async () => {
      if (!cartId) return [];
      // Get cart and extract items
      const cart = await cartApiClient.getById(cartId);
      return cart?.items || [];
    },
    enabled: !!cartId,
    staleTime: 0, // Cart items should always be fresh
  });
};

// Query: Get cart summary (lightweight for header/navigation)
export const useCartSummary = (cartId?: string) => {
  return useQuery({
    queryKey: queryKeys.cart.summary(cartId),
    queryFn: async () => {
      if (!cartId) return null;
      return await cartApiClient.getSummary(cartId);
    },
    enabled: !!cartId,
    staleTime: 30 * 1000, // Summary can be slightly less fresh (30 seconds)
  });
};

// Query: Calculate cart totals
export const useCartTotals = (cartId?: string) => {
  return useQuery({
    queryKey: queryKeys.cart.totals(cartId),
    queryFn: async () => {
      if (!cartId) return null;
      return await cartApiClient.calculateTotals(cartId);
    },
    enabled: !!cartId,
    staleTime: 0, // Totals should always be fresh
  });
};

// Query: Validate cart for checkout
export const useCartValidation = (cartId?: string) => {
  return useQuery({
    queryKey: queryKeys.cart.validation(cartId),
    queryFn: async () => {
      if (!cartId) return null;
      return await cartApiClient.validateForCheckout(cartId);
    },
    enabled: !!cartId,
    staleTime: 0, // Validation should always be fresh
  });
};

// Mutation: Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartId, productId, quantity = 1 }: {
      cartId: string;
      productId: string;
      quantity?: number;
    }) => {
      const addToCartData: AddToCartDto = {
        productId,
        quantity,
      };
      const updatedCart = await cartApiClient.addItem(cartId, addToCartData);
      return CartMapper.toDomain(updatedCart);
    },
    onMutate: async ({ productId, quantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.details() });

      // Snapshot the previous cart
      const previousCart = queryClient.getQueryData<Cart | null>(queryKeys.cart.details());

      // Optimistically update the cart
      if (previousCart) {
        // TODO: Implement optimistic cart update
        // This would require domain methods to add items optimistically
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.details(), context.previousCart);
      }
      console.error('Failed to add item to cart:', err);
    },
    onSuccess: () => {
      // Invalidate cart queries
      invalidateQueries.cart();
    },
  });
};

// Mutation: Update cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartId, itemId, quantity }: {
      cartId: string;
      itemId: string;
      quantity: number;
    }) => {
      const updateData: UpdateCartItemDto = {
        quantity,
      };
      const updatedCart = await cartApiClient.updateItem(cartId, itemId, updateData);
      return CartMapper.toDomain(updatedCart);
    },
    onMutate: async ({ itemId, quantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.details() });

      // Snapshot the previous cart
      const previousCart = queryClient.getQueryData<Cart | null>(queryKeys.cart.details());

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.details(), context.previousCart);
      }
      console.error('Failed to update cart item:', err);
    },
    onSuccess: () => {
      // Invalidate cart queries
      invalidateQueries.cart();
    },
  });
};

// Mutation: Remove item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartId, itemId }: { cartId: string; itemId: string }) => {
      const updatedCart = await cartApiClient.removeItem(cartId, itemId);
      return CartMapper.toDomain(updatedCart);
    },
    onMutate: async ({ itemId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.details() });

      // Snapshot the previous cart
      const previousCart = queryClient.getQueryData<Cart | null>(queryKeys.cart.details());

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.details(), context.previousCart);
      }
      console.error('Failed to remove item from cart:', err);
    },
    onSuccess: () => {
      // Invalidate cart queries
      invalidateQueries.cart();
    },
  });
};

// Mutation: Clear entire cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartId: string) => {
      const clearedCart = await cartApiClient.clear(cartId);
      return CartMapper.toDomain(clearedCart);
    },
    onMutate: async (cartId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.details() });

      // Snapshot the previous cart
      const previousCart = queryClient.getQueryData<Cart | null>(queryKeys.cart.details());

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.details(), context.previousCart);
      }
      console.error('Failed to clear cart:', err);
    },
    onSuccess: () => {
      // Invalidate cart queries
      invalidateQueries.cart();
    },
  });
};

// Mutation: Apply promotion to cart
export const useApplyPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartId, promotionCode }: {
      cartId: string;
      promotionCode: string;
    }) => {
      const updatedCart = await cartApiClient.applyPromotion(cartId, promotionCode);
      return CartMapper.toDomain(updatedCart);
    },
    onError: (error) => {
      console.error('Failed to apply promotion:', error);
    },
    onSuccess: () => {
      // Invalidate cart and promotion queries
      invalidateQueries.cart();
      invalidateQueries.promotions();
    },
  });
};

// Mutation: Remove promotion from cart
export const useRemovePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartId: string) => {
      const updatedCart = await cartApiClient.removePromotion(cartId);
      return CartMapper.toDomain(updatedCart);
    },
    onError: (error) => {
      console.error('Failed to remove promotion:', error);
    },
    onSuccess: () => {
      // Invalidate cart and promotion queries
      invalidateQueries.cart();
      invalidateQueries.promotions();
    },
  });
};

// Mutation: Convert cart to order (checkout)
export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      cartId: string;
      shippingAddressId: string;
      billingAddressId: string;
      paymentMethodId: string;
      promotionCode?: string;
    }) => {
      return await cartApiClient.convertToOrder(params.cartId, {
        shippingAddressId: params.shippingAddressId,
        billingAddressId: params.billingAddressId,
        paymentMethodId: params.paymentMethodId,
        promotionCode: params.promotionCode,
      });
    },
    onSuccess: (data) => {
      // Invalidate cart queries after successful checkout
      invalidateQueries.cart();
      invalidateQueries.orders();
      console.log('Checkout successful, order ID:', data.orderId);
    },
    onError: (error) => {
      console.error('Checkout failed:', error);
    },
  });
};

// Mutation: Create new cart
export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      const cartDto = await cartApiClient.create(customerId);
      return CartMapper.toDomain(cartDto);
    },
    onSuccess: () => {
      // Invalidate cart queries
      invalidateQueries.cart();
    },
    onError: (error) => {
      console.error('Failed to create cart:', error);
    },
  });
};
