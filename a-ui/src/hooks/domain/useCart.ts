/**
 * Cart Domain Hook
 * Manages cart operations following DDD principles
 */

import { useCallback } from 'react';
import { ApplicationState } from '../../types/common';

// Mock hooks for now
const useAppSelector = (selector: any) => selector({
  cart: {
    cart: null,
    state: ApplicationState.IDLE,
    isAddingItem: false,
    isUpdatingItem: false,
    isRemovingItem: false,
  }
});
const useAppDispatch = () => (action: any) => console.log('Dispatch:', action);

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: any) => state.cart.cart);
  const cartState = useAppSelector((state: any) => state.cart.state);
  const isAddingItem = useAppSelector((state: any) => state.cart.isAddingItem);
  const isUpdatingItem = useAppSelector((state: any) => state.cart.isUpdatingItem);
  const isRemovingItem = useAppSelector((state: any) => state.cart.isRemovingItem);

  // Cart operations
  const addToCart = useCallback(async (productId: string, quantity: number) => {
    if (!cart) return;

    // Optimistic update
    dispatch({
      type: 'cart/optimisticallyAddItem',
      payload: { productId, quantity },
    });

    try {
      // Would call API
      await dispatch({
        type: 'cart/addToCart',
        payload: {
          cartId: cart.id,
          request: { productId, quantity },
        },
      });
    } catch (error) {
      // Revert optimistic update
      dispatch({
        type: 'cart/revertOptimisticUpdate',
        payload: productId,
      });
      throw error;
    }
  }, [cart, dispatch]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!cart) return;

    const cartItem = cart.cartItems.find((item: any) => item.productId === productId);
    if (!cartItem) return;

    // Optimistic update
    dispatch({
      type: 'cart/optimisticallyUpdateQuantity',
      payload: { productId, quantity },
    });

    try {
      if (quantity === 0) {
        await dispatch({
          type: 'cart/removeFromCart',
          payload: {
            cartId: cart.id,
            itemId: cartItem.id,
          },
        });
      } else {
        await dispatch({
          type: 'cart/updateCartItem',
          payload: {
            cartId: cart.id,
            itemId: cartItem.id,
            request: { quantity },
          },
        });
      }
    } catch (error) {
      // Revert optimistic update
      dispatch({
        type: 'cart/revertOptimisticUpdate',
        payload: productId,
      });
      throw error;
    }
  }, [cart, dispatch]);

  const removeFromCart = useCallback(async (productId: string) => {
    return updateQuantity(productId, 0);
  }, [updateQuantity]);

  const clearCart = useCallback(async () => {
    if (!cart) return;

    await dispatch({
      type: 'cart/clearCart',
      payload: cart.id,
    });
  }, [cart, dispatch]);

  // Cart calculations
  const getTotalItems = useCallback(() => {
    if (!cart) return 0;
    return cart.cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
  }, [cart]);

  const getTotalAmount = useCallback(() => {
    if (!cart) return 0;
    return cart.totalAmount;
  }, [cart]);

  const hasItems = useCallback(() => {
    return cart && cart.cartItems.length > 0;
  }, [cart]);

  const hasItem = useCallback((productId: string) => {
    if (!cart) return false;
    return cart.cartItems.some((item: any) => item.productId === productId);
  }, [cart]);

  const getItemQuantity = useCallback((productId: string) => {
    if (!cart) return 0;
    const item = cart.cartItems.find((item: any) => item.productId === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  // Loading states
  const isLoading = cartState === ApplicationState.LOADING;
  const isOperating = isAddingItem || isUpdatingItem || isRemovingItem;

  return {
    // Cart data
    cart,

    // Operations
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,

    // Calculations
    getTotalItems,
    getTotalAmount,
    hasItems,
    hasItem,
    getItemQuantity,

    // State
    isLoading,
    isOperating,
    isAddingItem,
    isUpdatingItem,
    isRemovingItem,
  };
};
