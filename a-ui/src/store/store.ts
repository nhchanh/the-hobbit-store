/**
 * Redux Store Configuration
 * Central state management following DDD principles
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

// Slice imports
import cartSlice from './slices/cart/cartSlice';
import productSlice from './slices/product/productSlice';
import customerSlice from './slices/customer/customerSlice';
import orderSlice from './slices/order/orderSlice';
import uiSlice from './slices/ui/uiSlice';
import authSlice from './slices/auth/authSlice';
import wishlistSlice from './slices/wishlist/wishlistSlice';
import reviewSlice from './slices/review/reviewSlice';
import inventorySlice from './slices/inventory/inventorySlice';
import promotionSlice from './slices/promotion/promotionSlice';

// Middleware imports
import { persistenceMiddleware } from './middleware/persistence';
import { loggingMiddleware } from './middleware/logging';
import { analyticsMiddleware } from './middleware/analytics';
import { apiMiddleware } from './middleware/api';

export const store = configureStore({
  reducer: {
    // Domain slices
    cart: cartSlice,
    product: productSlice,
    customer: customerSlice,
    order: orderSlice,
    auth: authSlice,
    wishlist: wishlistSlice,
    review: reviewSlice,
    inventory: inventorySlice,
    promotion: promotionSlice,

    // UI slice
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'analytics/track',
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['ui.modals', 'ui.notifications'],
      },
    })
      .concat(persistenceMiddleware)
      .concat(loggingMiddleware)
      .concat(analyticsMiddleware)
      .concat(apiMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
