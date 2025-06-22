/**
 * Inventory Domain Hook
 * Provides inventory-related business logic following DDD principles
 */

import { useCallback } from 'react';
import { Inventory } from '../../../domain/aggregates/inventory/Inventory';
import { InventoryStatus } from '../../../domain/valueobjects/inventory/InventoryValues';

// Mock data for demonstration - would be replaced with real Redux selectors
const mockInventories: Inventory[] = [];

export interface UseInventoryReturn {
  // State
  inventories: Inventory[];
  loading: {
    list: boolean;
    create: boolean;
    update: boolean;
    restock: boolean;
  };
  error: {
    list: string | null;
    create: string | null;
    update: string | null;
    restock: string | null;
  };

  // Actions
  fetchInventoryByProduct: (productId: string) => Promise<void>;
  fetchAllInventories: () => Promise<void>;
  createInventory: (inventoryData: {
    productId: string;
    initialStock: number;
    restockThreshold: number;
    locationCode?: string;
  }) => Promise<Inventory>;
  updateInventory: (productId: string, updates: {
    restockThreshold?: number;
    locationCode?: string;
  }) => Promise<Inventory>;

  // Domain actions
  addStock: (productId: string, quantity: number) => Promise<Inventory>;
  removeStock: (productId: string, quantity: number) => Promise<Inventory>;
  restockInventory: (productId: string, quantity: number) => Promise<Inventory>;
  markAsDiscontinued: (productId: string) => Promise<Inventory>;
  updateLocation: (productId: string, locationCode: string) => Promise<Inventory>;

  // Queries
  getInventoryByProduct: (productId: string) => Inventory | undefined;
  getLowStockInventories: () => Inventory[];
  getOutOfStockInventories: () => Inventory[];
  getInventoriesByStatus: (status: InventoryStatus) => Inventory[];
  getInventoriesByLocation: (locationCode: string) => Inventory[];

  // Business rules
  canFulfillOrder: (productId: string, quantity: number) => boolean;
  getAvailableStock: (productId: string) => number;
  isLowStock: (productId: string) => boolean;
  needsRestock: (productId: string) => boolean;
  isStale: (productId: string, days?: number) => boolean;

  // Analytics
  getTotalStockValue: () => number;
  getLowStockCount: () => number;
  getOutOfStockCount: () => number;
  getStaleInventoryCount: (days?: number) => number;
}

