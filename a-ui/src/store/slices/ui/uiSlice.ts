/**
 * UI Redux Slice
 * Manages global UI state and application lifecycle
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationState, Notification } from '../../../types/common';

// Modal state interface
export interface Modal {
  id: string;
  type: string;
  props: Record<string, any>;
  isOpen: boolean;
}

// UI State interface
export interface UIState {
  // Global application state
  globalState: ApplicationState;

  // Navigation and layout
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;

  // Modals and overlays
  modals: Modal[];
  activeModal: string | null;

  // Notifications
  notifications: Notification[];

  // Theme and preferences
  theme: 'light' | 'dark' | 'system';
  locale: string;

  // Loading and progress
  loadingStates: Record<string, boolean>;
  progressBars: Record<string, number>;

  // Network status
  isOnline: boolean;
  lastOfflineTime: string | null;

  // Form states
  formStates: Record<string, {
    isSubmitting: boolean;
    isDirty: boolean;
    isValid: boolean;
    errors: Record<string, string>;
  }>;

  // Search and filters
  searchOpen: boolean;
  filtersOpen: boolean;

  // Cart UI state
  cartOpen: boolean;
  cartAnimation: 'idle' | 'adding' | 'removing' | 'updating';

  // Product UI state
  productViewMode: 'grid' | 'list';
  quickViewProduct: string | null;

  // Error handling
  globalError: string | null;
  errorBoundaryActive: boolean;
}

// Initial state
const initialState: UIState = {
  globalState: ApplicationState.INIT,
  sidebarOpen: false,
  mobileMenuOpen: false,
  modals: [],
  activeModal: null,
  notifications: [],
  theme: 'system',
  locale: 'en-US',
  loadingStates: {},
  progressBars: {},
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastOfflineTime: null,
  formStates: {},
  searchOpen: false,
  filtersOpen: false,
  cartOpen: false,
  cartAnimation: 'idle',
  productViewMode: 'grid',
  quickViewProduct: null,
  globalError: null,
  errorBoundaryActive: false,
};

// Simple slice without async thunks
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Global state management
    setGlobalState: (state, action: PayloadAction<ApplicationState>) => {
      state.globalState = action.payload;
    },

    // Navigation and layout
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleMobileMenu: (state: UIState) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    setMobileMenuOpen: (state: UIState, action: { payload: boolean }) => {
      state.mobileMenuOpen = action.payload;
    },

    // Modal management
    openModal: (state: UIState, action: { payload: { id: string; type: string; props?: Record<string, any> } }) => {
      const { id, type, props = {} } = action.payload;
      const existingModalIndex = state.modals.findIndex(modal => modal.id === id);

      if (existingModalIndex >= 0) {
        state.modals[existingModalIndex] = { id, type, props, isOpen: true };
      } else {
        state.modals.push({ id, type, props, isOpen: true });
      }

      state.activeModal = id;
    },

    closeModal: (state: UIState, action: { payload: string }) => {
      const modalId = action.payload;
      const modalIndex = state.modals.findIndex(modal => modal.id === modalId);

      if (modalIndex >= 0) {
        state.modals[modalIndex].isOpen = false;
      }

      if (state.activeModal === modalId) {
        // Find next open modal
        const nextModal = state.modals.find(modal => modal.isOpen);
        state.activeModal = nextModal ? nextModal.id : null;
      }
    },

    closeAllModals: (state: UIState) => {
      state.modals.forEach(modal => {
        modal.isOpen = false;
      });
      state.activeModal = null;
    },

    // Notification management
    addNotification: (state: UIState, action: { payload: Notification }) => {
      state.notifications.push(action.payload);
    },

    removeNotification: (state: UIState, action: { payload: string }) => {
      state.notifications = state.notifications.filter(notif => notif.id !== action.payload);
    },

    clearAllNotifications: (state: UIState) => {
      state.notifications = [];
    },

    // Theme and preferences
    setTheme: (state: UIState, action: { payload: 'light' | 'dark' | 'system' }) => {
      state.theme = action.payload;
    },

    setLocale: (state: UIState, action: { payload: string }) => {
      state.locale = action.payload;
    },

    // Loading states
    setLoadingState: (state: UIState, action: { payload: { key: string; loading: boolean } }) => {
      const { key, loading } = action.payload;
      if (loading) {
        state.loadingStates[key] = true;
      } else {
        delete state.loadingStates[key];
      }
    },

    setProgressBar: (state: UIState, action: { payload: { key: string; progress: number } }) => {
      const { key, progress } = action.payload;
      if (progress >= 100) {
        delete state.progressBars[key];
      } else {
        state.progressBars[key] = progress;
      }
    },

    // Network status
    setOnlineStatus: (state: UIState, action: { payload: boolean }) => {
      const wasOffline = !state.isOnline;
      state.isOnline = action.payload;

      if (!action.payload) {
        state.lastOfflineTime = new Date().toISOString();
      } else if (wasOffline) {
        // Coming back online
        state.lastOfflineTime = null;
      }
    },

    // Form states
    setFormState: (state: UIState, action: { payload: {
      formId: string;
      formState: Partial<UIState['formStates'][string]>
    } }) => {
      const { formId, formState } = action.payload;
      state.formStates[formId] = {
        ...state.formStates[formId],
        ...formState,
      };
    },

    clearFormState: (state: UIState, action: { payload: string }) => {
      delete state.formStates[action.payload];
    },

    // Search and filters
    toggleSearch: (state: UIState) => {
      state.searchOpen = !state.searchOpen;
    },

    setSearchOpen: (state: UIState, action: { payload: boolean }) => {
      state.searchOpen = action.payload;
    },

    toggleFilters: (state: UIState) => {
      state.filtersOpen = !state.filtersOpen;
    },

    setFiltersOpen: (state: UIState, action: { payload: boolean }) => {
      state.filtersOpen = action.payload;
    },

    // Cart UI
    toggleCart: (state: UIState) => {
      state.cartOpen = !state.cartOpen;
    },

    setCartOpen: (state: UIState, action: { payload: boolean }) => {
      state.cartOpen = action.payload;
    },

    setCartAnimation: (state: UIState, action: { payload: UIState['cartAnimation'] }) => {
      state.cartAnimation = action.payload;
    },

    // Product UI
    setProductViewMode: (state: UIState, action: { payload: 'grid' | 'list' }) => {
      state.productViewMode = action.payload;
    },

    setQuickViewProduct: (state: UIState, action: { payload: string | null }) => {
      state.quickViewProduct = action.payload;
    },

    // Error handling
    setGlobalError: (state: UIState, action: { payload: string | null }) => {
      state.globalError = action.payload;
    },

    setErrorBoundaryActive: (state: UIState, action: { payload: boolean }) => {
      state.errorBoundaryActive = action.payload;
    },

    // Reset UI state
    resetUIState: (state: UIState) => {
      return { ...initialState, theme: state.theme, locale: state.locale };
    },
  },
});

//actions
export const {
  setGlobalState,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setTheme,
  setLocale,
  setLoadingState,
  setProgressBar,
  setOnlineStatus,
  setFormState,
  clearFormState,
  toggleSearch,
  setSearchOpen,
  toggleFilters,
  setFiltersOpen,
  toggleCart,
  setCartOpen,
  setCartAnimation,
  setProductViewMode,
  setQuickViewProduct,
  setGlobalError,
  setErrorBoundaryActive,
  resetUIState,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
