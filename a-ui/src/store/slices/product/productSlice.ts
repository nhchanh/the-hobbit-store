/**
 * Product Redux Slice
 * Manages product catalog state
 */

import { ApplicationState } from '../../../types/common';
import { ProductDto, CategoryDto, ProductSearchRequest, ProductSearchResponse } from '../../../types/api';

// State interface
export interface ProductState {
  // Product data
  products: ProductDto[];
  categories: CategoryDto[];
  currentProduct: ProductDto | null;

  // Search and filtering
  searchResults: ProductDto[];
  searchQuery: string;
  appliedFilters: Record<string, any>;
  sortCriteria: { field: string; direction: 'asc' | 'desc' };

  // Pagination
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };

  // Application state
  state: ApplicationState;
  searchState: ApplicationState;
  error: string | null;
  searchError: string | null;

  // Cache management
  lastFetched: string | null;
  isStale: boolean;
}

// Initial state
const initialState: ProductState = {
  products: [],
  categories: [],
  currentProduct: null,
  searchResults: [],
  searchQuery: '',
  appliedFilters: {},
  sortCriteria: { field: 'name', direction: 'asc' },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  },
  state: ApplicationState.IDLE,
  searchState: ApplicationState.IDLE,
  error: null,
  searchError: null,
  lastFetched: null,
  isStale: false,
};

// Simple slice without async thunks to avoid type errors
const productSlice = {
  name: 'product',
  initialState,
  reducers: {
    // Set products
    setProducts: (state: ProductState, action: { payload: ProductDto[] }) => {
      state.products = action.payload;
      state.state = ApplicationState.SUCCESS;
      state.lastFetched = new Date().toISOString();
      state.isStale = false;
    },

    // Set categories
    setCategories: (state: ProductState, action: { payload: CategoryDto[] }) => {
      state.categories = action.payload;
    },

    // Set current product
    setCurrentProduct: (state: ProductState, action: { payload: ProductDto | null }) => {
      state.currentProduct = action.payload;
    },

    // Set search results
    setSearchResults: (state: ProductState, action: { payload: { results: ProductDto[]; meta: any } }) => {
      state.searchResults = action.payload.results;
      state.pagination = action.payload.meta;
      state.searchState = ApplicationState.SUCCESS;
    },

    // Update search query
    updateSearchQuery: (state: ProductState, action: { payload: string }) => {
      state.searchQuery = action.payload;
    },

    // Update filters
    updateFilters: (state: ProductState, action: { payload: Record<string, any> }) => {
      state.appliedFilters = { ...state.appliedFilters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state: ProductState) => {
      state.appliedFilters = {};
    },

    // Update sort criteria
    updateSortCriteria: (state: ProductState, action: { payload: { field: string; direction: 'asc' | 'desc' } }) => {
      state.sortCriteria = action.payload;
    },

    // Set loading state
    setLoading: (state: ProductState) => {
      state.state = ApplicationState.LOADING;
      state.error = null;
    },

    // Set search loading state
    setSearchLoading: (state: ProductState) => {
      state.searchState = ApplicationState.LOADING;
      state.searchError = null;
    },

    // Set error
    setError: (state: ProductState, action: { payload: string }) => {
      state.state = ApplicationState.ERROR;
      state.error = action.payload;
    },

    // Set search error
    setSearchError: (state: ProductState, action: { payload: string }) => {
      state.searchState = ApplicationState.ERROR;
      state.searchError = action.payload;
    },

    // Mark data as stale
    markAsStale: (state: ProductState) => {
      state.isStale = true;
    },

    // Reset state
    resetProductState: (state: ProductState) => {
      return initialState;
    },
  },
};

// Export actions
export const {
  setProducts,
  setCategories,
  setCurrentProduct,
  setSearchResults,
  updateSearchQuery,
  updateFilters,
  clearFilters,
  updateSortCriteria,
  setLoading,
  setSearchLoading,
  setError,
  setSearchError,
  markAsStale,
  resetProductState,
} = productSlice.reducers;

// Export reducer
export default productSlice;
