import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Inventory } from '../../../domain/aggregates/inventory/Inventory';
import { StockQuantity, RestockThreshold } from '../../../domain/valueobjects/inventory/InventoryValues';
import { Id } from '../../../domain/valueobjects/shared/Id';
import { LoadingState, AsyncState } from '../../../types/common';

// State interface
export interface InventoryState extends AsyncState {
  items: Record<string, Inventory>;
  lowStockItems: Inventory[];
  selectedInventoryId: string | null;
}

// Initial state
const initialState: InventoryState = {
  items: {},
  lowStockItems: [],
  selectedInventoryId: null,
  loading: LoadingState.IDLE,
  error: null,
};

// Async thunks
export const fetchInventoryById = createAsyncThunk(
  'inventory/fetchById',
  async (inventoryId: string) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockInventory = Inventory.create(
      Id.generate(),
      100,
      10,
      'WH1-A-001'
    );
    
    return {
      id: inventoryId,
      inventory: mockInventory,
    };
  }
);

export const fetchInventoryByProductId = createAsyncThunk(
  'inventory/fetchByProductId',
  async (productId: string) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockInventory = new Inventory({
      id: new InventoryId(`INV-${productId}`),
      productId: new ProductId(productId),
      stockQuantity: new StockQuantity(50),
      restockThreshold: new RestockThreshold(5),
      lastRestockDate: new Date(),
      location: 'Warehouse B',
    });
    
    return {
      productId,
      inventory: mockInventory,
    };
  }
);

export const fetchLowStockItems = createAsyncThunk(
  'inventory/fetchLowStock',
  async () => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLowStockItems = [
      new Inventory({
        id: new InventoryId('INV001'),
        productId: new ProductId('PROD001'),
        stockQuantity: new StockQuantity(3),
        restockThreshold: new RestockThreshold(10),
        lastRestockDate: new Date(),
        location: 'Warehouse A',
      }),
      new Inventory({
        id: new InventoryId('INV002'),
        productId: new ProductId('PROD002'),
        stockQuantity: new StockQuantity(1),
        restockThreshold: new RestockThreshold(5),
        lastRestockDate: new Date(),
        location: 'Warehouse B',
      }),
    ];
    
    return mockLowStockItems;
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ inventoryId, newQuantity }: { inventoryId: string; newQuantity: number }) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      inventoryId,
      newQuantity,
    };
  }
);

export const restockItem = createAsyncThunk(
  'inventory/restock',
  async ({ inventoryId, additionalQuantity }: { inventoryId: string; additionalQuantity: number }) => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      inventoryId,
      additionalQuantity,
    };
  }
);

// Slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    selectInventory: (state, action: PayloadAction<string>) => {
      state.selectedInventoryId = action.payload;
    },
    clearSelectedInventory: (state) => {
      state.selectedInventoryId = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetInventoryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory by ID
      .addCase(fetchInventoryById.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(fetchInventoryById.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        state.items[action.payload.id] = action.payload.inventory;
      })
      .addCase(fetchInventoryById.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to fetch inventory';
      })
      
      // Fetch inventory by product ID
      .addCase(fetchInventoryByProductId.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(fetchInventoryByProductId.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        const inventoryId = action.payload.inventory.id.value;
        state.items[inventoryId] = action.payload.inventory;
      })
      .addCase(fetchInventoryByProductId.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to fetch inventory by product ID';
      })
      
      // Fetch low stock items
      .addCase(fetchLowStockItems.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(fetchLowStockItems.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        state.lowStockItems = action.payload;
        // Also update items record
        action.payload.forEach(item => {
          state.items[item.id.value] = item;
        });
      })
      .addCase(fetchLowStockItems.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to fetch low stock items';
      })
      
      // Update stock
      .addCase(updateStock.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        const { inventoryId, newQuantity } = action.payload;
        const inventory = state.items[inventoryId];
        if (inventory) {
          // Create new inventory with updated stock quantity
          const updatedInventory = inventory.updateStock(new StockQuantity(newQuantity));
          state.items[inventoryId] = updatedInventory;
          
          // Update low stock items if necessary
          const isLowStock = updatedInventory.isLowStock();
          const existingLowStockIndex = state.lowStockItems.findIndex(item => item.id.value === inventoryId);
          
          if (isLowStock && existingLowStockIndex === -1) {
            state.lowStockItems.push(updatedInventory);
          } else if (!isLowStock && existingLowStockIndex !== -1) {
            state.lowStockItems.splice(existingLowStockIndex, 1);
          }
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to update stock';
      })
      
      // Restock item
      .addCase(restockItem.pending, (state) => {
        state.loading = LoadingState.LOADING;
        state.error = null;
      })
      .addCase(restockItem.fulfilled, (state, action) => {
        state.loading = LoadingState.SUCCEEDED;
        const { inventoryId, additionalQuantity } = action.payload;
        const inventory = state.items[inventoryId];
        if (inventory) {
          // Create new inventory with restocked quantity
          const currentQuantity = inventory.stockQuantity.value;
          const newQuantity = currentQuantity + additionalQuantity;
          const updatedInventory = inventory.restock(new StockQuantity(additionalQuantity));
          state.items[inventoryId] = updatedInventory;
          
          // Remove from low stock items if it's no longer low stock
          const lowStockIndex = state.lowStockItems.findIndex(item => item.id.value === inventoryId);
          if (lowStockIndex !== -1 && !updatedInventory.isLowStock()) {
            state.lowStockItems.splice(lowStockIndex, 1);
          }
        }
      })
      .addCase(restockItem.rejected, (state, action) => {
        state.loading = LoadingState.FAILED;
        state.error = action.error.message || 'Failed to restock item';
      });
  },
});

// Actions
export const {
  selectInventory,
  clearSelectedInventory,
  clearError,
  resetInventoryState,
} = inventorySlice.actions;

// Selectors
export const selectInventoryItems = (state: { inventory: InventoryState }) => state.inventory.items;
export const selectLowStockItems = (state: { inventory: InventoryState }) => state.inventory.lowStockItems;
export const selectSelectedInventoryId = (state: { inventory: InventoryState }) => state.inventory.selectedInventoryId;
export const selectInventoryById = (state: { inventory: InventoryState }, inventoryId: string) => 
  state.inventory.items[inventoryId];
export const selectInventoryByProductId = (state: { inventory: InventoryState }, productId: string) => 
  Object.values(state.inventory.items).find(inventory => inventory.productId.value === productId);
export const selectInventoryLoading = (state: { inventory: InventoryState }) => state.inventory.loading;
export const selectInventoryError = (state: { inventory: InventoryState }) => state.inventory.error;

// Reducer
export default inventorySlice.reducer;