export function useInventory(): UseInventoryReturn {
  // Mock loading states
  const loading = {
    list: false,
    create: false,
    update: false,
    restock: false,
  };

  const error = {
    list: null,
    create: null,
    update: null,
    restock: null,
  };

  // Actions
  const fetchInventoryByProduct = useCallback(async (productId: string): Promise<void> => {
    console.log('Fetching inventory for product:', productId);
    // This would dispatch Redux action: dispatch(fetchInventoryByProduct(productId))
  }, []);

  const fetchAllInventories = useCallback(async (): Promise<void> => {
    console.log('Fetching all inventories');
    // This would dispatch Redux action: dispatch(fetchAllInventories())
  }, []);

  const createInventory = useCallback(async (inventoryData: {
    productId: string;
    initialStock: number;
    restockThreshold: number;
    locationCode?: string;
  }): Promise<Inventory> => {
    console.log('Creating inventory:', inventoryData);

    // Domain logic: Create new inventory aggregate
    const inventory = Inventory.create(
      { value: inventoryData.productId } as any,
      inventoryData.initialStock,
      inventoryData.restockThreshold,
      inventoryData.locationCode
    );

    // This would dispatch Redux action: dispatch(createInventory(inventoryData))
    return inventory;
  }, []);

  const updateInventory = useCallback(async (productId: string, updates: {
    restockThreshold?: number;
    locationCode?: string;
  }): Promise<Inventory> => {
    console.log('Updating inventory:', productId, updates);

    // Find existing inventory (would come from Redux state)
    const existingInventory = mockInventories.find(inv => inv.productId.value === productId);
    if (!existingInventory) {
      throw new Error('Inventory not found');
    }

    let updatedInventory = existingInventory;

    // Domain logic: Update inventory properties
    if (updates.restockThreshold !== undefined) {
      updatedInventory = updatedInventory.updateRestockThreshold(updates.restockThreshold);
    }

    if (updates.locationCode) {
      updatedInventory = updatedInventory.updateLocation(updates.locationCode);
    }

    // This would dispatch Redux action: dispatch(updateInventory({ productId, updates }))
    return updatedInventory;
  }, []);

  // Domain actions
  const addStock = useCallback(async (productId: string, quantity: number): Promise<Inventory> => {
    console.log('Adding stock:', productId, quantity);

    const existingInventory = mockInventories.find(inv => inv.productId.value === productId);
    if (!existingInventory) {
      throw new Error('Inventory not found');
    }

    // Domain logic: Add stock
    const updatedInventory = existingInventory.addStock(quantity);

    // This would dispatch Redux action: dispatch(addStock({ productId, quantity }))
    return updatedInventory;
  }, []);

  const removeStock = useCallback(async (productId: string, quantity: number): Promise<Inventory> => {
    console.log('Removing stock:', productId, quantity);

    const existingInventory = mockInventories.find(inv => inv.productId.value === productId);
    if (!existingInventory) {
      throw new Error('Inventory not found');
    }

    // Domain logic: Remove stock
    const updatedInventory = existingInventory.removeStock(quantity);

    // This would dispatch Redux action: dispatch(removeStock({ productId, quantity }))
    return updatedInventory;
  }, []);

  const restockInventory = useCallback(async (productId: string, quantity: number): Promise<Inventory> => {
    console.log('Restocking inventory:', productId, quantity);

    const existingInventory = mockInventories.find(inv => inv.productId.value === productId);
    if (!existingInventory) {
      throw new Error('Inventory not found');
    }

    // Domain logic: Restock
    const restockedInventory = existingInventory.restock(quantity);

    // This would dispatch Redux action: dispatch(restockInventory({ productId, quantity }))
    return restockedInventory;
  }, []);

  const markAsDiscontinued = useCallback(async (productId: string): Promise<Inventory> => {
    console.log('Marking inventory as discontinued:', productId);

    const existingInventory = mockInventories.find(inv => inv.productId.value === productId);
    if (!existingInventory) {
      throw new Error('Inventory not found');
    }

    // Domain logic: Mark as discontinued
    const discontinuedInventory = existingInventory.markAsDiscontinued();

    // This would dispatch Redux action: dispatch(markAsDiscontinued(productId))
    return discontinuedInventory;
  }, []);

  const updateLocation = useCallback(async (productId: string, locationCode: string): Promise<Inventory> => {
    console.log('Updating inventory location:', productId, locationCode);

    const existingInventory = mockInventories.find(inv => inv.productId.value === productId);
    if (!existingInventory) {
      throw new Error('Inventory not found');
    }

    // Domain logic: Update location
    const updatedInventory = existingInventory.updateLocation(locationCode);

    // This would dispatch Redux action: dispatch(updateLocation({ productId, locationCode }))
    return updatedInventory;
  }, []);

  // Queries
  const getInventoryByProduct = useCallback((productId: string): Inventory | undefined => {
    return mockInventories.find(inv => inv.productId.value === productId);
  }, []);

  const getLowStockInventories = useCallback((): Inventory[] => {
    return mockInventories.filter(inv => inv.isLowStock());
  }, []);

  const getOutOfStockInventories = useCallback((): Inventory[] => {
    return mockInventories.filter(inv => inv.isOutOfStock());
  }, []);

  const getInventoriesByStatus = useCallback((status: InventoryStatus): Inventory[] => {
    return mockInventories.filter(inv => inv.status === status);
  }, []);

  const getInventoriesByLocation = useCallback((locationCode: string): Inventory[] => {
    return mockInventories.filter(inv => inv.locationCode?.value() === locationCode);
  }, []);

  // Business rules
  const canFulfillOrder = useCallback((productId: string, quantity: number): boolean => {
    const inventory = getInventoryByProduct(productId);
    return inventory ? inventory.canFulfillOrder(quantity) : false;
  }, [getInventoryByProduct]);

  const getAvailableStock = useCallback((productId: string): number => {
    const inventory = getInventoryByProduct(productId);
    return inventory ? inventory.stockQuantity.value() : 0;
  }, [getInventoryByProduct]);

  const isLowStock = useCallback((productId: string): boolean => {
    const inventory = getInventoryByProduct(productId);
    return inventory ? inventory.isLowStock() : false;
  }, [getInventoryByProduct]);

  const needsRestock = useCallback((productId: string): boolean => {
    const inventory = getInventoryByProduct(productId);
    return inventory ? inventory.needsRestock() : false;
  }, [getInventoryByProduct]);

  const isStale = useCallback((productId: string, days: number = 90): boolean => {
    const inventory = getInventoryByProduct(productId);
    return inventory ? inventory.isStale(days) : false;
  }, [getInventoryByProduct]);

  // Analytics
  const getTotalStockValue = useCallback((): number => {
    // This would need product prices to calculate actual value
    return mockInventories.reduce((total, inv) => total + inv.stockQuantity.value(), 0);
  }, []);

  const getLowStockCount = useCallback((): number => {
    return getLowStockInventories().length;
  }, [getLowStockInventories]);

  const getOutOfStockCount = useCallback((): number => {
    return getOutOfStockInventories().length;
  }, [getOutOfStockInventories]);

  const getStaleInventoryCount = useCallback((days: number = 90): number => {
    return mockInventories.filter(inv => inv.isStale(days)).length;
  }, []);

  return {
    // State
    inventories: mockInventories,
    loading,
    error,

    // Actions
    fetchInventoryByProduct,
    fetchAllInventories,
    createInventory,
    updateInventory,

    // Domain actions
    addStock,
    removeStock,
    restockInventory,
    markAsDiscontinued,
    updateLocation,

    // Queries
    getInventoryByProduct,
    getLowStockInventories,
    getOutOfStockInventories,
    getInventoriesByStatus,
    getInventoriesByLocation,

    // Business rules
    canFulfillOrder,
    getAvailableStock,
    isLowStock,
    needsRestock,
    isStale,

    // Analytics
    getTotalStockValue,
    getLowStockCount,
    getOutOfStockCount,
    getStaleInventoryCount,
  };
}
