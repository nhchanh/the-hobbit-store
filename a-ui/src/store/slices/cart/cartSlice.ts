/**
 * Cart Redux Slice
 * Manages cart state following DDD principles
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationState } from '../../../types/common';
import { CartDto, CartItemDto, AddToCartRequest, UpdateCartItemRequest } from '../../../types/api';

// State interface
export interface CartState {
  // Current cart data
  cart: CartDto | null;

  // Application state
  state: ApplicationState;
  error: string | null;

  // UI state
  isAddingItem: boolean;
  isUpdatingItem: boolean;
  isRemovingItem: boolean;
  isClearingCart: boolean;
  isCheckingOut: boolean;

  // Last updated timestamp
  lastUpdated: string | null;

  // Optimistic updates
  optimisticUpdates: Record<string, any>;
}

// Initial state
const initialState: CartState = {
  cart: null,
  state: ApplicationState.IDLE,
  error: null,
  isAddingItem: false,
  isUpdatingItem: false,
  isRemovingItem: false,
  isClearingCart: false,
  isCheckingOut: false,
  lastUpdated: null,
  optimisticUpdates: {},
};

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      return data.data as CartDto;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ cartId, request }: { cartId: string; request: AddToCartRequest }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/${cartId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      const data = await response.json();
      return data.data as CartDto;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { cartId, itemId, request }: { cartId: string; itemId: string; request: UpdateCartItemRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/cart/${cartId}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }
      const data = await response.json();
      return data.data as CartDto;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ cartId, itemId }: { cartId: string; itemId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/${cartId}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      const data = await response.json();
      return data.data as CartDto;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (cartId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/${cartId}/clear`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      const data = await response.json();
      return data.data as CartDto;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous actions
    resetCartState: (state) => {
      state.cart = null;
      state.state = ApplicationState.IDLE;
      state.error = null;
      state.lastUpdated = null;
      state.optimisticUpdates = {};
    },

    clearError: (state) => {
      state.error = null;
    },

    // Optimistic updates for better UX
    optimisticallyAddItem: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      if (state.cart) {
        const { productId, quantity } = action.payload;
        const existingItemIndex = state.cart.cartItems.findIndex(item => item.productId === productId);

        if (existingItemIndex >= 0) {
          // Update existing item optimistically
          state.cart.cartItems[existingItemIndex].quantity += quantity;
          state.cart.cartItems[existingItemIndex].totalPrice =
            state.cart.cartItems[existingItemIndex].itemPrice * state.cart.cartItems[existingItemIndex].quantity;
        } else {
          // Add new item optimistically (we'll need product price from somewhere)
          const newItem: CartItemDto = {
            id: `temp-${Date.now()}`,
            cartId: state.cart.id,
            productId,
            quantity,
            itemPrice: 0, // Will be updated when API responds
            totalPrice: 0,
          };
          state.cart.cartItems.push(newItem);
        }

        // Recalculate total
        state.cart.totalAmount = state.cart.cartItems.reduce(
          (total, item) => total + item.totalPrice, 0
        );

        state.optimisticUpdates[productId] = { type: 'add', quantity };
      }
    },

    optimisticallyUpdateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      if (state.cart) {
        const { productId, quantity } = action.payload;
        const itemIndex = state.cart.cartItems.findIndex(item => item.productId === productId);

        if (itemIndex >= 0) {
          if (quantity === 0) {
            state.cart.cartItems.splice(itemIndex, 1);
          } else {
            state.cart.cartItems[itemIndex].quantity = quantity;
            state.cart.cartItems[itemIndex].totalPrice =
              state.cart.cartItems[itemIndex].itemPrice * quantity;
          }

          // Recalculate total
          state.cart.totalAmount = state.cart.cartItems.reduce(
            (total, item) => total + item.totalPrice, 0
          );

          state.optimisticUpdates[productId] = { type: 'update', quantity };
        }
      }
    },

    revertOptimisticUpdate: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      delete state.optimisticUpdates[productId];
      // In a real implementation, we'd revert the cart state here
    },
  },

  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.state = ApplicationState.LOADING;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.state = ApplicationState.SUCCESS;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.optimisticUpdates = {};
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.state = ApplicationState.ERROR;
        state.error = action.payload as string;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isAddingItem = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isAddingItem = false;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.optimisticUpdates = {};
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isAddingItem = false;
        state.error = action.payload as string;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isUpdatingItem = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isUpdatingItem = false;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.optimisticUpdates = {};
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isUpdatingItem = false;
        state.error = action.payload as string;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isRemovingItem = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isRemovingItem = false;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.optimisticUpdates = {};
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isRemovingItem = false;
        state.error = action.payload as string;
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.isClearingCart = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isClearingCart = false;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.optimisticUpdates = {};
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isClearingCart = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  resetCartState,
  clearError,
  optimisticallyAddItem,
  optimisticallyUpdateQuantity,
  revertOptimisticUpdate,
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
