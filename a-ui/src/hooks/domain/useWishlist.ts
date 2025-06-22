/**
 * Wishlist Domain Hook
 * Manages wishlist operations following DDD principles
 */

import { useCallback } from 'react';
import { ApplicationState } from '../../types/common';
import { WishlistDto, WishlistItemDto, AddToWishlistRequest } from '../../types/api';

// Mock hooks for now - would be real Redux hooks
const useAppSelector = (selector: any) => selector({
  wishlist: {
    wishlist: null,
    state: ApplicationState.IDLE,
    isAddingItem: false,
    isRemovingItem: false,
    isLoadingWishlist: false,
  }
});
const useAppDispatch = () => (action: any) => console.log('Dispatch:', action);

export const useWishlist = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const wishlist = useAppSelector((state: any) => state.wishlist.wishlist);
  const wishlistState = useAppSelector((state: any) => state.wishlist.state);
  const isAddingItem = useAppSelector((state: any) => state.wishlist.isAddingItem);
  const isRemovingItem = useAppSelector((state: any) => state.wishlist.isRemovingItem);
  const isLoadingWishlist = useAppSelector((state: any) => state.wishlist.isLoadingWishlist);

  // Wishlist operations
  const fetchWishlist = useCallback(async (customerId: string) => {
    dispatch({
      type: 'wishlist/fetchWishlist',
      payload: customerId,
    });
  }, [dispatch]);

  const addToWishlist = useCallback(async (customerId: string, productId: string) => {
    // Optimistic update
    dispatch({
      type: 'wishlist/optimisticallyAddItem',
      payload: { productId },
    });

    try {
      await dispatch({
        type: 'wishlist/addToWishlist',
        payload: {
          customerId,
          request: { productId },
        },
      });
    } catch (error) {
      // Revert optimistic update
      dispatch({
        type: 'wishlist/revertOptimisticUpdate',
        payload: productId,
      });
      throw error;
    }
  }, [dispatch]);

  const removeFromWishlist = useCallback(async (customerId: string, productId: string) => {
    // Optimistic update
    dispatch({
      type: 'wishlist/optimisticallyRemoveItem',
      payload: { productId },
    });

    try {
      await dispatch({
        type: 'wishlist/removeFromWishlist',
        payload: { customerId, productId },
      });
    } catch (error) {
      // Revert optimistic update by refetching
      await fetchWishlist(customerId);
      throw error;
    }
  }, [dispatch, fetchWishlist]);

  const moveToCart = useCallback(async (customerId: string, productId: string, quantity: number = 1) => {
    try {
      await dispatch({
        type: 'wishlist/moveToCart',
        payload: { customerId, productId, quantity },
      });
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearWishlist = useCallback(() => {
    dispatch({
      type: 'wishlist/clearWishlist',
    });
  }, [dispatch]);

  // Helper functions
  const getWishlistItems = useCallback((): WishlistItemDto[] => {
    return wishlist?.items || [];
  }, [wishlist]);

  const getWishlistItemCount = useCallback((): number => {
    return wishlist?.items.length || 0;
  }, [wishlist]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist?.items.some((item: WishlistItemDto) => item.productId === productId) || false;
  }, [wishlist]);

  const getWishlistItemIds = useCallback((): string[] => {
    return wishlist?.items.map((item: WishlistItemDto) => item.productId) || [];
  }, [wishlist]);

  const hasItems = useCallback((): boolean => {
    return (wishlist?.items.length || 0) > 0;
  }, [wishlist]);

  const isEmpty = useCallback((): boolean => {
    return !hasItems();
  }, [hasItems]);

  const getItemAddedDate = useCallback((productId: string): string | null => {
    const item = wishlist?.items.find((item: WishlistItemDto) => item.productId === productId);
    return item?.addedAt || null;
  }, [wishlist]);

  const getSortedItems = useCallback((sortBy: 'newest' | 'oldest' = 'newest'): WishlistItemDto[] => {
    const items = getWishlistItems();

    return [...items].sort((a, b) => {
      const dateA = new Date(a.addedAt || '').getTime();
      const dateB = new Date(b.addedAt || '').getTime();

      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [getWishlistItems]);

  const getRecentlyAdded = useCallback((): WishlistItemDto[] => {
    return getSortedItems('newest').slice(0, 5);
  }, [getSortedItems]);

  // Bulk operations
  const addMultipleToWishlist = useCallback(async (customerId: string, productIds: string[]) => {
    const promises = productIds.map(productId => addToWishlist(customerId, productId));
    await Promise.all(promises);
  }, [addToWishlist]);

  const removeMultipleFromWishlist = useCallback(async (customerId: string, productIds: string[]) => {
    const promises = productIds.map(productId => removeFromWishlist(customerId, productId));
    await Promise.all(promises);
  }, [removeFromWishlist]);

  const moveAllToCart = useCallback(async (customerId: string) => {
    const items = getWishlistItems();
    const promises = items.map(item => moveToCart(customerId, item.productId, 1));
    await Promise.all(promises);
  }, [getWishlistItems, moveToCart]);

  // Wishlist sharing and management
  const getShareableLink = useCallback((): string => {
    if (!wishlist) return '';
    // Mock implementation - would generate shareable link
    return `${window.location.origin}/wishlist/shared/${wishlist.id}`;
  }, [wishlist]);

  const exportWishlist = useCallback((): any => {
    if (!wishlist) return null;

    return {
      id: wishlist.id,
      customerId: wishlist.customerId,
      items: wishlist.items.map(item => ({
        productId: item.productId,
        addedAt: item.addedAt,
      })),
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  }, [wishlist]);

  // Comparison with cart
  const getItemsNotInCart = useCallback((cartItems: any[]): WishlistItemDto[] => {
    const cartProductIds = cartItems.map(item => item.productId);
    return getWishlistItems().filter(item => !cartProductIds.includes(item.productId));
  }, [getWishlistItems]);

  const getItemsAlsoInCart = useCallback((cartItems: any[]): WishlistItemDto[] => {
    const cartProductIds = cartItems.map(item => item.productId);
    return getWishlistItems().filter(item => cartProductIds.includes(item.productId));
  }, [getWishlistItems]);

  // Analytics helpers
  const getWishlistAge = useCallback((): number => {
    if (!wishlist?.createdAt) return 0;
    const createdDate = new Date(wishlist.createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  }, [wishlist]);

  const getMostRecentActivity = useCallback((): string | null => {
    const items = getWishlistItems();
    if (items.length === 0) return null;

    const mostRecent = items.reduce((latest, item) => {
      const itemDate = new Date(item.addedAt || '');
      const latestDate = new Date(latest.addedAt || '');
      return itemDate > latestDate ? item : latest;
    });

    return mostRecent.addedAt || null;
  }, [getWishlistItems]);

  // Loading states
  const isLoading = wishlistState === ApplicationState.LOADING || isLoadingWishlist;
  const isOperating = isAddingItem || isRemovingItem;

  return {
    // Data
    wishlist,
    wishlistItems: getWishlistItems(),

    // Operations
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist,

    // Helper functions
    getWishlistItems,
    getWishlistItemCount,
    isInWishlist,
    getWishlistItemIds,
    hasItems,
    isEmpty,
    getItemAddedDate,
    getSortedItems,
    getRecentlyAdded,

    // Bulk operations
    addMultipleToWishlist,
    removeMultipleFromWishlist,
    moveAllToCart,

    // Sharing and management
    getShareableLink,
    exportWishlist,

    // Comparison with cart
    getItemsNotInCart,
    getItemsAlsoInCart,

    // Analytics
    getWishlistAge,
    getMostRecentActivity,

    // State
    isLoading,
    isOperating,
    isAddingItem,
    isRemovingItem,
    state: wishlistState,
    itemCount: getWishlistItemCount(),
  };
};

// Specialized hook for wishlist item management
export const useWishlistItem = (productId: string) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, moveToCart, getItemAddedDate } = useWishlist();
  const dispatch = useAppDispatch();
  const customerId = useAppSelector((state: any) => state.auth.user?.id || 'mock-customer-id');

  const toggleWishlist = useCallback(async () => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(customerId, productId);
    } else {
      await addToWishlist(customerId, productId);
    }
  }, [isInWishlist, productId, removeFromWishlist, addToWishlist, customerId]);

  const moveItemToCart = useCallback(async (quantity: number = 1) => {
    await moveToCart(customerId, productId, quantity);
  }, [moveToCart, customerId, productId]);

  const itemAddedDate = getItemAddedDate(productId);
  const isItemInWishlist = isInWishlist(productId);

  return {
    isInWishlist: isItemInWishlist,
    addedDate: itemAddedDate,
    toggleWishlist,
    moveItemToCart,
    addToWishlist: () => addToWishlist(customerId, productId),
    removeFromWishlist: () => removeFromWishlist(customerId, productId),
  };
};
