/**
 * Wishlist Redux Slice
 * Manages wishlist state following DDD principles
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationState } from '../../../types/common';
import { WishlistDto, WishlistItemDto, AddToWishlistRequest } from '../../../types/api';

// State interface
export interface WishlistState {
  // Current wishlist data
  wishlist: WishlistDto | null;

  // Application state
  state: ApplicationState;
  error: string | null;

  // UI state
  isAddingItem: boolean;
  isRemovingItem: boolean;
  isLoadingWishlist: boolean;

  // Last updated timestamp
  lastUpdated: string | null;
}

// Initial state
const initialState: WishlistState = {
  wishlist: null,
  state: ApplicationState.IDLE,
  error: null,
  isAddingItem: false,
  isRemovingItem: false,
  isLoadingWishlist: false,
  lastUpdated: null,
};

// Async thunks for API calls
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (customerId: string, { rejectWithValue }) => {
    try {
      // Mock API call - would be real API
      const response = await fetch(`/api/wishlists/customer/${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ customerId, request }: { customerId: string; request: AddToWishlistRequest }, { rejectWithValue }) => {
    try {
      // Mock API call - would be real API
      const response = await fetch(`/api/wishlists/customer/${customerId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error('Failed to add item to wishlist');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ customerId, productId }: { customerId: string; productId: string }, { rejectWithValue }) => {
    try {
      // Mock API call - would be real API
      const response = await fetch(`/api/wishlists/customer/${customerId}/items/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }
      return { productId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ customerId, productId, quantity }: { customerId: string; productId: string; quantity?: number }, { rejectWithValue, dispatch }) => {
    try {
      // First add to cart
      // Then remove from wishlist
      await dispatch(removeFromWishlist({ customerId, productId }));

      return { productId, quantity: quantity || 1 };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear wishlist
    clearWishlist: (state) => {
      state.wishlist = null;
      state.state = ApplicationState.IDLE;
      state.error = null;
      state.lastUpdated = null;
    },

    // Set wishlist
    setWishlist: (state, action: PayloadAction<WishlistDto>) => {
      state.wishlist = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    // Optimistic add item
    optimisticallyAddItem: (state, action: PayloadAction<{ productId: string }>) => {
      if (state.wishlist) {
        const newItem: WishlistItemDto = {
          id: `temp-${Date.now()}`,
          wishlistId: state.wishlist.id,
          productId: action.payload.productId,
          addedAt: new Date().toISOString(),
        };
        state.wishlist.items.push(newItem);
      }
    },

    // Optimistic remove item
    optimisticallyRemoveItem: (state, action: PayloadAction<{ productId: string }>) => {
      if (state.wishlist) {
        state.wishlist.items = state.wishlist.items.filter(
          item => item.productId !== action.payload.productId
        );
      }
    },

    // Revert optimistic update
    revertOptimisticUpdate: (state, action: PayloadAction<string>) => {
      // In a real implementation, this would revert the specific optimistic update
      console.log('Reverting optimistic update for product:', action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.state = ApplicationState.LOADING;
        state.isLoadingWishlist = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.state = ApplicationState.SUCCESS;
        state.isLoadingWishlist = false;
        state.wishlist = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.state = ApplicationState.ERROR;
        state.isLoadingWishlist = false;
        state.error = action.payload as string;
      });

    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.isAddingItem = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isAddingItem = false;
        state.wishlist = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isAddingItem = false;
        state.error = action.payload as string;
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.isRemovingItem = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isRemovingItem = false;
        if (state.wishlist) {
          state.wishlist.items = state.wishlist.items.filter(
            item => item.productId !== action.payload.productId
          );
          state.lastUpdated = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isRemovingItem = false;
        state.error = action.payload as string;
      });

    // Move to cart
    builder
      .addCase(moveToCart.pending, (state) => {
        state.isRemovingItem = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.isRemovingItem = false;
        if (state.wishlist) {
          state.wishlist.items = state.wishlist.items.filter(
            item => item.productId !== action.payload.productId
          );
          state.lastUpdated = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.isRemovingItem = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  clearWishlist,
  setWishlist,
  optimisticallyAddItem,
  optimisticallyRemoveItem,
  revertOptimisticUpdate,
} = wishlistSlice.actions;

// Selectors
export const selectWishlist = (state: { wishlist: WishlistState }) => state.wishlist.wishlist;
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.wishlist?.items || [];
export const selectWishlistState = (state: { wishlist: WishlistState }) => state.wishlist.state;
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error;
export const selectIsLoadingWishlist = (state: { wishlist: WishlistState }) => state.wishlist.isLoadingWishlist;
export const selectIsAddingToWishlist = (state: { wishlist: WishlistState }) => state.wishlist.isAddingItem;
export const selectIsRemovingFromWishlist = (state: { wishlist: WishlistState }) => state.wishlist.isRemovingItem;

// Helper selectors
export const selectWishlistItemCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.wishlist?.items.length || 0;

export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.wishlist?.items.some(item => item.productId === productId) || false;

export const selectWishlistItemIds = (state: { wishlist: WishlistState }) =>
  state.wishlist.wishlist?.items.map(item => item.productId) || [];

export const selectWishlistLastUpdated = (state: { wishlist: WishlistState }) =>
  state.wishlist.lastUpdated;

// Export reducer
export default wishlistSlice.reducer;
