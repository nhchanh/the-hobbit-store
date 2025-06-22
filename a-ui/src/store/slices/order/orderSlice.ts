/**
 * Order Redux Slice
 * Manages order and purchase state
 */

import { ApplicationState } from '../../../types/common';
import { OrderDto, PaymentDto } from '../../../types/api';

// Order state interface
export interface OrderState {
  // Current orders
  orders: OrderDto[];
  currentOrder: OrderDto | null;

  // Order history
  orderHistory: OrderDto[];

  // Checkout process
  checkoutStep: number;
  isCheckingOut: boolean;
  checkoutError: string | null;

  // Payment processing
  isProcessingPayment: boolean;
  paymentError: string | null;
  currentPayment: PaymentDto | null;

  // Application state
  state: ApplicationState;
  error: string | null;

  // Pagination for order history
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };

  // Filters for order history
  filters: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

// Initial state
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  orderHistory: [],
  checkoutStep: 1,
  isCheckingOut: false,
  checkoutError: null,
  isProcessingPayment: false,
  paymentError: null,
  currentPayment: null,
  state: ApplicationState.IDLE,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

// Simple slice without async thunks
const orderSlice = {
  name: 'order',
  initialState,
  reducers: {
    // Order management
    setOrders: (state: OrderState, action: { payload: OrderDto[] }) => {
      state.orders = action.payload;
      state.state = ApplicationState.SUCCESS;
    },

    setCurrentOrder: (state: OrderState, action: { payload: OrderDto | null }) => {
      state.currentOrder = action.payload;
    },

    addOrder: (state: OrderState, action: { payload: OrderDto }) => {
      state.orders.unshift(action.payload);
    },

    updateOrder: (state: OrderState, action: { payload: OrderDto }) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index >= 0) {
        state.orders[index] = action.payload;
      }

      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    },

    // Order history
    setOrderHistory: (state: OrderState, action: {
      payload: {
        orders: OrderDto[];
        pagination: OrderState['pagination']
      }
    }) => {
      state.orderHistory = action.payload.orders;
      state.pagination = action.payload.pagination;
    },

    appendOrderHistory: (state: OrderState, action: { payload: OrderDto[] }) => {
      state.orderHistory.push(...action.payload);
    },

    // Checkout process
    setCheckoutStep: (state: OrderState, action: { payload: number }) => {
      state.checkoutStep = action.payload;
    },

    nextCheckoutStep: (state: OrderState) => {
      state.checkoutStep += 1;
    },

    previousCheckoutStep: (state: OrderState) => {
      if (state.checkoutStep > 1) {
        state.checkoutStep -= 1;
      }
    },

    startCheckout: (state: OrderState) => {
      state.isCheckingOut = true;
      state.checkoutError = null;
      state.checkoutStep = 1;
    },

    checkoutSuccess: (state: OrderState, action: { payload: OrderDto }) => {
      state.isCheckingOut = false;
      state.checkoutError = null;
      state.currentOrder = action.payload;
      state.orders.unshift(action.payload);
    },

    checkoutFailure: (state: OrderState, action: { payload: string }) => {
      state.isCheckingOut = false;
      state.checkoutError = action.payload;
    },

    resetCheckout: (state: OrderState) => {
      state.checkoutStep = 1;
      state.isCheckingOut = false;
      state.checkoutError = null;
    },

    // Payment processing
    startPaymentProcessing: (state: OrderState) => {
      state.isProcessingPayment = true;
      state.paymentError = null;
    },

    paymentSuccess: (state: OrderState, action: { payload: PaymentDto }) => {
      state.isProcessingPayment = false;
      state.currentPayment = action.payload;
      state.paymentError = null;
    },

    paymentFailure: (state: OrderState, action: { payload: string }) => {
      state.isProcessingPayment = false;
      state.paymentError = action.payload;
    },

    setCurrentPayment: (state: OrderState, action: { payload: PaymentDto | null }) => {
      state.currentPayment = action.payload;
    },

    // Filters and pagination
    setFilters: (state: OrderState, action: { payload: OrderState['filters'] }) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state: OrderState) => {
      state.filters = {};
    },

    setPagination: (state: OrderState, action: { payload: Partial<OrderState['pagination']> }) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Loading and error states
    setLoading: (state: OrderState) => {
      state.state = ApplicationState.LOADING;
      state.error = null;
    },

    setError: (state: OrderState, action: { payload: string }) => {
      state.state = ApplicationState.ERROR;
      state.error = action.payload;
    },

    clearError: (state: OrderState) => {
      state.error = null;
      state.checkoutError = null;
      state.paymentError = null;
    },

    // Reset order state
    resetOrderState: (state: OrderState) => {
      return initialState;
    },
  },
};

// Export actions
export const {
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrder,
  setOrderHistory,
  appendOrderHistory,
  setCheckoutStep,
  nextCheckoutStep,
  previousCheckoutStep,
  startCheckout,
  checkoutSuccess,
  checkoutFailure,
  resetCheckout,
  startPaymentProcessing,
  paymentSuccess,
  paymentFailure,
  setCurrentPayment,
  setFilters,
  clearFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
  resetOrderState,
} = orderSlice.reducers;

// Export reducer
export default orderSlice;
