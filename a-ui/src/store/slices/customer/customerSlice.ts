/**
 * Customer Redux Slice
 * Manages customer and authentication state
 */

import { ApplicationState } from '../../../types/common';
import { CustomerDto, AddressDto } from '../../../types/api';

// Auth state
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
  lastLogin: string | null;
}

// Customer state interface
export interface CustomerState {
  // Authentication
  auth: AuthState;

  // Customer data
  customer: CustomerDto | null;

  // Application state
  state: ApplicationState;
  authState: ApplicationState;
  error: string | null;
  authError: string | null;

  // Profile management
  isUpdatingProfile: boolean;
  profileUpdateError: string | null;

  // Address management
  isUpdatingAddress: boolean;
  addressUpdateError: string | null;

  // Session management
  sessionExpired: boolean;
  rememberMe: boolean;
}

// Initial state
const initialState: CustomerState = {
  auth: {
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    tokenExpiresAt: null,
    lastLogin: null,
  },
  customer: null,
  state: ApplicationState.IDLE,
  authState: ApplicationState.IDLE,
  error: null,
  authError: null,
  isUpdatingProfile: false,
  profileUpdateError: null,
  isUpdatingAddress: false,
  addressUpdateError: null,
  sessionExpired: false,
  rememberMe: false,
};

// Simple slice without async thunks
const customerSlice = {
  name: 'customer',
  initialState,
  reducers: {
    // Authentication actions
    loginStart: (state: CustomerState) => {
      state.authState = ApplicationState.LOADING;
      state.authError = null;
    },

    loginSuccess: (state: CustomerState, action: {
      payload: {
        token: string;
        refreshToken: string;
        expiresAt: string;
        customer: CustomerDto;
        rememberMe?: boolean;
      }
    }) => {
      const { token, refreshToken, expiresAt, customer, rememberMe = false } = action.payload;

      state.authState = ApplicationState.SUCCESS;
      state.auth = {
        isAuthenticated: true,
        token,
        refreshToken,
        tokenExpiresAt: expiresAt,
        lastLogin: new Date().toISOString(),
      };
      state.customer = customer;
      state.rememberMe = rememberMe;
      state.sessionExpired = false;
      state.authError = null;
    },

    loginFailure: (state: CustomerState, action: { payload: string }) => {
      state.authState = ApplicationState.ERROR;
      state.authError = action.payload;
      state.auth.isAuthenticated = false;
    },

    logout: (state: CustomerState) => {
      state.auth = {
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        tokenExpiresAt: null,
        lastLogin: null,
      };
      state.customer = null;
      state.authState = ApplicationState.IDLE;
      state.authError = null;
      state.sessionExpired = false;
      state.rememberMe = false;
    },

    refreshTokenSuccess: (state: CustomerState, action: {
      payload: { token: string; expiresAt: string }
    }) => {
      state.auth.token = action.payload.token;
      state.auth.tokenExpiresAt = action.payload.expiresAt;
      state.sessionExpired = false;
    },

    refreshTokenFailure: (state: CustomerState) => {
      state.sessionExpired = true;
      state.auth.isAuthenticated = false;
    },

    // Customer profile actions
    setCustomer: (state: CustomerState, action: { payload: CustomerDto }) => {
      state.customer = action.payload;
      state.state = ApplicationState.SUCCESS;
    },

    updateProfileStart: (state: CustomerState) => {
      state.isUpdatingProfile = true;
      state.profileUpdateError = null;
    },

    updateProfileSuccess: (state: CustomerState, action: { payload: CustomerDto }) => {
      state.isUpdatingProfile = false;
      state.customer = action.payload;
      state.profileUpdateError = null;
    },

    updateProfileFailure: (state: CustomerState, action: { payload: string }) => {
      state.isUpdatingProfile = false;
      state.profileUpdateError = action.payload;
    },

    // Address management
    updateAddressStart: (state: CustomerState) => {
      state.isUpdatingAddress = true;
      state.addressUpdateError = null;
    },

    updateAddressSuccess: (state: CustomerState, action: { payload: AddressDto }) => {
      state.isUpdatingAddress = false;
      if (state.customer) {
        state.customer.address = action.payload;
      }
      state.addressUpdateError = null;
    },

    updateAddressFailure: (state: CustomerState, action: { payload: string }) => {
      state.isUpdatingAddress = false;
      state.addressUpdateError = action.payload;
    },

    // Error handling
    clearError: (state: CustomerState) => {
      state.error = null;
      state.authError = null;
      state.profileUpdateError = null;
      state.addressUpdateError = null;
    },

    setError: (state: CustomerState, action: { payload: string }) => {
      state.error = action.payload;
      state.state = ApplicationState.ERROR;
    },

    // Session management
    markSessionExpired: (state: CustomerState) => {
      state.sessionExpired = true;
    },

    setRememberMe: (state: CustomerState, action: { payload: boolean }) => {
      state.rememberMe = action.payload;
    },

    // Loading states
    setLoading: (state: CustomerState) => {
      state.state = ApplicationState.LOADING;
      state.error = null;
    },

    // Reset customer state
    resetCustomerState: (state: CustomerState) => {
      return initialState;
    },
  },
};

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenSuccess,
  refreshTokenFailure,
  setCustomer,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  updateAddressStart,
  updateAddressSuccess,
  updateAddressFailure,
  clearError,
  setError,
  markSessionExpired,
  setRememberMe,
  setLoading,
  resetCustomerState,
} = customerSlice.reducers;

// Export reducer
export default customerSlice;
