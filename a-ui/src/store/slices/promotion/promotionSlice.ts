import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Promotion } from '../../../domain/aggregates/promotion/Promotion';
import { Id } from '../../../domain/valueobjects/shared/Id';
import { LoadingState, AsyncState } from '../../../types/common';

// State interface
export interface PromotionState extends AsyncState {
  items: Record<string, Promotion>;
  activePromotions: Promotion[];
  upcomingPromotions: Promotion[];
  selectedPromotionId: string | null;
}

// Initial state
const initialState: PromotionState = {
  items: {},
  activePromotions: [],
  upcomingPromotions: [],
  selectedPromotionId: null,
  loading: LoadingState.IDLE,
  error: null,
};

// Async thunks
export const fetchPromotionById = createAsyncThunk(
  'promotion/fetchById',
  async (promotionId: string) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockPromotion = Promotion.createPercentageDiscount(
      'SUMMER20',
      'Summer Sale',
      'Get 20% off on all products',
      20.0,
      new Date(),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      100
    );

    return {
      id: promotionId,
      promotion: mockPromotion,
    };
  }
);

export const fetchActivePromotions = createAsyncThunk(
  'promotion/fetchActive',
  async () => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockActivePromotions = [
      Promotion.createPercentageDiscount(
        'FLASH30',
        'Flash Sale',
        'Limited time offer - 30% off',
        30.0,
        new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Ends in 2 days
        50
      ),
      Promotion.createPercentageDiscount(
        'WEEKEND33',
        'Weekend Special',
        'Buy 2 get 1 free',
        33.33,
        new Date(Date.now() - 12 * 60 * 60 * 1000), // Started 12 hours ago
        new Date(Date.now() + 36 * 60 * 60 * 1000), // Ends in 36 hours
        20
      ),
    ];

    return mockActivePromotions;
  }
);

export const fetchUpcomingPromotions = createAsyncThunk(
  'promotion/fetchUpcoming',
  async () => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUpcomingPromotions = [
      Promotion.createPercentageDiscount(
        'BLACKFRIDAY50',
        'Black Friday Sale',
        'Biggest sale of the year - 50% off',
        50.0,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Starts in 7 days
        new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Ends in 10 days
        500
      ),
    ];

    return mockUpcomingPromotions;
  }
);

export const createPromotion = createAsyncThunk(
  'promotion/create',
  async (promotionData: {
    code: string;
    name: string;
    description: string;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    maxUsageLimit: number;
  }) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newPromotion = Promotion.createPercentageDiscount(
      promotionData.code,
      promotionData.name,
      promotionData.description,
      promotionData.discountPercentage,
      promotionData.startDate,
      promotionData.endDate,
      promotionData.maxUsageLimit
    );

    return newPromotion;
  }
);

export const updatePromotion = createAsyncThunk(
  'promotion/update',
  async ({ promotionId, updates }: {
    promotionId: string;
    updates: Partial<{
      name: string;
      description: string;
      discountPercentage: number;
      startDate: Date;
      endDate: Date;
      maxUsageLimit: number;
    }>;
  }) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      promotionId,
      updates,
    };
  }
);

export const activatePromotion = createAsyncThunk(
  'promotion/activate',
  async (promotionId: string) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return { promotionId };
  }
);

export const deactivatePromotion = createAsyncThunk(
  'promotion/deactivate',
  async (promotionId: string) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return { promotionId };
  }
);

// Slice
const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    selectPromotion: (state, action: PayloadAction<string>) => {
      state.selectedPromotionId = action.payload;
    },
    clearSelectedPromotion: (state) => {
      state.selectedPromotionId = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPromotionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch promotion by ID
      .addCase(fetchPromotionById.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(fetchPromotionById.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        state.items[action.payload.id] = action.payload.promotion;
      })
      .addCase(fetchPromotionById.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to fetch promotion';
      })

      // Fetch active promotions
      .addCase(fetchActivePromotions.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(fetchActivePromotions.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        state.activePromotions = action.payload;
        // Also update items record
        action.payload.forEach(promotion => {
          state.items[promotion.id.value] = promotion as any;
        });
      })
      .addCase(fetchActivePromotions.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to fetch active promotions';
      })

      // Fetch upcoming promotions
      .addCase(fetchUpcomingPromotions.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(fetchUpcomingPromotions.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        state.upcomingPromotions = action.payload;
        // Also update items record
        action.payload.forEach(promotion => {
          state.items[promotion.id.value] = promotion as any;
        });
      })
      .addCase(fetchUpcomingPromotions.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to fetch upcoming promotions';
      })

      // Create promotion
      .addCase(createPromotion.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        const promotion = action.payload;
        state.items[promotion.id.value] = promotion as any;

        // Add to appropriate category based on dates
        const now = new Date();
        if (promotion.isActive(now)) {
          state.activePromotions.push(promotion as any);
        } else if (promotion.period.startDate() > now) {
          state.upcomingPromotions.push(promotion as any);
        }
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to create promotion';
      })

      // Update promotion
      .addCase(updatePromotion.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        const { promotionId, updates } = action.payload;
        const promotion = state.items[promotionId];
        if (promotion) {
          // In a real implementation, you would apply the updates to create a new promotion
          // For now, we'll just mark it as updated (this would need proper domain method)
          // state.items[promotionId] = updatedPromotion;
        }
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to update promotion';
      })

      // Activate promotion
      .addCase(activatePromotion.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(activatePromotion.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        const { promotionId } = action.payload;
        const promotion = state.items[promotionId];
        if (promotion) {
          // Move from upcoming to active if necessary
          const upcomingIndex = state.upcomingPromotions.findIndex(p => p.id.value === promotionId);
          if (upcomingIndex !== -1) {
            const promotionToMove = state.upcomingPromotions.splice(upcomingIndex, 1)[0];
            state.activePromotions.push(promotionToMove);
          }
        }
      })
      .addCase(activatePromotion.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to activate promotion';
      })

      // Deactivate promotion
      .addCase(deactivatePromotion.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(deactivatePromotion.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        const { promotionId } = action.payload;

        // Remove from active promotions
        const activeIndex = state.activePromotions.findIndex(p => p.id.value === promotionId);
        if (activeIndex !== -1) {
          state.activePromotions.splice(activeIndex, 1);
        }
      })
      .addCase(deactivatePromotion.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to deactivate promotion';
      });
  },
});

// Actions
export const {
  selectPromotion,
  clearSelectedPromotion,
  clearError,
  resetPromotionState,
} = promotionSlice.actions;

// Selectors
export const selectPromotionItems = (state: { promotion: PromotionState }) => state.promotion.items;
export const selectActivePromotions = (state: { promotion: PromotionState }) => state.promotion.activePromotions;
export const selectUpcomingPromotions = (state: { promotion: PromotionState }) => state.promotion.upcomingPromotions;
export const selectSelectedPromotionId = (state: { promotion: PromotionState }) => state.promotion.selectedPromotionId;
export const selectPromotionById = (state: { promotion: PromotionState }, promotionId: string) =>
  state.promotion.items[promotionId];
export const selectPromotionLoading = (state: { promotion: PromotionState }) => state.promotion.loading;
export const selectPromotionError = (state: { promotion: PromotionState }) => state.promotion.error;

// Reducer
export default promotionSlice.reducer;
