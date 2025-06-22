/**
 * Review Redux Slice
 * Manages review state following DDD principles
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '../../../domain/aggregates/review/Review';
import { ReviewStatus, VerificationStatus } from '../../../domain/valueobjects/review/ReviewValues';
import type { RootState } from '../../store';

// State interface
interface ReviewState {
  reviews: Record<string, Review>;
  productReviews: Record<string, string[]>; // productId -> reviewIds
  customerReviews: Record<string, string[]>; // customerId -> reviewIds
  loading: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: {
    list: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  filters: {
    productId?: string;
    customerId?: string;
    status?: ReviewStatus;
    rating?: number;
    verificationStatus?: VerificationStatus;
  };
}

// Initial state
const initialState: ReviewState = {
  reviews: {},
  productReviews: {},
  customerReviews: {},
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    list: null,
    create: null,
    update: null,
    delete: null,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  },
  filters: {},
};

// Async thunks
export const fetchReviewsByProduct = createAsyncThunk(
  'review/fetchByProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      // This would be replaced with actual API call
      const response = await fetch(`/api/v1/reviews?productId=${productId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createReview = createAsyncThunk(
  'review/create',
  async (reviewData: {
    productId: string;
    customerId: string;
    title: string;
    comment: string;
    rating: number;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error('Failed to create review');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateReview = createAsyncThunk(
  'review/update',
  async ({ reviewId, updates }: {
    reviewId: string;
    updates: { title?: string; comment?: string; rating?: number };
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update review');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/delete',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete review');
      return reviewId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const markReviewHelpful = createAsyncThunk(
  'review/markHelpful',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/reviews/${reviewId}/helpful`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark review as helpful');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Slice
const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state, action: PayloadAction<keyof ReviewState['error']>) => {
      state.error[action.payload] = null;
    },

    setFilters: (state, action: PayloadAction<Partial<ReviewState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {};
    },

    updatePagination: (state, action: PayloadAction<Partial<ReviewState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Domain actions (local state updates)
    publishReview: (state, action: PayloadAction<string>) => {
      const reviewId = action.payload;
      const review = state.reviews[reviewId];
      if (review && review.canBeModified()) {
        state.reviews[reviewId] = review.publish();
      }
    },

    hideReview: (state, action: PayloadAction<string>) => {
      const reviewId = action.payload;
      const review = state.reviews[reviewId];
      if (review) {
        state.reviews[reviewId] = review.hide();
      }
    },

    flagReview: (state, action: PayloadAction<string>) => {
      const reviewId = action.payload;
      const review = state.reviews[reviewId];
      if (review) {
        state.reviews[reviewId] = review.flag();
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch reviews by product
    builder
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading.list = false;
        const { reviews, productId, total } = action.payload;

        reviews.forEach((reviewData: any) => {
          const review = Review.fromData(reviewData);
          state.reviews[review.id.value] = review;

          // Update product reviews index
          if (!state.productReviews[productId]) {
            state.productReviews[productId] = [];
          }
          if (!state.productReviews[productId].includes(review.id.value)) {
            state.productReviews[productId].push(review.id.value);
          }

          // Update customer reviews index
          if (!state.customerReviews[review.customerId.value]) {
            state.customerReviews[review.customerId.value] = [];
          }
          if (!state.customerReviews[review.customerId.value].includes(review.id.value)) {
            state.customerReviews[review.customerId.value].push(review.id.value);
          }
        });

        state.pagination.total = total;
        state.pagination.hasMore = reviews.length === state.pagination.limit;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload as string;
      });

    // Create review
    builder
      .addCase(createReview.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading.create = false;
        const reviewData = action.payload;
        const review = Review.fromData(reviewData);
        state.reviews[review.id.value] = review;

        // Update indexes
        if (!state.productReviews[review.productId.value]) {
          state.productReviews[review.productId.value] = [];
        }
        state.productReviews[review.productId.value].push(review.id.value);

        if (!state.customerReviews[review.customerId.value]) {
          state.customerReviews[review.customerId.value] = [];
        }
        state.customerReviews[review.customerId.value].push(review.id.value);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload as string;
      });

    // Update review
    builder
      .addCase(updateReview.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading.update = false;
        const reviewData = action.payload;
        const review = Review.fromData(reviewData);
        state.reviews[review.id.value] = review;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload as string;
      });

    // Delete review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading.delete = false;
        const reviewId = action.payload;
        const review = state.reviews[reviewId];

        if (review) {
          // Remove from indexes
          const productReviews = state.productReviews[review.productId.value];
          if (productReviews) {
            state.productReviews[review.productId.value] = productReviews.filter(id => id !== reviewId);
          }

          const customerReviews = state.customerReviews[review.customerId.value];
          if (customerReviews) {
            state.customerReviews[review.customerId.value] = customerReviews.filter(id => id !== reviewId);
          }

          // Remove review
          delete state.reviews[reviewId];
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload as string;
      });

    // Mark review helpful
    builder
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        const reviewData = action.payload;
        const review = Review.fromData(reviewData);
        state.reviews[review.id.value] = review;
      });
  },
});

// Actions
export const {
  clearError,
  setFilters,
  clearFilters,
  updatePagination,
  publishReview,
  hideReview,
  flagReview,
} = reviewSlice.actions;

// Selectors
export const selectReviews = (state: RootState) => state.review.reviews;

export const selectReviewsByProduct = (state: RootState, productId: string): Review[] => {
  const reviewIds = state.review.productReviews[productId] || [];
  return reviewIds.map(id => state.review.reviews[id]).filter(Boolean);
};

export const selectReviewsByCustomer = (state: RootState, customerId: string): Review[] => {
  const reviewIds = state.review.customerReviews[customerId] || [];
  return reviewIds.map(id => state.review.reviews[id]).filter(Boolean);
};

export const selectReviewById = (state: RootState, reviewId: string): Review | undefined => {
  return state.review.reviews[reviewId];
};

export const selectReviewLoading = (state: RootState) => state.review.loading;

export const selectReviewError = (state: RootState) => state.review.error;

export const selectReviewPagination = (state: RootState) => state.review.pagination;

export const selectReviewFilters = (state: RootState) => state.review.filters;

export const selectFilteredReviews = (state: RootState): Review[] => {
  const { filters } = state.review;
  let reviews = Object.values(state.review.reviews);

  if (filters.productId) {
    reviews = reviews.filter(review => review.productId.value === filters.productId);
  }

  if (filters.customerId) {
    reviews = reviews.filter(review => review.customerId.value === filters.customerId);
  }

  if (filters.status) {
    reviews = reviews.filter(review => review.status === filters.status);
  }

  if (filters.rating) {
    reviews = reviews.filter(review => review.rating.value() === filters.rating);
  }

  if (filters.verificationStatus) {
    reviews = reviews.filter(review => review.verificationStatus === filters.verificationStatus);
  }

  return reviews;
};

export default reviewSlice.reducer;
