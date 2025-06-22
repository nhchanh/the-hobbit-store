/**
 * Auth Redux Slice
 * Simplified auth state management
 */

import { ApplicationState } from '../../../types/common';

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  state: ApplicationState;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  state: ApplicationState.IDLE,
  error: null,
};

// Simple slice
const authSlice = {
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state: AuthState, action: { payload: boolean }) => {
      state.isAuthenticated = action.payload;
    },

    setTokens: (state: AuthState, action: { payload: { token: string; refreshToken: string } }) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },

    setUser: (state: AuthState, action: { payload: AuthState['user'] }) => {
      state.user = action.payload;
    },

    setState: (state: AuthState, action: { payload: ApplicationState }) => {
      state.state = action.payload;
    },

    setError: (state: AuthState, action: { payload: string | null }) => {
      state.error = action.payload;
    },

    reset: (state: AuthState) => {
      return initialState;
    },
  },
};

// Export actions
export const {
  setAuthenticated,
  setTokens,
  setUser,
  setState,
  setError,
  reset,
} = authSlice.reducers;

// Export reducer
export default authSlice;
