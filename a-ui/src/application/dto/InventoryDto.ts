/**
 * Inventory Data Transfer Objects
 * For API communication and application layer
 */

// Base inventory DTO
export interface InventoryDto {
  id: string;
  productId: string;
  stockQuantity: number;
  restockThreshold: number;
  lastRestocked: string; // ISO date string
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  locationCode?: string;
}

// DTO for creating new inventory records
export interface CreateInventoryDto {
  productId: string;
  initialStock: number;
  restockThreshold: number;
  locationCode?: string;
}

// DTO for updating inventory stock
export interface UpdateInventoryStockDto {
  newQuantity: number;
  reason?: string;
  notes?: string;
}

// DTO for restocking inventory
export interface RestockInventoryDto {
  additionalQuantity: number;
  supplier?: string;
  cost?: number;
  notes?: string;
}

// DTO for inventory movement/transaction
export interface InventoryMovementDto {
  id: string;
  inventoryId: string;
  productId: string;
  movementType: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reason: string;
  referenceId?: string; // e.g., order ID, transfer ID
  notes?: string;
  createdAt: string;
  createdBy: string;
}

// DTO for inventory search and filtering
export interface InventorySearchDto {
  productId?: string;
  status?: InventoryDto['status'];
  lowStockOnly?: boolean;
  locationCode?: string;
  minQuantity?: number;
  maxQuantity?: number;
  lastRestockedAfter?: string;
  lastRestockedBefore?: string;
}

// DTO for inventory summary/report
export interface InventorySummaryDto {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  discontinuedItems: number;
  totalValue?: number;
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    totalStock: number;
    totalValue?: number;
  }>;
  byLocation: Array<{
    locationCode: string;
    totalStock: number;
    lowStockItems: number;
  }>;
}

// DTO for bulk inventory operations
export interface BulkInventoryUpdateDto {
  updates: Array<{
    productId: string;
    newQuantity: number;
    reason?: string;
  }>;
  notes?: string;
}

export default InventoryDto;
